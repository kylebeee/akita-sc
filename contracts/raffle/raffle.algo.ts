import { pcg64Init, pcg64Random } from "../../utils/types/lib_pcg/pcg64.algo";
import { RandomnessBeacon } from "../../utils/types/vrf_beacon";
import { MAX_UINT64 } from "../../utils/constants";
import { ContractWithCreatorOnlyOptInAndArc59AndArc58AndGate } from "../../utils/base_contracts/gate.algo";
import { abimethod, Account, Application, arc4, assert, Asset, BoxMap, ensureBudget, Global, GlobalState, gtxn, itxn, OnCompleteAction, Txn, uint64 } from "@algorandfoundation/algorand-typescript";
import { arc4FindWinnerCursor, arc4RaffleState, arc4WeightLocation, arc4WeightsList } from "./types";
import { BoxWeightTotalsSize, ChunkSize, entryTotalMBR, MaxRefundIterationsPerGroup, RaffleBoxPrefixEntries, RaffleBoxPrefixEntriesByAddress, RaffleBoxPrefixWeights, RaffleGlobalStateKeyEndingRound, RaffleGlobalStateKeyEntryCount, RaffleGlobalStateKeyEntryID, RaffleGlobalStateKeyFindWinnersCursor, RaffleGlobalStateKeyGateID, RaffleGlobalStateKeyMaxTickets, RaffleGlobalStateKeyMinTickets, RaffleGlobalStateKeyPrize, RaffleGlobalStateKeyPrizeClaimed, RaffleGlobalStateKeyRefundMBRCursor, RaffleGlobalStateKeySalt, RaffleGlobalStateKeySeller, RaffleGlobalStateKeyStartingRound, RaffleGlobalStateKeyTicketAsset, RaffleGlobalStateKeyTicketCount, RaffleGlobalStateKeyVRFFailureCount, RaffleGlobalStateKeyWeightsBoxCount, RaffleGlobalStateKeyWeightTotals, RaffleGlobalStateKeyWinner, RaffleGlobalStateKeyWinningTicket, weightsListMBR } from "./constants";
import { ERR_ALL_REFUNDS_COMPLETE, ERR_ALREADY_ENTERED, ERR_ENTRY_DOES_NOT_EXIST, ERR_FAILED_GATE, ERR_INVALID_ASSET, ERR_INVALID_ENDING_ROUND, ERR_MUST_ALLOCATE_AT_LEAST_FOUR_HIGHEST_BIDS_CHUNKS, ERR_MUST_ALLOCATE_AT_MOST_FIFTEEN_HIGHEST_BIDS_CHUNKS, ERR_MUST_BE_CALLED_FROM_FACTORY, ERR_NO_WINNING_TICKET_YET, ERR_NOT_ENOUGH_TIME, ERR_NOT_LIVE, ERR_PRIZE_ALREADY_CLAIMED, ERR_PRIZE_NOT_CLAIMED, ERR_RAFFLE_HAS_NOT_ENDED, ERR_STILL_HAS_WEIGHTS_BOXES, ERR_TICKET_ASSET_ALGO, ERR_TICKET_ASSET_NOT_ALGO, ERR_WINNER_ALREADY_DRAWN, ERR_WINNER_ALREADY_FOUND, ERR_WINNER_NOT_FOUND } from "./errors";
import { ERR_INVALID_ASSET_RECEIVER, ERR_INVALID_PAYMENT_AMOUNT, ERR_INVALID_PAYMENT_RECEIVER } from "../../utils/errors";
import { GateArgs } from "../../utils/types/gates";
import { Address, methodSelector } from "@algorandfoundation/algorand-typescript/arc4";
import { PrizeBox } from "../prize_box/prize_box.algo";

