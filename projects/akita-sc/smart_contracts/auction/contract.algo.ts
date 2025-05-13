import { Account, Application, assert, assertMatch, Asset, BoxMap, bytes, ensureBudget, Global, GlobalState, gtxn, itxn, op, Txn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Address, Bool, decodeArc4, interpretAsArc4, StaticArray, StaticBytes, UintN128, UintN64 } from '@algorandfoundation/algorand-typescript/arc4'
import { arc4BidInfo, arc4FindWinnerCursors, BidInfo, FindWinnerCursors, WeightLocation, WeightsList } from './types'
import { AuctionBoxPrefixBids, AuctionBoxPrefixBidsByAddress, AuctionBoxPrefixLocations, AuctionBoxPrefixWeights, AuctionGlobalStateKeyBidAsset, AuctionGlobalStateKeyBidFee, AuctionGlobalStateKeyBidID, AuctionGlobalStateKeyBidMinimumIncrease, AuctionGlobalStateKeyBidTotal, AuctionGlobalStateKeyCreatorRoyalty, AuctionGlobalStateKeyEndTimestamp, AuctionGlobalStateKeyFindWInnerCursors, AuctionGlobalStateKeyGateID, AuctionGlobalStateKeyHighestBid, AuctionGlobalStateKeyIsPrizeBox, AuctionGlobalStateKeyMarketplace, AuctionGlobalStateKeyMarketplaceRoyalties, AuctionGlobalStateKeyPrize, AuctionGlobalStateKeyPrizeClaimed, AuctionGlobalStateKeyRaffleAmount, AuctionGlobalStateKeyRafflePrizeClaimed, AuctionGlobalStateKeyRaffleWinner, AuctionGlobalStateKeyRefundCount, AuctionGlobalStateKeyRefundMBRCursor, AuctionGlobalStateKeySalt, AuctionGlobalStateKeySeller, AuctionGlobalStateKeyStartingBid, AuctionGlobalStateKeyStartTimestamp, AuctionGlobalStateKeyUniqueAddressCount, AuctionGlobalStateKeyVRFFailureCount, AuctionGlobalStateKeyWeightedBidTotal, AuctionGlobalStateKeyWeightsBoxCount, AuctionGlobalStateKeyWeightTotals, AuctionGlobalStateKeyWinningTicket, ChunkSize, MaxRefundIterationsPerGroup, SNIPE_EXTENSION, SNIPE_RANGE } from './constants'
import { ERR_ALL_REFUNDS_COMPLETE, ERR_AUCTION_HAS_NOT_ENDED, ERR_AUCTION_NOT_LIVE, ERR_BID_ALREADY_REFUNDED, ERR_BID_NOT_FOUND, ERR_CANNOT_REFUND_MOST_RECENT_BID, ERR_MUST_ALLOCATE_AT_LEAST_THREE_HIGHEST_BIDS_CHUNKS, ERR_MUST_BE_CALLED_FROM_FACTORY, ERR_NOT_ALL_REFUNDS_COMPLETE, ERR_NOT_APPLICABLE_TO_THIS_AUCTION, ERR_NOT_ENOUGH_TIME, ERR_PRIZE_ALREADY_CLAIMED, ERR_PRIZE_NOT_CLAIMED, ERR_RAFFLE_ALREADY_PRIZE_CLAIMED, ERR_RAFFLE_NOT_PRIZE_CLAIMED, ERR_RAFFLE_WINNER_HAS_NOT_CLAIMED, ERR_STILL_HAS_HIGHEST_BIDS_BOXES, ERR_TOO_MANY_PARTICIPANTS, ERR_WINNER_ALREADY_DRAWN, ERR_WINNER_ALREADY_FOUND, ERR_WINNER_NOT_FOUND, ERR_WINNING_NUMBER_NOT_FOUND } from './errors'
import { RoyaltyAmounts } from '../utils/types/royalties'
import { submitGroup } from '@algorandfoundation/algorand-typescript/itxn'
import { ERR_FAILED_GATE, ERR_INVALID_APP, ERR_INVALID_ASSET, ERR_INVALID_PAYMENT } from '../utils/errors'
import { RandomnessBeacon } from '../utils/types/randomness-beacon'
import { pcg64Init, pcg64Random } from '../utils/types/lib_pcg/pcg64.algo'
import { AccountMinimumBalance, MAX_UINT64 } from '../utils/constants'
import { classes } from 'polytype'
import { BaseAuction } from './base'
import { ContractWithCreatorOnlyOptIn } from '../utils/base-contracts/optin'
import { GateArgs } from '../utils/types/gates'
import { PrizeBox } from '../prize-box/contract.algo'
import { AkitaBaseEscrow } from '../utils/base-contracts/base'
import { arc58OptInAndSend, arc59OptInAndSend, calcPercent, gateCheck, getNFTFees, getOtherAppList, getUserImpact, impactRange } from '../utils/functions'
import { AkitaDAOEscrowAccountAuctions } from '../dao/constants'

