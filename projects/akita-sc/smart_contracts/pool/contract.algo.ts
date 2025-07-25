import {
  Account,
  Application,
  assert,
  assertMatch,
  Asset,
  BoxMap,
  Bytes,
  bytes,
  clone,
  Global,
  GlobalState,
  gtxn,
  itxn,
  Txn,
  uint64,
} from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Address, decodeArc4, Uint8 } from '@algorandfoundation/algorand-typescript/arc4'
import { AssetHolding, itob, sha256 } from '@algorandfoundation/algorand-typescript/op'
import { Staking } from '../staking/contract.algo'
import { Rewards } from '../rewards/contract.algo'
import { MetaMerkles } from '../meta-merkles/contract.algo'
import {
  DistributionType,
  EntryData,
  EntryKey,
  PoolStakingType,
  PoolState,
  PoolStatus,
  Reward,
  StakeEntry,
} from './types'
import { RootKey } from '../meta-merkles/types'
import { GateArgs } from '../utils/types/gates'
import { ERR_INVALID_PAYMENT, ERR_INVALID_TRANSFER } from '../utils/errors'
import { StakingType } from '../staking/types'
import {
  DisbursementPhaseAllocation,
  DisbursementPhaseFinalization,
  DisbursementPhaseIdle,
  DisbursementPhasePreparation,
  DistributionTypeEven,
  DistributionTypeFlat,
  DistributionTypePercentage,
  DistributionTypeShuffle,
  MaxGlobalStateUint64Array,
  POOL_STAKING_TYPE_HEARTBEAT,
  POOL_STAKING_TYPE_NONE,
  POOL_STAKING_TYPE_SOFT,
  PoolBoxPrefixDisbursements,
  PoolBoxPrefixEntries,
  PoolBoxPrefixEntriesByAddress,
  PoolBoxPrefixRewards,
  PoolEntriesByAddressMBR,
  PoolEntriesMBR,
  PoolGlobalStateKeyAkitaRoyalty,
  PoolGlobalStateKeyAkitaRoyaltyAmount,
  PoolGlobalStateKeyAllowLateSignups,
  PoolGlobalStateKeyCreator,
  PoolGlobalStateKeyEndTimestamp,
  PoolGlobalStateKeyEntryCount,
  PoolGlobalStateKeyGateID,
  PoolGlobalStateKeyGateSize,
  PoolGlobalStateKeyMarketplace,
  PoolGlobalStateKeyMarketplaceRoyalties,
  PoolGlobalStateKeyMaxEntries,
  PoolGlobalStateKeyMinimumStakeAmount,
  PoolGlobalStateKeyRewardCount,
  PoolGlobalStateKeySalt,
  PoolGlobalStateKeySignupTimestamp,
  PoolGlobalStateKeyStakeKey,
  PoolGlobalStateKeyStartTimestamp,
  PoolGlobalStateKeyStatus,
  PoolGlobalStateKeyTitle,
  PoolGlobalStateKeyTotalStaked,
  PoolGlobalStateKeyType,
  PoolGlobalStateKeyUniques,
  PoolStatusDraft,
  PoolStatusFinal,
  PoolUniquesMBR,
  WinnerCountCap,
} from './constants'
import { ERR_DAO_NOT_OPTED_IN, ERR_DISBURSEMENT_NOT_READY_FOR_FINALIZATION, ERR_FORBIDDEN, ERR_INVALID_DISBURSEMENT_PHASE, ERR_INVALID_POOL_TYPE_FOR_CHECK, ERR_MAX_ENTRIES_CANNOT_BE_GREATER_THAN_RATE, ERR_MUST_BE_ASA, ERR_NOT_ALGO, ERR_NOT_ENOUGH_FUNDS, ERR_NOT_READY_TO_DISBURSE, ERR_RATE_MUST_BE_GREATER_THAN_WINNER_COUNT, ERR_RATE_MUST_BE_GREATER_THAN_ZERO, ERR_STAKE_KEY_REQUIRED, ERR_WINNING_TICKETS_ALREADY_EXIST } from './errors'
import { UserAllocation } from '../rewards/types'
import { BasePool } from './base'
import { classes } from 'polytype'
import { Gate } from '../gates/contract.algo'
import { RandomnessBeacon } from '../utils/types/randomness-beacon'
import { pcg64Init, pcg64Random } from '../utils/types/lib_pcg/pcg64.algo'
import { BoxCostPerByte, MAX_UINT64 } from '../utils/constants'
import { calcPercent, gateCall, getAkitaAppList, getOtherAppList, getStakingFees, getUserImpact, getWalletIDUsingAkitaDAO, impactRange, originOr, originOrTxnSender, percentageOf } from '../utils/functions'
import { AkitaBaseEscrow } from '../utils/base-contracts/base'
import { AkitaDAOEscrowAccountStakingPools } from '../dao/constants'
import { MinDisbursementsMBR } from '../rewards/constants'