export class Raffle extends ContractWithCreatorOnlyOptInAndArc59AndArc58AndGate {
  /** The asset required to enter the raffle */
  ticketAsset = GlobalState<uint64>({ key: RaffleGlobalStateKeyTicketAsset })
  /** The start round of the raffle as a unix timestamp */
  startingRound = GlobalState<uint64>({ key: RaffleGlobalStateKeyStartingRound })
  /** The end time of the raffle as a unix timestamp */
  endingRound = GlobalState<uint64>({ key: RaffleGlobalStateKeyEndingRound })
  /** the address selling the asset */
  seller = GlobalState<Account>({ key: RaffleGlobalStateKeySeller })
  /** The minimum number of tickets to use for the raffle */
  minTickets = GlobalState<uint64>({ key: RaffleGlobalStateKeyMinTickets })
  /** The maximum number of tickets users can enter the raffle with */
  maxTickets = GlobalState<uint64>({ key: RaffleGlobalStateKeyMaxTickets })
  /** The number of entries for the raffle */
  entryCount = GlobalState<uint64>({ key: RaffleGlobalStateKeyEntryCount })
  /** The number of tickets entered into the raffle */
  ticketCount = GlobalState<uint64>({ key: RaffleGlobalStateKeyTicketCount })
  /** the winning ticket */
  winningTicket = GlobalState<uint64>({ key: RaffleGlobalStateKeyWinningTicket })
  /** the winning address of the raffle */
  winner = GlobalState<Account>({ key: RaffleGlobalStateKeyWinner })
  /** the prize for the raffle if prizeBox is true prize represents the app id of the prize box, otherwise the asset being raffled */
  prize = GlobalState<Application>({ key: RaffleGlobalStateKeyPrize })
  /** Indicator for whether the prize has been claimed */
  prizeClaimed = GlobalState<boolean>({ key: RaffleGlobalStateKeyPrizeClaimed })
  /** the gate to use for the raffle */
  gateID = GlobalState<uint64>({ key: RaffleGlobalStateKeyGateID })
  /** counter for how many times we've failed to get rng from the beacon */
  vrfGetFailureCount = GlobalState<uint64>({ key: RaffleGlobalStateKeyVRFFailureCount })
  /** The id's of the raffle entries */
  entryID = GlobalState<uint64>({ key: RaffleGlobalStateKeyEntryID })
  /** the number of boxes allocated to tracking weights */
  weightsBoxCount = GlobalState<uint64>({ key: RaffleGlobalStateKeyWeightsBoxCount })
  /** totals for each box of weights for our skip list */
  weightTotals = GlobalState<arc4.StaticArray<arc4.UintN64, typeof BoxWeightTotalsSize>>({ key: RaffleGlobalStateKeyWeightTotals })
  /** 
   * cursors to track iteration of finding winner
   * index being for the bid iteration
   * amountIndex being the index for the amount of the bids seen
  */
  findWinnerCursors = GlobalState<arc4FindWinnerCursor>({ key: RaffleGlobalStateKeyFindWinnersCursor })
  /** cursor to track iteration of MBR refunds */
  refundMBRCursor = GlobalState<uint64>({ key: RaffleGlobalStateKeyRefundMBRCursor })
  /** the transaction id of the create application call for salting our VRF call */
  salt = GlobalState<uint64>({ key: RaffleGlobalStateKeySalt })

  /**
   * The entries for the raffle
   * 
   * 2_500 + (400 * (9 + 32)) = 18_900
   */
  entries = BoxMap<uint64, Address>({ keyPrefix: RaffleBoxPrefixEntries })

  /**
   * weights set for bidders
   * 
   * 2_500 + (400 * (9 + 32_768)) = 13_113_300
   */
  weights = BoxMap<uint64, arc4WeightsList>({ keyPrefix: RaffleBoxPrefixWeights })

  /** 
   * The address map of entries for the raffle
   * 
   * 2_500 + (400 * (33 + 8)) = 18_900
   * 
  */
  entriesByAddress = BoxMap<Address, arc4WeightLocation>({ keyPrefix: RaffleBoxPrefixEntriesByAddress })

  /**
   * 
   * @returns a boolean of whether the auction is live
   */
  // @ts-ignore
  @abimethod({ readonly: true })
  isLive(): boolean {
    return (
      Global.round <= this.startingRound.value
      && Global.round >= this.endingRound.value
    )
  }