export class Auction extends classes(
  BaseAuction,
  AkitaBaseEscrow,
  ContractWithCreatorOnlyOptIn
) {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  /** the asset up for auction */
  prize = GlobalState<uint64>({ key: AuctionGlobalStateKeyPrize })
  /** whether or not the prize is an asset or a prize box */
  isPrizeBox = GlobalState<boolean>({ key: AuctionGlobalStateKeyIsPrizeBox })
  /** whether the prize has been claimed */
  prizeClaimed = GlobalState<boolean>({ key: AuctionGlobalStateKeyPrizeClaimed })
  /** the asset that is being used for bidding in the auction */
  bidAsset = GlobalState<Asset>({ key: AuctionGlobalStateKeyBidAsset })
  /** the percentage fee to take for the raffle on each bid in hundreds to support two decimals */
  bidFee = GlobalState<uint64>({ key: AuctionGlobalStateKeyBidFee })
  /** the starting amount to begin bids at */
  startingBid = GlobalState<uint64>({ key: AuctionGlobalStateKeyStartingBid })
  /** the smallest amount each new bid need increment the auction price */
  bidMinimumIncrease = GlobalState<uint64>({ key: AuctionGlobalStateKeyBidMinimumIncrease })
  /** the unix time that the auction starts on */
  startTimestamp = GlobalState<uint64>({ key: AuctionGlobalStateKeyStartTimestamp })
  /** the round that the auction ends on */
  endTimestamp = GlobalState<uint64>({ key: AuctionGlobalStateKeyEndTimestamp })
  /** the address selling the asset */
  seller = GlobalState<Account>({ key: AuctionGlobalStateKeySeller })
  /** the royalty percentage the creator will get for the auction */
  creatorRoyalty = GlobalState<uint64>({ key: AuctionGlobalStateKeyCreatorRoyalty })
  /**
   * The address of the marketplace that created the auction to send the fee to
   *
   * IMPORTANT: this is a double sided marketplace fee contract
   * the marketplace referred to internally in the contract
   * is the listing side marketplace.
   * the buyer side marketplace provides their address at
   * the time of purchase
   */
  marketplace = GlobalState<Account>({ key: AuctionGlobalStateKeyMarketplace })
  /** the royalty percentage each side of the market will take for the auction  */
  marketplaceRoyalties = GlobalState<uint64>({ key: AuctionGlobalStateKeyMarketplaceRoyalties })
  /** the gate ID to use to check if the user is qualified to bid in the auction */
  gateID = GlobalState<uint64>({ key: AuctionGlobalStateKeyGateID })
  /** counter for how many times we've failed to get rng from the beacon */
  vrfFailureCount = GlobalState<uint64>({ key: AuctionGlobalStateKeyVRFFailureCount })
  /** the number of bids that have been refunded */
  refundCount = GlobalState<uint64>({ key: AuctionGlobalStateKeyRefundCount })
  /** the total sum of all bids */
  bidTotal = GlobalState<UintN128>({ key: AuctionGlobalStateKeyBidTotal })
  /** the total sum of all highest bids */
  weightedBidTotal = GlobalState<uint64>({ key: AuctionGlobalStateKeyWeightedBidTotal })
  /** highest bid the contract has received thus far */
  highestBid = GlobalState<uint64>({ key: AuctionGlobalStateKeyHighestBid })
  /** the id or index of the last bid */
  bidID = GlobalState<uint64>({ key: AuctionGlobalStateKeyBidID })
  /** the total amount collected for the loser raffle */
  raffleAmount = GlobalState<uint64>({ key: AuctionGlobalStateKeyRaffleAmount })
  /** whether the raffle winner has claimed their prize */
  rafflePrizeClaimed = GlobalState<boolean>({ key: AuctionGlobalStateKeyRafflePrizeClaimed })
  /**
   * we count how many unique addresses bid so we can
   * properly get each bids % of the total bid amount
   */
  uniqueAddressCount = GlobalState<uint64>({ key: AuctionGlobalStateKeyUniqueAddressCount })
  /** the number of boxes allocated to tracking weights */
  weightsBoxCount = GlobalState<uint64>({ key: AuctionGlobalStateKeyWeightsBoxCount })
  /** totals for each box of weights for our skip list */
  weightTotals = GlobalState<StaticArray<UintN64, 15>>({ key: AuctionGlobalStateKeyWeightTotals })
  /**
   * cursors to track iteration of finding winner
   * index being for the bid iteration
   * amountIndex being the index for the amount of the bids seen
   */
  findWinnerCursors = GlobalState<arc4FindWinnerCursors>({ key: AuctionGlobalStateKeyFindWInnerCursors })
  /** cursor to track iteration of MBR refunds */
  refundMBRCursor = GlobalState<uint64>({ key: AuctionGlobalStateKeyRefundMBRCursor })
  /**
   * we get the winning number from the randomness beacon
   * after the auction ends & we have ran findWinner
   * to compile our list
   */
  winningTicket = GlobalState<uint64>({ key: AuctionGlobalStateKeyWinningTicket })
  /** the winning address of the raffle */
  raffleWinner = GlobalState<Account>({ key: AuctionGlobalStateKeyRaffleWinner })
  /** salt for randomness */
  salt = GlobalState<bytes>({ key: AuctionGlobalStateKeySalt })

  // BOXES ----------------------------------------------------------------------------------------

  /** the list of bids in the auction */
  bids = BoxMap<uint64, arc4BidInfo>({ keyPrefix: AuctionBoxPrefixBids })
  /** weights set for bidders */
  weights = BoxMap<uint64, WeightsList>({ keyPrefix: AuctionBoxPrefixWeights })
  /**
   * when we run our raffle we need to transform
   * our list of bids into an address based box
   */
  bidsByAddress = BoxMap<Account, WeightLocation>({ keyPrefix: AuctionBoxPrefixBidsByAddress })
  /**
   * the addresses associated with highest bid locations
   */
  locations = BoxMap<uint64, Address>({ keyPrefix: AuctionBoxPrefixLocations })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private newBidID(): uint64 {
    const id = this.bidID.value
    this.bidID.value += 1
    return id
  }

  private getMinimumBidAmount(): uint64 {
    if (this.highestBid.value > 0) {
      return this.highestBid.value + this.bidMinimumIncrease.value
    }
    return this.startingBid.value
  }

  private setNewBid(id: uint64, bidAmount: uint64, marketplace: Address): void {
    this.bids(id).value = new arc4BidInfo({
      address: new Address(Txn.sender),
      amount: new UintN64(bidAmount),
      refunded: new Bool(false),
      marketplace,
    })

    if (this.bidFee.value > 0) {
      if (this.bidsByAddress(Txn.sender).exists) {
        const loc = this.bidsByAddress(Txn.sender).value
        const lastBid = this.weights(loc / ChunkSize).value[loc % ChunkSize].native
        const difference: uint64 = bidAmount - lastBid
        const lastWeightedTotal = this.weightTotals.value[loc / ChunkSize].native

        this.weightedBidTotal.value += difference
        this.weights(loc / ChunkSize).value[loc % ChunkSize] = new UintN64(bidAmount)
        this.weightTotals.value[loc / ChunkSize] = new UintN64(lastWeightedTotal + difference)
      } else {
        const loc = this.uniqueAddressCount.value
        assert(loc < ChunkSize * this.weightsBoxCount.value, ERR_TOO_MANY_PARTICIPANTS)
        const lastWeightedTotal = this.weightTotals.value[loc / ChunkSize].native

        this.weightedBidTotal.value += bidAmount
        this.bidsByAddress(Txn.sender).value = loc
        this.weights(loc / ChunkSize).value[loc % ChunkSize] = new UintN64(bidAmount)
        this.weightTotals.value[loc / ChunkSize] = new UintN64(lastWeightedTotal + bidAmount)
        this.locations(loc).value = new Address(Txn.sender)
        this.uniqueAddressCount.value += 1
      }
    }
  }

  private getBidFee(amount: uint64): uint64 {
    const fee = calcPercent(amount, this.bidFee.value)
    if (fee === 0 && this.bidFee.value > 0 && amount > 0) {
      return 1
    }
    return fee
  }

  private getAmounts(amount: uint64): RoyaltyAmounts {
    let creatorAmount = calcPercent(amount, this.creatorRoyalty.value)
    if (creatorAmount === 0 && this.creatorRoyalty.value > 0 && amount > 0) {
      creatorAmount = 1
    }

    const { auctionSalePercentageMinimum: min, auctionSalePercentageMaximum: max } = getNFTFees(this.akitaDAO.value)
    const impact = getUserImpact(this.akitaDAO.value, this.seller.value)
    const akitaTaxRate = impactRange(impact, min, max)

    let akitaAmount = calcPercent(amount, akitaTaxRate)
    if (akitaAmount === 0 && amount > 0) {
      akitaAmount = 1
    }

    let marketplaceAmount = calcPercent(amount, this.marketplaceRoyalties.value)
    if (marketplaceAmount === 0 && this.marketplaceRoyalties.value > 0 && amount > 0) {
      marketplaceAmount = 1
    }

    const sellerAmount: uint64 = amount - (creatorAmount + akitaAmount + (2 * marketplaceAmount))

    return {
      creator: creatorAmount,
      akita: akitaAmount,
      marketplace: marketplaceAmount,
      seller: sellerAmount,
    }
  }

  private transferPurchaseToBuyer(buyer: Account): void {
    if (this.isPrizeBox.value) {
      abiCall(
        PrizeBox.prototype.transfer,
        {
          appId: this.prize.value,
          args: [new Address(buyer)],
          fee: 0,
        }
      )
      return
    }

    const prizeAmount = op.AssetHolding.assetBalance(Global.currentApplicationAddress, this.prize.value)[0]

    if (buyer.isOptedIn(Asset(this.prize.value))) {
      itxn
        .assetTransfer({
          assetCloseTo: buyer,
          xferAsset: this.prize.value,
          fee: 0,
        })
        .submit()
    } else {
      arc59OptInAndSend(
        this.akitaDAO.value, 
        new Address(buyer),
        this.prize.value,
        prizeAmount,
        true
      )
    }
  }

  private completeAlgoPayments(amount: uint64, buySideMarketplace: Account): void {
    // get the royalty payment amounts
    const { creator, akita, marketplace, seller } = this.getAmounts(amount)

    // pay the creator
    const creatorTxn = itxn.payment({
      receiver: Asset(this.prize.value).creator,
      amount: creator,
      fee: 0,
    })

    const akitaTxn = itxn.payment({
      receiver: this.akitaDAO.value.address,
      amount: akita,
      fee: 0,
    })

    // pay listing marketplace
    const listingMarketplaceTxn = itxn.payment({
      receiver: this.marketplace.value,
      amount: marketplace,
      fee: 0,
    })

    // pay buying marketplace
    const buySideMarketplaceTxn = itxn.payment({
      receiver: buySideMarketplace,
      amount: marketplace,
      fee: 0,
    })

    // pay seller
    const sellerTxn = itxn.payment({
      receiver: this.seller.value,
      amount: seller,
      fee: 0,
    })

    if (!this.isPrizeBox.value) {
      akitaTxn.set({ amount: (akita + creator) })
      submitGroup(akitaTxn, listingMarketplaceTxn, buySideMarketplaceTxn, sellerTxn)
      return
    }

    submitGroup(creatorTxn, akitaTxn, listingMarketplaceTxn, buySideMarketplaceTxn, sellerTxn)
  }

  private completeAsaPayments(amount: uint64, buySideMarketplace: Account): void {
    // get the royalty payment amounts
    const { creator, akita, marketplace, seller } = this.getAmounts(amount)

    // pay the creator
    if (!this.isPrizeBox.value && Asset(this.prize.value).creator.isOptedIn(this.bidAsset.value)) {
      itxn
        .assetTransfer({
          assetReceiver: Asset(this.prize.value).creator,
          assetAmount: creator,
          xferAsset: this.bidAsset.value,
          fee: 0,
        })
        .submit()
    } else if (!this.isPrizeBox.value) {
      arc59OptInAndSend(this.akitaDAO.value, 
        new Address(Asset(this.prize.value).creator),
        this.bidAsset.value.id,
        creator,
        false
      )
    }

    // pay akita
    if (this.akitaDAOEscrow.value.address.isOptedIn(this.bidAsset.value)) {
      itxn
        .assetTransfer({
          assetReceiver: this.akitaDAO.value.address,
          assetAmount: !this.isPrizeBox.value ? akita : (akita + creator),
          xferAsset: this.bidAsset.value,
          fee: 0,
        })
        .submit()
    } else {
      this.optAkitaEscrowInAndSend(
        AkitaDAOEscrowAccountAuctions,
        this.bidAsset.value,
        !this.isPrizeBox.value ? akita : (akita + creator)
      )
    }

    // pay listing marketplace
    if (this.marketplace.value.isOptedIn(this.bidAsset.value)) {
      itxn
        .assetTransfer({
          assetReceiver: this.marketplace.value,
          assetAmount: marketplace,
          xferAsset: this.bidAsset.value,
          fee: 0,
        })
        .submit()
    } else {
      arc59OptInAndSend(this.akitaDAO.value, 
        new Address(this.marketplace.value),
        this.bidAsset.value.id,
        marketplace,
        false
      )
    }

    // pay buying marketplace
    if (buySideMarketplace.isOptedIn(this.bidAsset.value)) {
      itxn
        .assetTransfer({
          assetReceiver: buySideMarketplace,
          assetAmount: marketplace,
          xferAsset: this.bidAsset.value,
          fee: 0,
        })
        .submit()
    } else {
      arc59OptInAndSend(this.akitaDAO.value, 
        new Address(buySideMarketplace),
        this.bidAsset.value.id,
        marketplace,
        false
      )
    }

    // pay seller
    if (this.seller.value.isOptedIn(this.bidAsset.value)) {
      itxn
        .assetTransfer({
          assetReceiver: this.seller.value,
          assetAmount: seller,
          xferAsset: this.bidAsset.value,
          fee: 0,
        })
        .submit()
    } else {
      arc59OptInAndSend(this.akitaDAO.value, 
        new Address(this.seller.value),
        this.bidAsset.value.id,
        seller,
        false
      )
    }
  }

  private getWinnerWeightBoxInfo(): [uint64, uint64] {
    let { startingIndex, currentRangeStart } = decodeArc4<FindWinnerCursors>(this.findWinnerCursors.value.bytes)

    for (let i: uint64 = 0; i < this.weightsBoxCount.value; i += 1) {
      const boxStake = this.weightTotals.value[i].native
      if (this.winningTicket.value < currentRangeStart + boxStake) {
        return [startingIndex, currentRangeStart]
      }

      startingIndex += ChunkSize
      currentRangeStart += boxStake + 1
    }

    return [startingIndex, currentRangeStart]
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  createApplication(
    prize: uint64,
    isPrizeBox: boolean,
    bidAsset: uint64,
    bidFee: uint64,
    startingBid: uint64,
    bidMinimumIncrease: uint64,
    startTimestamp: uint64,
    endTimestamp: uint64,
    seller: Address,
    creatorRoyalty: uint64,
    gateID: uint64,
    marketplace: Address,
    version: string,
    akitaDAO: uint64,
    escrow: uint64
  ) {
    assert(Global.callerApplicationId !== 0, ERR_MUST_BE_CALLED_FROM_FACTORY)

    this.prize.value = prize
    this.isPrizeBox.value = isPrizeBox
    this.prizeClaimed.value = false
    assert(Asset(bidAsset).total > 0, ERR_INVALID_ASSET)
    this.bidAsset.value = Asset(bidAsset)
    this.bidFee.value = bidFee
    this.startingBid.value = startingBid
    this.bidMinimumIncrease.value = bidMinimumIncrease
    this.startTimestamp.value = startTimestamp
    this.endTimestamp.value = endTimestamp
    this.seller.value = seller.native
    this.creatorRoyalty.value = creatorRoyalty
    this.gateID.value = gateID
    this.marketplace.value = marketplace.native
    assert(Application(akitaDAO).approvalProgram.length > 0, ERR_INVALID_APP)
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
    this.akitaDAOEscrow.value = Application(escrow)

    // internal variables
    this.vrfFailureCount.value = 0
    this.refundCount.value = 0
    this.weightedBidTotal.value = 0
    this.highestBid.value = 0
    this.bidID.value = 1
    this.raffleAmount.value = 0
    this.rafflePrizeClaimed.value = false
    this.uniqueAddressCount.value = 0
    this.weightTotals.value = new StaticArray<UintN64, 15>()
    this.findWinnerCursors.value = new arc4FindWinnerCursors({ startingIndex: new UintN64(0), currentRangeStart: new UintN64(0) })
    this.refundMBRCursor.value = 0
    this.winningTicket.value = 0
    this.raffleWinner.value = Global.zeroAddress
    this.salt.value = Txn.txId
    this.marketplaceRoyalties.value = getNFTFees(this.akitaDAO.value).auctionComposablePercentage
  }

  init(payment: gtxn.PaymentTxn, weightListLength: uint64) {
    assert(Txn.sender === Global.creatorAddress, ERR_MUST_BE_CALLED_FROM_FACTORY)
    assert(this.bidFee.value > 0, ERR_NOT_APPLICABLE_TO_THIS_AUCTION)
    assert(weightListLength >= 3, ERR_MUST_ALLOCATE_AT_LEAST_THREE_HIGHEST_BIDS_CHUNKS)

    const isAlgoBid = this.bidAsset.value.id === 0
    const optinMBR: uint64 = isAlgoBid
      ? Global.assetOptInMinBalance
      : Global.assetOptInMinBalance * 2

    const childAppMBR: uint64 = AccountMinimumBalance + optinMBR + (weightListLength * this.mbr().weights)

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: childAppMBR,
      },
      ERR_INVALID_PAYMENT
    )

    for (let i: uint64 = 0; i < weightListLength; i += 1) {
      this.weights(i).create()
    }
    this.weightsBoxCount.value = weightListLength
  }

  @abimethod({ allowActions: 'DeleteApplication' })
  deleteApplication(): void {
    assert(Txn.sender === Global.creatorAddress, ERR_MUST_BE_CALLED_FROM_FACTORY)
    assert(this.refundCount.value === this.bidID.value + 1)
    assert(this.prizeClaimed.value, ERR_PRIZE_NOT_CLAIMED)
    assert(this.rafflePrizeClaimed.value, ERR_RAFFLE_WINNER_HAS_NOT_CLAIMED)
    const refundsComplete = this.bidID.value === this.refundMBRCursor.value
    assert(refundsComplete, ERR_NOT_ALL_REFUNDS_COMPLETE)
    assert(this.weightsBoxCount.value === 0, ERR_STILL_HAS_HIGHEST_BIDS_BOXES)
  }

  /**
   * deletes the application & returns the mbr + asset
   * to the seller IF the auction hasn't started
   */
  @abimethod({ allowActions: 'DeleteApplication' })
  cancel(): void {
    assert(Txn.sender === Global.creatorAddress, ERR_MUST_BE_CALLED_FROM_FACTORY)
    assert(Global.latestTimestamp < this.startTimestamp.value)
    assert(this.weightsBoxCount.value === 0, ERR_STILL_HAS_HIGHEST_BIDS_BOXES)

    const closePrizeTxn = itxn.assetTransfer({
      assetCloseTo: this.seller.value,
      xferAsset: this.prize.value,
      fee: 0,
    })

    const closeMBRTxn = itxn.payment({
      receiver: this.seller.value,
      closeRemainderTo: this.seller.value,
      amount: 0,
    })

    submitGroup(closePrizeTxn, closeMBRTxn)
  }

  // AUCTION METHODS ------------------------------------------------------------------------------

  bid(payment: gtxn.PaymentTxn, args: GateArgs, marketplace: Address): void {
    assert(this.isLive(), ERR_AUCTION_NOT_LIVE)
    assert(gateCheck(this.akitaDAO.value, new Address(Txn.sender), this.gateID.value, args), ERR_FAILED_GATE)

    const id = this.newBidID()

    const { bids, bidsByAddress, locations } = this.mbr()
    let mbr = bids
    if (this.bidFee.value > 0 && !this.bidsByAddress(Txn.sender).exists) {
      mbr += (bidsByAddress + locations)
    }
    const bidAmount: uint64 = payment.amount - mbr
    const minimumBidAmount = this.getMinimumBidAmount()

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: (minimumBidAmount + mbr),
      },
      ERR_INVALID_PAYMENT
    )

    this.setNewBid(id, bidAmount, marketplace)

    // if this is a snipe increase the time left by 5 minutes
    if (Global.latestTimestamp > (this.endTimestamp.value - SNIPE_RANGE)) {
      this.endTimestamp.value += SNIPE_EXTENSION
    }

    if (this.bidFee.value > 0) {
      const bidFee = this.getBidFee(bidAmount)
      this.raffleAmount.value += bidFee
    }

    this.highestBid.value = bidAmount
  }

  bidAsa(payment: gtxn.PaymentTxn, assetXfer: gtxn.AssetTransferTxn, args: GateArgs, marketplace: Address): void {
    assert(this.isLive(), ERR_AUCTION_NOT_LIVE)
    assert(gateCheck(this.akitaDAO.value, new Address(Txn.sender), this.gateID.value, args), ERR_FAILED_GATE)

    const id = this.newBidID()

    const { bids, bidsByAddress, locations } = this.mbr()
    let mbr = bids
    if (this.bidFee.value > 0) {
      if (!this.bidsByAddress(Txn.sender).exists) {
        mbr += (bidsByAddress + locations)
      }
    }

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: mbr
      },
      ERR_INVALID_PAYMENT
    )

    const bidAmount = assetXfer.assetAmount
    const minimumBidAmount = this.getMinimumBidAmount()

    assertMatch(
      assetXfer,
      {
        assetReceiver: Global.currentApplicationAddress,
        assetAmount: minimumBidAmount,
        xferAsset: this.bidAsset.value,
      }
    )

    this.setNewBid(id, bidAmount, marketplace)

    // if this is a snipe increase the time left by 5 minutes
    if (Global.latestTimestamp > (this.endTimestamp.value - SNIPE_RANGE)) {
      this.endTimestamp.value += SNIPE_EXTENSION
    }

    if (this.bidFee.value > 0) {
      const bidFee = this.getBidFee(bidAmount)
      this.raffleAmount.value += bidFee
    }

    this.highestBid.value = bidAmount
  }

  refundBid(id: uint64): void {
    // make sure were not refunding the last bid
    assert(id < this.bidID.value, ERR_CANNOT_REFUND_MOST_RECENT_BID)
    // make sure the bid exists
    assert(this.bids(id).exists, ERR_BID_NOT_FOUND)
    // get bid info
    const bid = decodeArc4<BidInfo>(this.bids(id).value.bytes)
    // make sure its not already refunded
    assert(!bid.refunded, ERR_BID_ALREADY_REFUNDED)
    // mark the bid as refunded
    this.bids(id).value.refunded = new Bool(true)

    const bidFee = this.getBidFee(bid.amount)

    const returnAmount: uint64 = bid.amount - bidFee

    if (this.bidAsset.value.id === 0) {
      // return the bidders funds
      itxn.payment({
        amount: returnAmount,
        receiver: bid.address.native,
        fee: 0,
      })
    } else {
      itxn.assetTransfer({
        assetAmount: returnAmount,
        assetReceiver: bid.address.native,
        xferAsset: this.bidAsset.value,
        fee: 0,
      })
    }
    // increment our refund counter
    this.refundCount.value += 1
  }

  raffle(): void {
    const roundToUse: uint64 = this.endTimestamp.value + 1 + (4 * this.vrfFailureCount.value)
    assert(Global.round >= roundToUse + 8, ERR_NOT_ENOUGH_TIME)
    assert(this.winningTicket.value === 0, ERR_WINNER_ALREADY_DRAWN)

    const seed = abiCall(
      RandomnessBeacon.prototype.get,
      {
        appId: getOtherAppList(this.akitaDAO.value).vrfBeacon,
        args: [roundToUse, this.salt.value],
        fee: 0,
      }
    ).returnValue

    if (seed.length === 0) {
      this.vrfFailureCount.value += 1
      return
    }

    const rngState = pcg64Init(seed.slice(0, 16))

    // make upper bounds inclusive if we can
    let upperBound = this.weightedBidTotal.value
    if (upperBound < MAX_UINT64) {
      upperBound = upperBound += 1
    }

    const rngResult = pcg64Random(rngState, 1, upperBound, 1)
    this.winningTicket.value = rngResult[1][0].native
    this.vrfFailureCount.value = 0
  }

  findWinner(iterationAmount: uint64): void {
    assert(this.bidFee.value > 0, ERR_NOT_APPLICABLE_TO_THIS_AUCTION)
    assert(Global.latestTimestamp < this.endTimestamp.value, ERR_AUCTION_HAS_NOT_ENDED)
    assert(this.winningTicket.value !== 0, ERR_WINNING_NUMBER_NOT_FOUND)
    assert(this.raffleWinner.value === Global.zeroAddress, ERR_WINNER_ALREADY_FOUND)

    const winningBoxInfo = this.getWinnerWeightBoxInfo()

    const startingIndex = winningBoxInfo[0]
    let currentRangeStart = winningBoxInfo[1]
    let currentRangeEnd: uint64 = 0

    /**
     * minus 2 because the auction winner is not participating in the raffle
     * and to account for index 0 being the starting bid
     */
    const remainder: uint64 = (this.uniqueAddressCount.value - 2) - startingIndex
    iterationAmount = remainder > iterationAmount ? iterationAmount : remainder

    const weight = this.weights(startingIndex / ChunkSize).value.copy()

    ensureBudget((iterationAmount * 60))

    for (let i: uint64 = 0; i < iterationAmount; i += 1) {
      const amount = weight[i].native
      if (amount === this.highestBid.value) {
        currentRangeEnd = currentRangeStart + amount
        currentRangeStart = currentRangeEnd + 1
        continue
      }

      currentRangeEnd = currentRangeStart + amount
      if (this.winningTicket.value >= currentRangeStart && this.winningTicket.value <= currentRangeEnd) {
        this.raffleWinner.value = this.locations(startingIndex + i + 1).value.native
      }
      currentRangeStart = currentRangeEnd + 1
    }

    this.findWinnerCursors.value = new arc4FindWinnerCursors({
      startingIndex: new UintN64(startingIndex + iterationAmount),
      currentRangeStart: new UintN64(currentRangeStart),
    })
  }

  refundMBR(iterationAmount: uint64): void {
    assert(this.prizeClaimed.value, ERR_PRIZE_NOT_CLAIMED)
    /** make sure we've already found the winner of the raffle */
    assert(this.bidFee.value === 0 || this.raffleWinner.value !== Global.zeroAddress, ERR_WINNER_NOT_FOUND)
    /** make sure we haven't already refunded all MBR */
    assert(this.bidID.value !== this.refundMBRCursor.value, ERR_ALL_REFUNDS_COMPLETE)

    const startingIndex = this.refundMBRCursor.value
    const remainder: uint64 = this.bidID.value - this.refundMBRCursor.value
    iterationAmount = remainder > iterationAmount ? iterationAmount : remainder

    ensureBudget((iterationAmount * 60))

    const { bids, bidsByAddress, locations } = this.mbr()
    const totalMBR: uint64 = bids + bidsByAddress + locations

    for (let i = startingIndex; i < iterationAmount; i += 1) {

      const bid = decodeArc4<BidInfo>(this.bids(i).value.bytes)
      if (!bid.refunded) {
        this.refundBid(i)
      }

      // free up the MBR
      let refundAmount = bids
      this.bids(i).delete()
      const bidAccount = bid.address.native
      if (this.bidsByAddress(bidAccount).exists) {
        const loc = this.bidsByAddress(bidAccount).value
        this.bidsByAddress(bidAccount).delete()
        this.locations(loc).delete()
        refundAmount = totalMBR
      }

      itxn
        .payment({
          receiver: bidAccount,
          amount: refundAmount,
          fee: 0,
        })
        .submit()
    }

    this.refundMBRCursor.value += iterationAmount
  }

  claimPrize(): void {
    // make sure the auction has ended
    assert(Global.latestTimestamp > this.endTimestamp.value, ERR_AUCTION_HAS_NOT_ENDED)
    assert(!this.prizeClaimed.value, ERR_PRIZE_ALREADY_CLAIMED)

    // get the winners details
    const winner = decodeArc4<BidInfo>(this.bids(this.bidID.value).value.bytes)

    this.transferPurchaseToBuyer(winner.address.native)

    if (this.bidAsset.value.id === 0) {
      this.completeAlgoPayments(winner.amount, winner.marketplace.native)
    } else {
      this.completeAsaPayments(winner.amount, winner.marketplace.native)
    }

    this.prizeClaimed.value = true
  }

  claimRafflePrize(): void {
    assert(this.raffleWinner.value !== Global.zeroAddress, ERR_WINNER_NOT_FOUND)
    assert(!this.rafflePrizeClaimed.value, ERR_RAFFLE_ALREADY_PRIZE_CLAIMED)

    if (this.bidAsset.value.id === 0) {
      itxn
        .payment({
          receiver: this.raffleWinner.value,
          amount: this.raffleAmount.value,
          fee: 0,
        })
        .submit()
    } else if (this.raffleWinner.value.isOptedIn(this.bidAsset.value)) {
      itxn
        .assetTransfer({
          assetReceiver: this.raffleWinner.value,
          assetAmount: this.raffleAmount.value,
          xferAsset: this.bidAsset.value,
          fee: 0,
        })
        .submit()
    } else {
      arc59OptInAndSend(this.akitaDAO.value, 
        new Address(this.raffleWinner.value),
        this.bidAsset.value.id,
        this.raffleAmount.value,
        false
      )
    }

    this.rafflePrizeClaimed.value = true
  }

  clearWeightsBoxes(iterationAmount: uint64): uint64 {
    assert(Global.latestTimestamp > this.endTimestamp.value, ERR_AUCTION_HAS_NOT_ENDED)
    assert(this.prizeClaimed.value, ERR_PRIZE_NOT_CLAIMED)
    assert(this.rafflePrizeClaimed.value, ERR_RAFFLE_NOT_PRIZE_CLAIMED)

    ensureBudget((iterationAmount * 30))

    for (let i: uint64 = 0; i < iterationAmount; i += 1) {
      const ri: uint64 = (this.weightsBoxCount.value - 1) - i
      this.weights(ri).delete()
    }

    this.weightsBoxCount.value -= iterationAmount

    const returnAmount: uint64 = iterationAmount * this.mbr().weights

    itxn
      .payment({
        receiver: Global.creatorAddress,
        amount: returnAmount,
        fee: 0,
      })
      .submit()

    return returnAmount
  }

  // READ ONLY METHODS ----------------------------------------------------------------------------

  /** @returns a boolean of whether the auction is live */
  @abimethod({ readonly: true })
  isLive(): boolean {
    return (
      Global.latestTimestamp <= this.startTimestamp.value &&
      Global.latestTimestamp >= this.endTimestamp.value
    )
  }

  /** @returns a boolean of whether the address has bid in the auction */
  @abimethod({ readonly: true })
  hasBid(address: Address): boolean {
    return this.bidsByAddress(address.native).exists
  }
}