const MERKLE_TREE_TYPE_ASSET: uint64 = 1

export class Pool extends classes(
  BasePool,
  AkitaBaseEscrow
) {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  /** the status the pool is in */
  status = GlobalState<PoolStatus>({ key: PoolGlobalStateKeyStatus })
  /** title of the staking pool */
  title = GlobalState<string>({ key: PoolGlobalStateKeyTitle })
  /** the method of staking to be used for the pool */
  type = GlobalState<PoolStakingType>({ key: PoolGlobalStateKeyType })
  /** the timestamp when sign ups for the pool are allowed */
  signupTimestamp = GlobalState<uint64>({ key: PoolGlobalStateKeySignupTimestamp })
  /** whether signups are allowed after the staking pool begins */
  allowLateSignups = GlobalState<boolean>({ key: PoolGlobalStateKeyAllowLateSignups })
  /** the timestamp when the pool starts */
  startTimestamp = GlobalState<uint64>({ key: PoolGlobalStateKeyStartTimestamp })
  /** the timestamp when the pool ends */
  endTimestamp = GlobalState<uint64>({ key: PoolGlobalStateKeyEndTimestamp })
  /** the maximum entries allowed for the pool */
  maxEntries = GlobalState<uint64>({ key: PoolGlobalStateKeyMaxEntries })
  /** the number of entries in a pool */
  entryID = GlobalState<uint64>({ key: PoolGlobalStateKeyEntryCount })
  /** the number of rewards for the pool */
  rewardID = GlobalState<uint64>({ key: PoolGlobalStateKeyRewardCount })
  /** the total amount staked in the pool */
  totalStaked = GlobalState<uint64>({ key: PoolGlobalStateKeyTotalStaked })
  /**
   * the name for the meta merkle asset group to validate staking
   * stake key can be empty if distribution !== DistributionTypePercentage
   */
  stakeKey = GlobalState<RootKey>({ key: PoolGlobalStateKeyStakeKey })
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

  // BOXES ----------------------------------------------------------------------------------------

  /** indexed entries for efficient iteration */
  entries = BoxMap<uint64, EntryData>({ keyPrefix: PoolBoxPrefixEntries })
  /** the number of unique asset entries by address */
  uniques = BoxMap<Account, uint64>({ keyPrefix: PoolGlobalStateKeyUniques })
  /** the entries in the pool */
  entriesByAddress = BoxMap<EntryKey, uint64>({ keyPrefix: PoolBoxPrefixEntriesByAddress })
  /** the rewards for this staking pool */
  rewards = BoxMap<uint64, Reward>({ keyPrefix: PoolBoxPrefixRewards })
  /** the disbursements this pool as created & finalized */
  disbursements = BoxMap<uint64, bytes<0>>({ keyPrefix: PoolBoxPrefixDisbursements })


  // PRIVATE METHODS ------------------------------------------------------------------------------

  private newEntryID(): uint64 {
    const id = this.entryID.value
    this.entryID.value += 1
    return id
  }

  private newRewardID(): uint64 {
    const id = this.rewardID.value
    this.rewardID.value += 1
    return id
  }

  private payAkitaRoyalty(distribution: DistributionType, rate: uint64, asset: uint64, qualifiedStakers: uint64): void {
    let amount: uint64 = 0
    if (distribution === DistributionTypeFlat) {
      amount = calcPercent((qualifiedStakers * rate), this.akitaRoyalty.value)
    } else {
      amount = calcPercent(rate, this.akitaRoyalty.value)
    }

    this.akitaRoyaltyAmount.value = amount

    // pay the akita dao
    if (asset === 0) {
      itxn
        .payment({
          receiver: this.akitaDAOEscrow.value.address,
          amount,
        })
        .submit()
    } else {
      assert(this.akitaDAOEscrow.value.address.isOptedIn(Asset(asset)), ERR_DAO_NOT_OPTED_IN)

      itxn
        .assetTransfer({
          assetReceiver: this.akitaDAOEscrow.value.address,
          assetAmount: amount,
          xferAsset: asset,
        })
        .submit()
    }
  }

  private processPreparationPhase(rewardID: uint64, iterationAmount: uint64): void {
    const { disbursementCursor, distribution, rate, asset } = this.rewards(rewardID).value
    let count: uint64 = 0
    let total: uint64 = 0

    if ((disbursementCursor + iterationAmount) > this.entryID.value) {
      iterationAmount = this.entryID.value - disbursementCursor
    }

    for (let id = disbursementCursor; id < iterationAmount; id++) {
      const { disqualified, address, gateArgs, quantity } = clone(this.entries(id).value)
      if (disqualified) {
        continue
      }

      // if its not avg based, this check will disqualify the entry if necessary
      const { valid } = this.getStakeValue(id)
      if (!valid) {
        continue
      }

      if (this.gateID.value !== 0) {
        const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, address.native)
        const origin = originOr(wallet, address.native)

        const passes = gateCall(this.akitaDAO.value, origin, this.gateID.value, gateArgs)
        if (!passes) {
          if (this.type.value !== POOL_STAKING_TYPE_HEARTBEAT) {
            this.entries(id).value.disqualified = true
          }
          continue
        }
      }

      count += 1
      total += quantity
    }

    this.rewards(rewardID).value.qualifiedStakers += count 
    this.rewards(rewardID).value.qualifiedStake += total 

    if (this.entryID.value === disbursementCursor) {
      // end the phase & payout royalties
      this.rewards(rewardID).value.phase = DisbursementPhaseAllocation
      this.rewards(rewardID).value.disbursementCursor = 0

      this.payAkitaRoyalty(distribution, rate, asset, this.rewards(rewardID).value.qualifiedStakers)
    } else {
      // update the reward state for the next iteration
      this.rewards(rewardID).value.disbursementCursor += iterationAmount
    }
  }

  private createPercentageDisbursement(rewardID: uint64, iterationAmount: uint64): void {
    const {
      asset,
      disbursementCursor,
      activeDisbursementID,
      qualifiedStake,
      rate: amount
    } = this.rewards(rewardID).value

    if ((disbursementCursor + iterationAmount) > this.entryID.value) {
      iterationAmount = this.entryID.value - disbursementCursor
    }

    const actualAmount: uint64 = amount - this.akitaRoyaltyAmount.value
    let allocations: UserAllocation[] = []
    let sum: uint64 = 0

    for (let id = disbursementCursor; id < iterationAmount; id++) {
      const { disqualified, quantity, address } = this.entries(id).value
      if (disqualified) {
        continue
      }

      const individualAmount = calcPercent(actualAmount, percentageOf(quantity, qualifiedStake))
      allocations.push({ address, amount: individualAmount })
      sum += individualAmount
    }

    this.rewards(rewardID).value.disbursementCursor += iterationAmount

    this.createRewardAllocations(activeDisbursementID, asset, allocations, sum)

    if (this.entryID.value === (disbursementCursor + iterationAmount)) {
      this.rewards(rewardID).value.phase = DisbursementPhaseFinalization
      this.rewards(rewardID).value.disbursementCursor = 0
    }
  }

  private createFlatDisbursement(rewardID: uint64, iterationAmount: uint64): void {
    const {
      activeDisbursementID,
      disbursementCursor,
      qualifiedStakers,
      rate: amount,
      asset
    } = this.rewards(rewardID).value

    const total: uint64 = (qualifiedStakers * amount) - this.akitaRoyaltyAmount.value
    const percentageAkitaFee = calcPercent(amount, this.akitaRoyalty.value)
    const adjustedAmount: uint64 = amount - percentageAkitaFee
    const [balance] = AssetHolding.assetBalance(Global.currentApplicationAddress, asset)

    assert(balance >= total, ERR_NOT_ENOUGH_FUNDS)

    if ((disbursementCursor + iterationAmount) > this.entryID.value) {
      iterationAmount = this.entryID.value - disbursementCursor
    }

    let allocations: UserAllocation[] = []
    let sum: uint64 = 0

    for (let id = disbursementCursor; id < iterationAmount; id++) {
      const { disqualified, address } = this.entries(id).value
      if (disqualified) {
        continue
      }

      allocations.push({ address, amount: adjustedAmount })
      sum += adjustedAmount
    }

    const newCursorValue: uint64 = disbursementCursor + iterationAmount
    this.rewards(rewardID).value.disbursementCursor = newCursorValue
    this.createRewardAllocations(activeDisbursementID, asset, allocations, sum)

    if (this.entryID.value === newCursorValue) {
      this.rewards(rewardID).value.phase = DisbursementPhaseFinalization
      this.rewards(rewardID).value.disbursementCursor = 0
    }
  }

  private createEvenDisbursement(rewardID: uint64, iterationAmount: uint64): void {
    const {
      activeDisbursementID,
      disbursementCursor,
      qualifiedStakers,
      asset,
      rate: sum
    } = this.rewards(rewardID).value

    const balance = AssetHolding.assetBalance(Global.currentApplicationAddress, asset)[0]
    const actualSum: uint64 = sum - this.akitaRoyaltyAmount.value
    assert(balance >= actualSum, ERR_NOT_ENOUGH_FUNDS)

    if ((disbursementCursor + iterationAmount) > this.entryID.value) {
      iterationAmount = this.entryID.value - disbursementCursor
    }

    const amount: uint64 = actualSum / qualifiedStakers
    let allocations: UserAllocation[] = []
    for (let id = disbursementCursor; id < iterationAmount; id++) {
      const { disqualified, address } = this.entries(id).value
      if (disqualified) {
        continue
      }

      allocations.push({ address, amount })
    }

    const newCursorValue: uint64 = disbursementCursor + iterationAmount
    this.rewards(rewardID).value.disbursementCursor = newCursorValue
    this.createRewardAllocations(activeDisbursementID, asset, allocations, sum)

    if (this.entryID.value === newCursorValue) {
      this.rewards(rewardID).value.phase = DisbursementPhaseFinalization
      this.rewards(rewardID).value.disbursementCursor = 0
    }
  }

  private createShuffleDisbursement(rewardID: uint64, iterationAmount: uint64): void {
    const {
      activeDisbursementID,
      disbursementCursor,
      winnerCount,
      winningTickets: tickets,
      asset,
      rate: sum,
      raffleCursor,
    } = clone(this.rewards(rewardID).value)

    const balance = AssetHolding.assetBalance(Global.currentApplicationAddress, asset)[0]
    const actualSum: uint64 = sum - this.akitaRoyaltyAmount.value
    assert(balance >= actualSum, ERR_NOT_ENOUGH_FUNDS)

    if ((disbursementCursor + iterationAmount) > this.entryID.value) {
      iterationAmount = this.entryID.value - disbursementCursor
    }

    let amount = actualSum
    if (winnerCount > 0) {
      amount = actualSum / winnerCount
    }

    let { stake, ticket, disbursed } = raffleCursor
    let currentTicket = tickets[ticket]
    let currentRangeStart = stake
    let currentRangeEnd: uint64 = 0

    let allocations: UserAllocation[] = []
    for (let i = disbursementCursor; i < iterationAmount; i++) {
      const { disqualified, address, asset, quantity } = this.entries(i).value

      currentRangeEnd = currentRangeStart + quantity
      if (currentTicket >= currentRangeStart && currentTicket <= currentRangeEnd) {
        if (!disqualified) {
          allocations.push({ address, amount })
          disbursed++
        }

        if (ticket === tickets.length - 1) {
          // we didnt find enough winners, reset raffle
          if (winnerCount !== disbursed) {
            this.rewards(rewardID).value.disbursementCursor = 0
            this.rewards(rewardID).value.raffleCursor = {
              ticket: 0,
              stake: 0,
              disbursed: 0,
            }
            this.rewards(rewardID).value.winningTickets = []
            this.createRewardAllocations(activeDisbursementID, asset, allocations, sum)
            return
          }
          break
        }

        iterationAmount -= i
        ticket++
        currentTicket = tickets[ticket]
        this.rewards(rewardID).value.disbursementCursor = 0
        i = 0
        stake = 0
        currentRangeEnd = 0
      }
      currentRangeStart = currentRangeEnd + 1
    }

    this.createRewardAllocations(activeDisbursementID, asset, allocations, sum)

    if (winnerCount === disbursed) {
      this.rewards(rewardID).value.phase = DisbursementPhaseFinalization
      this.rewards(rewardID).value.disbursementCursor = 0
      this.rewards(rewardID).value.raffleCursor = {
        ticket: 0,
        stake: 0,
        disbursed: 0,
      }
      this.rewards(rewardID).value.winningTickets = []
    } else {
      this.rewards(rewardID).value.disbursementCursor += iterationAmount
      this.rewards(rewardID).value.raffleCursor = { ticket, stake, disbursed }
    }
  }

  private checkByID(id: uint64): { valid: boolean, balance: uint64 } {
    assert(
      this.type.value !== POOL_STAKING_TYPE_NONE || this.type.value !== POOL_STAKING_TYPE_HEARTBEAT,
      ERR_INVALID_POOL_TYPE_FOR_CHECK
    )

    const { disqualified, address, asset, quantity } = this.entries(id).value

    if (disqualified) {
      return { valid: false, balance: 0 }
    }

    if (this.type.value === POOL_STAKING_TYPE_SOFT) {
      const check = abiCall(
        Staking.prototype.softCheck,
        {
          appId: getAkitaAppList(this.akitaDAO.value).staking,
          args: [address, asset],
        }
      ).returnValue

      if (check.balance >= quantity) {
        return { valid: true, balance: check.balance }
      }
    } else {
      const info = abiCall(
        Staking.prototype.getInfo,
        {
          appId: getAkitaAppList(this.akitaDAO.value).staking,
          args: [
            address,
            {
              asset: asset,
              type: this.stakingType(),
            },
          ],
        }
      ).returnValue

      if (info.amount >= quantity) {
        return { valid: true, balance: info.amount }
      }
    }

    this.entries(id).value.disqualified = true
    return { valid: false, balance: 0 }
  }

  private getLatestWindowStart(interval: uint64): uint64 {
    return Global.latestTimestamp - ((Global.latestTimestamp - this.startTimestamp.value) % interval)
  }

  private validWindow(interval: uint64, last: uint64): boolean {
    const latestWindowStart = this.getLatestWindowStart(interval)
    return latestWindowStart !== Global.latestTimestamp && last < latestWindowStart
  }

  private stakingType(): StakingType {
    assert(this.type.value !== POOL_STAKING_TYPE_NONE, 'pool staking type is not set')
    return new Uint8(this.type.value.native - 1)
  }

  private getStakeValue(id: uint64): { valid: boolean, balance: uint64 } {
    if (this.type.value === POOL_STAKING_TYPE_NONE) {
      return { valid: true, balance: 0 }
    } else if (this.type.value === POOL_STAKING_TYPE_HEARTBEAT) {
      const { address, asset } = this.entries(id).value

      const avg = abiCall(
        Staking.prototype.getHeartbeatAverage,
        {
          appId: getAkitaAppList(this.akitaDAO.value).staking,
          args: [address, asset, true],
        }
      ).returnValue

      return { valid: true, balance: avg }
    }

    return this.checkByID(id)
  }

  private createRewards(title: string, timeToUnlock: uint64, expiration: uint64): uint64 {

    const rewardsApp = Application(getAkitaAppList(this.akitaDAO.value).rewards)
    const rewardMBR: uint64 = MinDisbursementsMBR + (BoxCostPerByte * Bytes(title).length)

    const mbrPayment = itxn.payment({
      receiver: rewardsApp.address,
      amount: rewardMBR,
    })

    return abiCall(
      Rewards.prototype.createDisbursement,
      {
        appId: rewardsApp,
        args: [
          mbrPayment,
          title,
          timeToUnlock,
          expiration,
          '',
        ],
      }
    ).returnValue
  }

  private createRewardAllocations(
    disbursementID: uint64,
    asset: uint64,
    allocations: UserAllocation[],
    sum: uint64
  ): void {

    const rewardsApp = Application(getAkitaAppList(this.akitaDAO.value).rewards)
    const mbrAmount = this.calculateAllocationMBR(allocations)

    if (asset === 0) {
      // ALGO allocations
      abiCall(
        Rewards.prototype.createUserAllocations,
        {
          appId: rewardsApp,
          args: [
            itxn.payment({
              receiver: rewardsApp.address,
              amount: mbrAmount + sum,
            }),
            disbursementID,
            allocations,
          ],
        }
      )
    } else {
      // ASA allocations
      abiCall(
        Rewards.prototype.createAsaUserAllocations,
        {
          appId: rewardsApp,
          args: [
            itxn.payment({
              receiver: rewardsApp.address,
              amount: mbrAmount,
            }),
            itxn.assetTransfer({
              assetReceiver: rewardsApp.address,
              xferAsset: asset,
              assetAmount: sum,
            }),
            disbursementID,
            allocations,
          ],
        }
      )
    }
  }

  private finalizeRewards(disbursementID: uint64): void {
    const rewardsApp = Application(getAkitaAppList(this.akitaDAO.value).rewards)

    abiCall(
      Rewards.prototype.finalizeDisbursement,
      {
        appId: rewardsApp,
        args: [disbursementID],
      }
    )
  }

  private validateReward(reward: Reward): void {
    // stake key is optional if the distribution type is not percentage based
    // we use this to qualify stakes for the pool but in some cases users may
    // want to distribute rewards on something else like subscription status
    // or impact score. In these cases the gate is the only requirement
    // and the stake key is not needed
    assert(
      this.stakeKey.value.address.native !== Global.zeroAddress || reward.distribution !== DistributionTypePercentage,
      ERR_STAKE_KEY_REQUIRED
    )

    // rate needs to be greater than the number of winners we want to pick for shuffles
    if (reward.distribution === DistributionTypeShuffle) {
      assert(reward.rate > reward.winnerCount && reward.winnerCount <= WinnerCountCap, ERR_RATE_MUST_BE_GREATER_THAN_WINNER_COUNT)
    }

    // if we're distributing evenly, the max entries must be less than or equal to the rate
    if (reward.distribution === DistributionTypeEven) {
      assert(this.maxEntries.value === 0 || this.maxEntries.value <= reward.rate, ERR_MAX_ENTRIES_CANNOT_BE_GREATER_THAN_RATE)
    }

    assert(reward.rate > 0, ERR_RATE_MUST_BE_GREATER_THAN_ZERO)
  }

  private calculateAllocationMBR(allocations: UserAllocation[]): uint64 {
    return 24_900 * allocations.length
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(
    title: string,
    type: StakingType,
    creator: Address,
    marketplace: Address,
    stakeKey: RootKey,
    minimumStakeAmount: uint64,
    gateID: uint64,
    maxEntries: uint64,
    akitaDAO: uint64
  ): void {
    this.status.value = PoolStatusDraft
    this.title.value = title
    this.type.value = type
    this.creator.value = creator.native
    this.marketplace.value = marketplace.native

    this.stakeKey.value = clone(stakeKey)
    this.minimumStakeAmount.value = minimumStakeAmount
    this.gateID.value = gateID
    this.maxEntries.value = maxEntries
    this.akitaDAO.value = Application(akitaDAO)
    this.salt.value = Txn.txId

    const fees = getStakingFees(this.akitaDAO.value)
    const impact = getUserImpact(this.akitaDAO.value, this.creator.value)
    this.akitaRoyalty.value = impactRange(impact, fees.impactTaxMin, fees.impactTaxMax)
  }

  init() {
    assert(Global.callerApplicationAddress === Global.creatorAddress, 'only the factory can init the pool')

    if (this.gateID.value > 0) {
      this.gateSize.value = abiCall(
        Gate.prototype.size,
        {
          appId: getAkitaAppList(this.akitaDAO.value).gate,
          args: [this.gateID.value],
        }
      ).returnValue
    }
  }

  @abimethod({ allowActions: 'DeleteApplication' })
  delete(caller: Address): void {
    assert(Txn.sender === Global.creatorAddress, 'call must come from factory')
    assert(caller.native === this.creator.value, 'only the creator can delete the pool')
    assert(this.status.value === PoolStatusDraft || Global.latestTimestamp > this.endTimestamp.value, 'the pool must be in draft or ended')
  }

  // POOL METHODS ---------------------------------------------------------------------------------

  /**
   * optin tells the contract to opt into an asa, it may also require the akita dao escrow to opt in
   * @param payment The payment transaction
   * @param asset The asset to be opted into
   */
  optin(payment: gtxn.PaymentTxn, asset: uint64): void {
    assert(Txn.sender === this.creator.value, ERR_FORBIDDEN)

    // check if the akita dao escrow is opted in to the asset
    // if it does that means 4 extra optins are needed
    const daoEscrowNeedsToOptIn = !this.akitaDAOEscrow.value.address.isOptedIn(Asset(asset))

    // if the dao escrow needs to opt in, we also may need to opt in the krby & mod escrows
    const optinMBR: uint64 = (
      Global.assetOptInMinBalance * (
        daoEscrowNeedsToOptIn ? 4 : 1
      )
    )

    const rewardsMBR: uint64 = this.rewardsMbr(WinnerCountCap) * 2

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: optinMBR + rewardsMBR,
      },
      ERR_INVALID_PAYMENT
    )

    itxn
      .assetTransfer({
        assetReceiver: Global.currentApplicationAddress,
        assetAmount: 0,
        xferAsset: asset,
      })
      .submit()

    this.optAkitaEscrowInAndSend(
      AkitaDAOEscrowAccountStakingPools,
      Asset(asset),
      0
    )
  }

  addReward(payment: gtxn.PaymentTxn, reward: Reward): void {
    assert(Txn.sender === this.creator.value, ERR_FORBIDDEN)
    assert(reward.asset === 0, ERR_NOT_ALGO)

    this.validateReward(reward)

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: {
          greaterThanEq: this.rewardsMbr(reward.winnerCount)
        }
      },
      ERR_INVALID_PAYMENT
    )

    const id = this.newRewardID()
    this.rewards(id).value = clone(reward)
  }

  addRewardAsa(payment: gtxn.PaymentTxn, assetXfer: gtxn.AssetTransferTxn, reward: Reward): void {
    assertMatch(
      assetXfer,
      {
        assetReceiver: Global.currentApplicationAddress,
        xferAsset: Asset(reward.asset),
        assetAmount: {
          greaterThan: 0
        }
      },
      ERR_INVALID_TRANSFER
    )

    this.addReward(payment, reward)
  }

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

    if (this.gateID.value !== 0) {
      const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
      const origin = originOrTxnSender(wallet)
      assert(
        gateCall(this.akitaDAO.value, origin, this.gateID.value, args),
        'user does not meet gate requirements'
      )
    }

    assert(
      (this.entryID.value + 1) < this.maxEntries.value ||
      this.maxEntries.value === 0,
      'pool has reached maximum entries'
    )

    // Verify payment for box storage (increased for additional box)
    const entryMBR: uint64 = PoolEntriesMBR + PoolEntriesByAddressMBR
    let total: uint64 = entryMBR * entries.length
    if (!this.uniques(Txn.sender).exists) {
      total += PoolUniquesMBR
    }

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: total,
      },
      ERR_INVALID_PAYMENT
    )

    const { address, name } = this.stakeKey.value

    for (let i: uint64 = 0; i < entries.length; i++) {
      assert(entries[i].quantity >= this.minimumStakeAmount.value, 'quantity is less than minimum stake amount')

      if (address.native !== Global.zeroAddress) {
        const verified = abiCall(
          MetaMerkles.prototype.verify,
          {
            appId: getAkitaAppList(this.akitaDAO.value).metaMerkles,
            args: [
              address,
              name,
              sha256(sha256(itob(entries[i].asset))),
              entries[i].proof,
              MERKLE_TREE_TYPE_ASSET,
            ],
          }
        ).returnValue

        assert(verified, 'failed to verify stake requirements')
      }

      // check their actual balance if the assets aren't escrowed
      if (
        this.type.value === POOL_STAKING_TYPE_HEARTBEAT ||
        this.type.value === POOL_STAKING_TYPE_SOFT
      ) {
        const [balance, optedIn] = AssetHolding.assetBalance(Txn.sender, entries[i].asset)
        assert(optedIn && balance >= entries[i].quantity, 'user does not have min balance')
      }

      const stakeInfo = abiCall(
        Staking.prototype.getInfo,
        {
          appId: getAkitaAppList(this.akitaDAO.value).staking,
          args: [
            new Address(Txn.sender),
            {
              asset: entries[i].asset,
              type: this.stakingType(),
            },
          ],
        }
      ).returnValue

      assert(stakeInfo.amount >= entries[i].quantity, 'user does not have enough staked')

      const entryID = this.newEntryID()
      this.entries(entryID).value = {
        address: new Address(Txn.sender),
        asset: entries[i].asset,
        quantity: entries[i].quantity,
        gateArgs: clone(args),
        disqualified: false
      }

      const aKey = {
        address: new Address(Txn.sender),
        asset: entries[i].asset,
      }

      this.entriesByAddress(aKey).value = entryID
    }
  }

  startDisbursement(rewardID: uint64): void {
    assert(this.isLive(), 'the pool is not live')
    assert(this.rewards(rewardID).exists, 'reward does not exist')

    const { phase, interval, lastDisbursementTimestamp, expiration } = this.rewards(rewardID).value

    assert(phase === DisbursementPhaseIdle, 'reward is already in a disbursement phase')
    assert(this.validWindow(interval, lastDisbursementTimestamp), 'distribution window is not open')

    const disbursementID = this.createRewards(
      `${this.title.value} - Rewards`,
      Global.latestTimestamp,
      Global.latestTimestamp + expiration
    )

    this.rewards(rewardID).value.qualifiedStakers = 0
    this.rewards(rewardID).value.qualifiedStake = 0
    this.rewards(rewardID).value.phase = DisbursementPhasePreparation
    this.rewards(rewardID).value.disbursementCursor = 0
    this.rewards(rewardID).value.activeDisbursementID = disbursementID
    this.rewards(rewardID).value.activeDisbursementRoundStart = Global.round
    this.rewards(rewardID).value.lastDisbursementTimestamp = Global.latestTimestamp
  }

  raffle(rewardID: uint64): void {
    assert(this.rewards(rewardID).exists, 'reward does not exist')
    const {
      phase,
      winningTickets,
      activeDisbursementRoundStart,
      vrfFailureCount,
      qualifiedStake
    } = clone(this.rewards(rewardID).value)

    assert(phase === DisbursementPhaseAllocation, ERR_INVALID_DISBURSEMENT_PHASE)
    assert(winningTickets.length === 0, ERR_WINNING_TICKETS_ALREADY_EXIST)

    const roundToUse: uint64 = activeDisbursementRoundStart + 1 + (4 * vrfFailureCount)

    const seed = abiCall(
      RandomnessBeacon.prototype.get,
      {
        appId: getOtherAppList(this.akitaDAO.value).vrfBeacon,
        args: [roundToUse, this.salt.value],
      }
    ).returnValue

    if (seed.length === 0) {
      this.rewards(rewardID).value.vrfFailureCount += 1
      return
    }

    // Initialize PCG randomness with the seed
    const rngState = pcg64Init(seed.slice(0, 16))

    // make upper bounds inclusive if we can
    let upperBound = qualifiedStake
    if (upperBound < MAX_UINT64) {
      upperBound += 1
    }

    const rngResult = pcg64Random(rngState, 1, upperBound, MaxGlobalStateUint64Array)

    this.rewards(rewardID).value.winningTickets = decodeArc4<uint64[]>(rngResult[1].bytes)
    this.rewards(rewardID).value.vrfFailureCount = 0
  }

  disburseRewards(rewardID: uint64, iterationAmount: uint64): void {
    // assert(this.status.value === PoolStatusDisbursing, 'pool is not in disbursement phase')
    assert(this.rewards(rewardID).exists, 'reward does not exist')

    const { phase, distribution, winningTickets } = clone(this.rewards(rewardID).value)

    assert(
      phase === DisbursementPhasePreparation ||
      phase === DisbursementPhaseAllocation,
      ERR_NOT_READY_TO_DISBURSE
    )

    if (phase === DisbursementPhasePreparation) {
      this.processPreparationPhase(rewardID, iterationAmount)
    } else {
      switch (distribution) {
        case DistributionTypePercentage: {
          this.createPercentageDisbursement(rewardID, iterationAmount)
          break
        }
        case DistributionTypeFlat: {
          this.createFlatDisbursement(rewardID, iterationAmount)
          break
        }
        case DistributionTypeEven: {
          this.createEvenDisbursement(rewardID, iterationAmount)
          break
        }
        case DistributionTypeShuffle: {
          if (winningTickets.length === 0) {
            this.raffle(rewardID)
          } else {
            this.createShuffleDisbursement(rewardID, iterationAmount)
          }
          break
        }
        default: {
          assert(false, 'unknown reward rate type')
        }
      }
    }
  }

  finalizeDistribution(rewardID: uint64): void {
    assert(this.rewards(rewardID).exists, 'reward does not exist')
    const { phase, activeDisbursementID } = this.rewards(rewardID).value
    assert(phase === DisbursementPhaseFinalization, ERR_DISBURSEMENT_NOT_READY_FOR_FINALIZATION)

    this.finalizeRewards(activeDisbursementID)

    this.disbursements(activeDisbursementID).create()

    this.rewards(rewardID).value.phase = DisbursementPhaseIdle
    this.rewards(rewardID).value.activeDisbursementID = 0
    this.rewards(rewardID).value.activeDisbursementRoundStart = 0
    this.rewards(rewardID).value.disbursementCursor = 0
    this.rewards(rewardID).value.qualifiedStakers = 0
    this.rewards(rewardID).value.qualifiedStake = 0
  }

  check(address: Address, asset: uint64): { valid: boolean, balance: uint64 } {
    const key: EntryKey = { address, asset }
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

  /** @returns a boolean indicating if the address has entered the staking pool */
  @abimethod({ readonly: true })
  isEntered(address: Address): boolean {
    return this.uniques(address.native).exists;
  }

  @abimethod({ readonly: true })
  getState(): PoolState {
    return {
      status: this.status.value,
      title: this.title.value,
      type: this.type.value,
      signupTimestamp: this.signupTimestamp.value,
      allowLateSignups: this.allowLateSignups.value,
      startTimestamp: this.startTimestamp.value,
      endTimestamp: this.endTimestamp.value,
      maxEntries: this.maxEntries.value,
      entryCount: (this.entryID.value + 1),
      rewardCount: (this.rewardID.value + 1),
      totalStaked: this.totalStaked.value,
      stakeKey: this.stakeKey.value,
      minimumStakeAmount: this.minimumStakeAmount.value,
      gateID: this.gateID.value,
      creator: new Address(this.creator.value),
    }
  }
}