  // @ts-ignore
  @abimethod({ onCreate: 'require' })
  createApplication(
    prize: uint64,
    ticketAsset: uint64,
    startingRound: uint64,
    endingRound: uint64,
    seller: Address,
    minTickets: uint64,
    maxTickets: uint64,
    gateID: uint64,
    akitaDAO: uint64,
  ): void {
    this.prize.value = Application(prize)
    this.ticketAsset.value = ticketAsset
    this.startingRound.value = startingRound
    assert(
      endingRound > startingRound && endingRound > Global.round,
      ERR_INVALID_ENDING_ROUND
    )
    this.endingRound.value = endingRound
    this.seller.value = seller.native
    this.minTickets.value = minTickets
    this.maxTickets.value = maxTickets
    this.entryCount.value = 0
    this.ticketCount.value = 0
    this.winningTicket.value = 0
    this.winner.value = Global.zeroAddress
    this.prizeClaimed.value = false
    this.gateID.value = gateID
    this.akitaDAO.value = Application(akitaDAO)
    this.entryID.value = 0
    this.weightsBoxCount.value = 0
    this.weightTotals.value = new arc4.StaticArray<arc4.UintN64, typeof BoxWeightTotalsSize>()
    this.refundMBRCursor.value = 0
  }

  init(payment: gtxn.PaymentTxn, weightListLength: uint64) {
    assert(Txn.sender === Global.creatorAddress, ERR_MUST_BE_CALLED_FROM_FACTORY)
    assert(weightListLength >= 4, ERR_MUST_ALLOCATE_AT_LEAST_FOUR_HIGHEST_BIDS_CHUNKS)
    assert(weightListLength < 16, ERR_MUST_ALLOCATE_AT_MOST_FIFTEEN_HIGHEST_BIDS_CHUNKS)

    assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
    assert(payment.amount === (weightListLength * weightsListMBR), ERR_INVALID_PAYMENT_AMOUNT)

    this.weightsBoxCount.value = weightListLength;
    for (let i = 0; i < weightListLength; i += 1) {
      this.weights(i).value = new arc4.StaticArray<arc4.UintN64, typeof ChunkSize>()
    }
  }

  enter(payment: gtxn.PaymentTxn, args: GateArgs): void {
    assert(this.isLive(), ERR_NOT_LIVE)
    assert(this.ticketAsset.value === 0, ERR_TICKET_ASSET_NOT_ALGO)
    const arc4Sender = new Address(Txn.sender)
    assert(this.gate(arc4Sender, this.gateID.value, args), ERR_FAILED_GATE)
    assert(!this.entriesByAddress(arc4Sender).exists, ERR_ALREADY_ENTERED)

    assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
    assert(
      payment.amount >= (this.minTickets.value + entryTotalMBR)
      && payment.amount <= (this.maxTickets.value + entryTotalMBR),
      ERR_INVALID_PAYMENT_AMOUNT
    )

    const loc = this.entryCount.value
    this.entries(loc).value = arc4Sender
    this.entriesByAddress(arc4Sender).value = new arc4.UintN64(this.entryCount.value)

    const amount = new arc4.UintN64(payment.amount - entryTotalMBR)

    this.weights(loc / ChunkSize).value[loc % ChunkSize] = amount
    const newWeight = new arc4.UintN64(this.weightTotals.value[loc / ChunkSize].native + amount.native)
    this.weightTotals.value[loc / ChunkSize] = newWeight

    this.entryCount.value += 1
    this.ticketCount.value += amount.native
  }

  enterAsa(
    payment: gtxn.PaymentTxn,
    assetXfer: gtxn.AssetTransferTxn,
    args: GateArgs
  ): void {
    assert(this.isLive(), ERR_NOT_LIVE);
    assert(this.ticketAsset.value !== 0, ERR_TICKET_ASSET_ALGO)
    const arc4Sender = new Address(Txn.sender)
    assert(this.gate(arc4Sender, this.gateID.value, args), ERR_FAILED_GATE);
    assert(!this.entriesByAddress(arc4Sender).exists, ERR_ALREADY_ENTERED)

    assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
    assert(payment.amount === entryTotalMBR, ERR_INVALID_PAYMENT_AMOUNT)

    assert(assetXfer.assetReceiver === Global.currentApplicationAddress, ERR_INVALID_ASSET_RECEIVER)
    assert(assetXfer.xferAsset.id === this.ticketAsset.value, ERR_INVALID_ASSET)
    assert(
      assetXfer.assetAmount >= this.minTickets.value
      && assetXfer.assetAmount <= this.maxTickets.value,
      ERR_INVALID_PAYMENT_AMOUNT
    )

    const loc = this.entryCount.value
    this.entries(loc).value = arc4Sender
    this.entriesByAddress(arc4Sender).value = new arc4.UintN64(this.entryCount.value)

    const amount = new arc4.UintN64(assetXfer.assetAmount)
    this.weights(loc / ChunkSize).value[loc % ChunkSize] = amount
    const newWeight = new arc4.UintN64(this.weightTotals.value[loc / ChunkSize].native + amount.native)
    this.weightTotals.value[loc / ChunkSize] = newWeight

    this.entryCount.value += 1
    this.ticketCount.value += amount.native
  }

  add(payment: gtxn.PaymentTxn, args: GateArgs): void {
    assert(this.isLive(), ERR_NOT_LIVE)
    assert(this.ticketAsset.value === 0, ERR_TICKET_ASSET_NOT_ALGO)
    const arc4Sender = new Address(Txn.sender)
    assert(this.gate(arc4Sender, this.gateID.value, args), ERR_FAILED_GATE)
    assert(this.entriesByAddress(arc4Sender).exists, ERR_ENTRY_DOES_NOT_EXIST)

    const loc = this.entriesByAddress(arc4Sender).value.native
    const amount = this.weights(loc / ChunkSize).value[loc % ChunkSize]

    assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
    assert(payment.amount <= this.maxTickets.value - amount.native)

    const newWeights = new arc4.UintN64(this.weights(loc / ChunkSize).value[loc % ChunkSize].native + payment.amount)
    this.weights(loc / ChunkSize).value[loc % ChunkSize] = newWeights
    const boxAmount = new arc4.UintN64(this.weightTotals.value[loc / ChunkSize].native + payment.amount)
    this.weightTotals.value[loc / ChunkSize] = boxAmount
    this.ticketCount.value += amount.native
  }

  addAsa(assetXfer: gtxn.AssetTransferTxn, args: GateArgs): void {
    assert(this.isLive(), ERR_NOT_LIVE)
    assert(this.ticketAsset.value !== 0, ERR_TICKET_ASSET_ALGO)
    const arc4Sender = new Address(Txn.sender)
    assert(this.gate(arc4Sender, this.gateID.value, args), ERR_FAILED_GATE)
    assert(this.entriesByAddress(arc4Sender).exists, ERR_ENTRY_DOES_NOT_EXIST)

    const loc = this.entriesByAddress(arc4Sender).value.native
    const amount = this.weights(loc / ChunkSize).value[loc % ChunkSize]

    assert(assetXfer.assetReceiver === Global.currentApplicationAddress, ERR_INVALID_ASSET_RECEIVER)
    assert(assetXfer.xferAsset.id === this.ticketAsset.value, ERR_INVALID_ASSET)
    assert(
      assetXfer.assetAmount <= this.maxTickets.value - amount.native,
      ERR_INVALID_PAYMENT_AMOUNT
    )

    const newWeights = new arc4.UintN64(this.weights(loc / ChunkSize).value[loc % ChunkSize].native + assetXfer.assetAmount)
    this.weights(loc / ChunkSize).value[loc % ChunkSize] = newWeights
    const boxAmount = new arc4.UintN64(this.weightTotals.value[loc / ChunkSize].native + assetXfer.assetAmount)
    this.weightTotals.value[loc / ChunkSize] = boxAmount
    this.ticketCount.value += amount.native
  }

  raffle(): void {
    const roundToUse = (this.endingRound.value + 1) + (4 * this.vrfGetFailureCount.value)
    assert(Global.round >= (roundToUse + 8), ERR_NOT_ENOUGH_TIME)
    assert(this.winningTicket.value === 0, ERR_WINNER_ALREADY_DRAWN)

    // TODO: switch to arc4.abiCall when available
    const seed = itxn
      .applicationCall({
        appId: super.getAppList().vrfBeacon,
        onCompletion: OnCompleteAction.NoOp,
        appArgs: [
          methodSelector(RandomnessBeacon.prototype.get),
          roundToUse,
          this.salt.value
        ],
        fee: 0,
      })
      .submit()
      .lastLog

    if (seed.length === 0) {
      this.vrfGetFailureCount.value += 1
      return
    }

    let rngState = pcg64Init(seed.slice(0, 16))

    // make upper bounds inclusive if we can
    let upperBound = this.ticketCount.value;
    if (upperBound < MAX_UINT64) {
      upperBound = upperBound += 1
    }

    const rngResult = pcg64Random(rngState, 1, upperBound, 1)
    this.winningTicket.value = rngResult[1][0].native
  }

  private getWinnerWeightBoxInfo(): [uint64, uint64] {
    let startingIndex = this.findWinnerCursors.value.index.native
    let currentRangeStart = this.findWinnerCursors.value.amountIndex.native

    for (let i = 0; i < this.weightsBoxCount.value; i += 1) {
      const boxStake = this.weightTotals.value[i].native
      if (this.winningTicket.value < (currentRangeStart + boxStake)) {
        return [startingIndex, currentRangeStart]
      }

      startingIndex += ChunkSize
      currentRangeStart += boxStake + 1
    }

    return [startingIndex, currentRangeStart]
  }

  findWinner(): void {
    assert(Global.round < this.endingRound.value, ERR_RAFFLE_HAS_NOT_ENDED)
    assert(this.winningTicket.value !== 0, ERR_NO_WINNING_TICKET_YET)
    assert(this.winner.value === Global.zeroAddress, ERR_WINNER_ALREADY_FOUND)

    const winningBoxInfo = this.getWinnerWeightBoxInfo()

    // walk the index to find the winner
    const startingIndex = winningBoxInfo[0]
    let currentRangeStart = winningBoxInfo[1]
    let currentRangeEnd: uint64 = 0

    const remainder = this.entryCount.value - startingIndex
    const iterationAmount = (remainder > ChunkSize) ? ChunkSize : remainder

    const weight = this.weights(startingIndex / ChunkSize).value

    const opUpIterationAmount = (iterationAmount * 40)
    ensureBudget(opUpIterationAmount)

    for (let i: uint64 = 0; i < iterationAmount; i += 1) {
      currentRangeEnd = currentRangeStart + weight[i].native
      if (this.winningTicket.value >= currentRangeStart && this.winningTicket.value <= currentRangeEnd) {
        this.winner.value = this.entries((startingIndex + i + 1)).value.native
      }
      currentRangeStart = currentRangeEnd + 1
    }

    const newIterationAmount = new arc4.UintN64(this.findWinnerCursors.value.index.native + iterationAmount)
    this.findWinnerCursors.value.index = newIterationAmount
    this.findWinnerCursors.value.amountIndex = new arc4.UintN64(currentRangeStart)
  }

  refundMBR(): void {
    const totalCap = (this.entryCount.value - 1)
    /** make sure we've already found the winner of the raffle */
    assert(this.winner.value !== Global.zeroAddress, ERR_WINNER_NOT_FOUND)
    /** make sure we haven't already refunded all MBR */
    assert(totalCap !== this.refundMBRCursor.value, ERR_ALL_REFUNDS_COMPLETE)

    const startingIndex = this.refundMBRCursor.value
    const remainder = totalCap - this.refundMBRCursor.value

    const iterationAmount = (remainder > MaxRefundIterationsPerGroup)
      ? MaxRefundIterationsPerGroup
      : remainder

    const opUpIterationAmount = iterationAmount * 100
    ensureBudget(opUpIterationAmount)

    for (let i = startingIndex; i < iterationAmount; i += 1) {
      const entry = this.entries(i).value
      this.entries(i).delete()
      this.entriesByAddress(entry).delete()
      itxn
        .payment({
          amount: entryTotalMBR,
          receiver: entry.native,
        })
        .submit()
    }

    this.refundMBRCursor.value += iterationAmount
  }

  claimRafflePrize(): void {
    assert(this.winner.value !== Global.zeroAddress, ERR_WINNER_NOT_FOUND)
    assert(!this.prizeClaimed.value, ERR_PRIZE_ALREADY_CLAIMED)

    itxn
      .applicationCall({
        appId: this.prize.value,
        onCompletion: OnCompleteAction.NoOp,
        appArgs: [
          methodSelector(PrizeBox.prototype.transfer),
          this.winner.value
        ],
        fee: 0,
      })
      .submit()

    if (this.ticketAsset.value === 0) {
      itxn
        .payment({
          receiver: this.seller.value,
          amount: this.ticketCount.value,
          fee: 0,
        })
        .submit()
    } else {
      if (this.seller.value.isOptedIn(Asset(this.ticketAsset.value))) {
        itxn
          .assetTransfer({
            assetReceiver: this.seller.value,
            assetCloseTo: this.seller.value,
            assetAmount: this.ticketCount.value,
            xferAsset: this.ticketAsset.value,
            fee: 0,
          })
          .submit()
      } else {
        this.arc59OptInAndSend(
          new Address(this.seller.value),
          this.ticketAsset.value,
          this.ticketCount.value,
          true
        );
      }
    }

    this.prizeClaimed.value = true
  }

  clearWeightsBoxes(): uint64 {
    assert(Txn.sender === Global.creatorAddress, ERR_MUST_BE_CALLED_FROM_FACTORY)

    for (let i: uint64 = 0; i < this.weightsBoxCount.value; i += 1) {
      const ri = (this.weightsBoxCount.value - 1) - i
      this.weights(ri).delete()
    }

    const returnAmount = this.weightsBoxCount.value * weightsListMBR

    itxn
      .payment({
        receiver: Global.creatorAddress,
        amount: returnAmount,
        fee: 0,
      })
      .submit()

    this.weightsBoxCount.value = 0
    return returnAmount
  }

  // @ts-ignore
  @abimethod({ allowActions: 'DeleteApplication' })
  deleteApplication(): void {
    assert(Txn.sender === Global.creatorAddress, ERR_MUST_BE_CALLED_FROM_FACTORY)
    assert(this.prizeClaimed.value, ERR_PRIZE_NOT_CLAIMED)
    assert((this.entryCount.value - 1) !== this.refundMBRCursor.value, ERR_ALL_REFUNDS_COMPLETE)
    assert(this.weightsBoxCount.value === 0, ERR_STILL_HAS_WEIGHTS_BOXES)
  }

  getState(): arc4RaffleState {
    return new arc4RaffleState({
      ticketAsset: new arc4.UintN64(this.ticketAsset.value),
      startingRound: new arc4.UintN64(this.startingRound.value),
      endingRound: new arc4.UintN64(this.endingRound.value),
      seller: new Address(this.seller.value),
      minTickets: new arc4.UintN64(this.minTickets.value),
      maxTickets: new arc4.UintN64(this.maxTickets.value),
      entryCount: new arc4.UintN64(this.entryCount.value),
      ticketCount: new arc4.UintN64(this.ticketCount.value),
      winningTicket: new arc4.UintN64(this.winningTicket.value),
      winner: new Address(this.winner.value),
      prize: new arc4.UintN64(this.prize.value.id),
      prizeClaimed: new arc4.Bool(this.prizeClaimed.value),
      gateID: new arc4.UintN64(this.gateID.value),
      vrfGetFailureCount: new arc4.UintN64(this.vrfGetFailureCount.value),
      entryID: new arc4.UintN64(this.entryID.value),
      refundMBRCursor: new arc4.UintN64(this.refundMBRCursor.value),
    })
  }
}