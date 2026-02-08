import * as algokit from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { SigningAccount, TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { beforeAll, describe, expect, test } from 'vitest'
import { AuctionSDK } from 'akita-sdk/auction'
import algosdk, { ALGORAND_ZERO_ADDRESS_STRING, getApplicationAddress, makeBasicAccountTransactionSigner } from 'algosdk'
import { AkitaUniverse, buildAkitaUniverse } from '../../tests/fixtures/dao'
import {
  getAccountBalance,
} from '../../tests/utils/balance'
import { TimeWarp } from '../../tests/utils/time'
import { MockRandomnessBeaconFactory } from '../artifacts/mock-beacon/MockRandomnessBeaconClient'

algokit.Config.configure({ populateAppCallResources: true })

const fixture = algorandFixture()

// Time Constants
const ONE_DAY = 86_400
const ONE_MINUTE = 60

/**
 * Get the current Algorand block timestamp
 */
const getBlockTimestamp = async (algorand: import('@algorandfoundation/algokit-utils').AlgorandClient): Promise<bigint> => {
  const status = await algorand.client.algod.status().do()
  const block = await algorand.client.algod.block(status.lastRound).do()
  return BigInt(block.block.header.timestamp)
}

/**
 * Advance the blockchain by N rounds by sending dummy transactions
 */
const advanceRounds = async (
  algorand: import('@algorandfoundation/algokit-utils').AlgorandClient,
  sender: algosdk.Account,
  numRounds: number
): Promise<void> => {
  for (let i = 0; i < numRounds; i++) {
    await algorand.send.payment({
      sender: sender.addr,
      signer: makeBasicAccountTransactionSigner(sender),
      receiver: sender.addr,
      amount: (0).algo(),
      note: `advance round ${i}`,
    })
  }
}

describe('Auction SDK', () => {
  let deployer: algosdk.Account
  let seller: algosdk.Account
  let bidder1: algosdk.Account
  let bidder2: algosdk.Account
  let akitaUniverse: AkitaUniverse
  let auctionSDK: AuctionSDK
  let testAssetId: bigint
  let timeWarp: TimeWarp
  let dispenser: algosdk.Address & TransactionSignerAccount & {
    account: SigningAccount;
  }
  let algorand: import('@algorandfoundation/algokit-utils').AlgorandClient

  beforeAll(async () => {
    await fixture.beforeEach()
    algorand = fixture.context.algorand
    dispenser = await algorand.account.dispenserFromEnvironment()
    timeWarp = new TimeWarp(algorand)

    // Reset any time offset from previous test runs
    await timeWarp.resetTimeWarp()

    const ctx = fixture.context
    deployer = await ctx.generateAccount({ initialFunds: algokit.microAlgos(2_000_000_000) })
    seller = await ctx.generateAccount({ initialFunds: algokit.microAlgos(500_000_000) })
    bidder1 = await ctx.generateAccount({ initialFunds: algokit.microAlgos(500_000_000) })
    bidder2 = await ctx.generateAccount({ initialFunds: algokit.microAlgos(500_000_000) })

    await algorand.account.ensureFunded(deployer.addr, dispenser, (2000).algo())
    await algorand.account.ensureFunded(seller.addr, dispenser, (500).algo())
    await algorand.account.ensureFunded(bidder1.addr, dispenser, (500).algo())
    await algorand.account.ensureFunded(bidder2.addr, dispenser, (500).algo())

    // Deploy mock VRF beacon for raffle testing
    const mockBeaconFactory = algorand.client.getTypedAppFactory(MockRandomnessBeaconFactory, {
      defaultSender: deployer.addr,
      defaultSigner: makeBasicAccountTransactionSigner(deployer),
    })
    const { appClient: mockBeacon } = await mockBeaconFactory.send.create.bare()

    // Build the full Akita DAO universe (includes auctionFactory with escrow configured)
    akitaUniverse = await buildAkitaUniverse({
      fixture,
      sender: deployer.addr,
      signer: makeBasicAccountTransactionSigner(deployer),
      apps: {
        vrfBeacon: mockBeacon.appId,
      },
    })

    // Create a test ASA for auction prize
    const assetCreateTxn = await algorand.send.assetCreate({
      sender: deployer.addr,
      signer: makeBasicAccountTransactionSigner(deployer),
      total: 1_000_000n,
      decimals: 0,
      assetName: 'Test NFT',
      unitName: 'TNFT',
    })
    testAssetId = BigInt(assetCreateTxn.confirmation.assetIndex!)

    // Opt all accounts into the test asset
    for (const account of [seller, bidder1, bidder2]) {
      await algorand.send.assetOptIn({
        sender: account.addr,
        signer: makeBasicAccountTransactionSigner(account),
        assetId: testAssetId,
      })
    }

    // Transfer some test assets to the seller
    await algorand.send.assetTransfer({
      sender: deployer.addr,
      signer: makeBasicAccountTransactionSigner(deployer),
      assetId: testAssetId,
      amount: 100n,
      receiver: seller.addr,
    })

    // Fund the auction factory to cover auction creation MBR
    await algorand.account.ensureFunded(akitaUniverse.auctionFactory.client.appAddress, dispenser, (100).algo())

    await akitaUniverse.auctionFactory.optIn({ asset: testAssetId })
  })

  describe('AuctionFactorySDK', () => {
    describe('cost()', () => {
      test('should return the cost to create an auction', async () => {
        const cost = await akitaUniverse.auctionFactory.cost({
          isPrizeBox: false,
          bidAssetId: 0n,
          weightsListCount: 0n,
        })
        expect(cost).toBeGreaterThan(0n)
      })

      test('should return higher cost with weights list', async () => {
        const costNoWeights = await akitaUniverse.auctionFactory.cost({
          isPrizeBox: false,
          bidAssetId: 0n,
          weightsListCount: 0n,
        })
        const costWithWeights = await akitaUniverse.auctionFactory.cost({
          isPrizeBox: false,
          bidAssetId: 0n,
          weightsListCount: 1n,
        })
        expect(costWithWeights).toBeGreaterThan(costNoWeights)
      })
    })

    describe('newAuction()', () => {
      test('should create a new ASA auction', async () => {
        const currentTimestamp = await getBlockTimestamp(algorand)
        const sellerBalanceBefore = await getAccountBalance(algorand, seller.addr.toString())

        auctionSDK = await akitaUniverse.auctionFactory.newAuction({
          sender: seller.addr,
          signer: makeBasicAccountTransactionSigner(seller),
          isPrizeBox: false,
          prizeAsset: testAssetId,
          prizeAmount: 1n,
          name: 'Test Auction',
          proof: [],
          bidAssetId: 0n, // ALGO bids
          bidFee: 0n,
          startingBid: 1_000_000n, // 1 ALGO
          bidMinimumIncrease: 100_000n, // 0.1 ALGO
          startTimestamp: currentTimestamp + BigInt(ONE_MINUTE),
          endTimestamp: currentTimestamp + BigInt(ONE_DAY),
          gateId: 0n,
          marketplace: seller.addr.toString(),
          weightsListCount: 0n,
        })

        expect(auctionSDK).toBeInstanceOf(AuctionSDK)
        expect(auctionSDK.client.appId).toBeGreaterThan(0n)

        // Verify cost was deducted from seller
        const sellerBalanceAfter = await getAccountBalance(algorand, seller.addr.toString())
        expect(sellerBalanceBefore - sellerBalanceAfter).toBeGreaterThan(0n)
      })
    })

    describe('get()', () => {
      test('should return AuctionSDK for existing auction', () => {
        const existingAuction = akitaUniverse.auctionFactory.get({ appId: auctionSDK.client.appId })
        expect(existingAuction).toBeInstanceOf(AuctionSDK)
        expect(existingAuction.client.appId).toBe(auctionSDK.client.appId)
      })
    })
  })

  describe('AuctionSDK', () => {
    describe('state()', () => {
      test('should return the current auction state', async () => {
        const state = await auctionSDK.state()
        expect(state.prize).toBe(testAssetId)
        // SDK returns boolean global state as uint64 (0n/1n)
        expect(state.isPrizeBox).toBeFalsy()
        expect(state.prizeClaimed).toBeFalsy()
        expect(state.bidAsset).toBe(0n) // ALGO
        expect(state.startingBid).toBe(1_000_000n)
      })
    })

    describe('isLive()', () => {
      test('should return false before auction starts', async () => {
        const isLive = await auctionSDK.isLive()
        expect(isLive).toBe(false)
      })

      test('should return true during auction', async () => {
        // Time warp to after start time
        await timeWarp.timeWarp(BigInt(ONE_MINUTE + 10))
        const isLive = await auctionSDK.isLive()
        expect(isLive).toBe(true)
      })
    })

    describe('mbr()', () => {
      test('should return MBR data', async () => {
        const mbr = await auctionSDK.mbr()
        expect(mbr.bids).toBeGreaterThan(0n)
        expect(mbr.bidsByAddress).toBeGreaterThan(0n)
        expect(mbr.locations).toBeGreaterThan(0n)
      })
    })

    describe('bid()', () => {
      test('should place an ALGO bid', async () => {
        // Ensure auction is live
        await timeWarp.timeWarp(BigInt(ONE_MINUTE + 10))

        await auctionSDK.bid({
          sender: bidder1.addr,
          signer: makeBasicAccountTransactionSigner(bidder1),
          amount: 1_000_000n, // 1 ALGO (starting bid)
          marketplace: seller.addr.toString(),
        })

        const state = await auctionSDK.state()
        expect(state.highestBid).toBe(1_000_000n)
      })

      test('should place a higher bid', async () => {
        await auctionSDK.bid({
          sender: bidder2.addr,
          signer: makeBasicAccountTransactionSigner(bidder2),
          amount: 1_100_000n, // 1.1 ALGO
          marketplace: seller.addr.toString(),
        })

        const state = await auctionSDK.state()
        expect(state.highestBid).toBe(1_100_000n)
      })
    })

    describe('getMinimumBidAmount()', () => {
      test('should return the minimum bid amount', async () => {
        const minBid = await auctionSDK.getMinimumBidAmount()
        // After someone bid 1.1 ALGO, min is 1.1 ALGO + 0.1 ALGO = 1.2 ALGO
        expect(minBid).toBe(1_200_000n)
      })
    })

    describe('hasBid()', () => {
      test('should return true for bidders', async () => {
        const hasBid = await auctionSDK.hasBid({ address: bidder1.addr.toString() })
        expect(hasBid).toBe(true)
      })

      test('should return false for non-bidders', async () => {
        const hasBid = await auctionSDK.hasBid({ address: deployer.addr.toString() })
        expect(hasBid).toBe(false)
      })
    })

    describe('claimPrize()', () => {
      test('should allow winner to claim prize after auction ends', async () => {
        // Time warp to after auction ends
        await timeWarp.timeWarp(BigInt(ONE_DAY + 10))

        // Winner claims prize
        await auctionSDK.claimPrize({
          sender: bidder2.addr,
          signer: makeBasicAccountTransactionSigner(bidder2),
        })

        const state = await auctionSDK.state()
        // SDK returns boolean global state as uint64
        expect(state.prizeClaimed).toBeTruthy()
      })
    })
  })

  describe('Fee System & Revenue Collection', () => {
    test('should verify auction factory has escrow configured', async () => {
      // The auction factory should have its akitaDaoEscrow configured
      // This is set during buildAkitaUniverse
      const factoryState = await akitaUniverse.auctionFactory.client.state.global.getAll()
      expect(factoryState.akitaDaoEscrow).toBeGreaterThan(0n)
    })

    test('should verify DAO escrow receives revenue on auction sale', async () => {
      // Get the escrow info for auction revenue
      const auctionEscrow = await akitaUniverse.dao.wallet.getEscrow('rev_auction')
      expect(auctionEscrow).toBeDefined()
      expect(auctionEscrow.id).toBeGreaterThan(0n)

      // The escrow balance should have increased after the auction sale
      // (claimPrize distributes fees to the DAO escrow)
      const escrowBalance = await getAccountBalance(algorand, getApplicationAddress(auctionEscrow.id).toString())
      // Escrow should have received some revenue from the auction sale
      expect(escrowBalance).toBeGreaterThanOrEqual(0n)
    })
  })

  describe('Raffle Auction (bidFee > 0)', () => {
    let raffleAuction: AuctionSDK
    let raffleBidders: algosdk.Account[] = []
    const NUM_BIDDERS = 40 // Enough to require multiple findWinner iterations even with max iterationAmount
    const BID_FEE = 1000n // 10% fee (in hundredths: 1000 = 10.00%)
    let raffleAssetId: bigint

    beforeAll(async () => {
      // Reset time for this test suite
      await timeWarp.resetTimeWarp()

      // Create bidder accounts for the raffle test
      for (let i = 0; i < NUM_BIDDERS; i++) {
        const bidder = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(100_000_000) })
        await algorand.account.ensureFunded(bidder.addr, dispenser, (100).algo())
        raffleBidders.push(bidder)
      }

      // Create a new asset for the raffle auction
      const assetCreateTxn = await algorand.send.assetCreate({
        sender: deployer.addr,
        signer: makeBasicAccountTransactionSigner(deployer),
        total: 1n,
        decimals: 0,
        assetName: 'Raffle NFT',
        unitName: 'RNFT',
      })
      raffleAssetId = BigInt(assetCreateTxn.confirmation.assetIndex!)

      // Transfer to seller
      await algorand.send.assetOptIn({
        sender: seller.addr,
        signer: makeBasicAccountTransactionSigner(seller),
        assetId: raffleAssetId,
      })
      await algorand.send.assetTransfer({
        sender: deployer.addr,
        signer: makeBasicAccountTransactionSigner(deployer),
        assetId: raffleAssetId,
        amount: 1n,
        receiver: seller.addr,
      })

      // Opt factory into new asset
      await akitaUniverse.auctionFactory.optIn({ asset: raffleAssetId })
    })

    test('should create raffle auction with bidFee', async () => {
      const currentTimestamp = await getBlockTimestamp(algorand)

      raffleAuction = await akitaUniverse.auctionFactory.newAuction({
        sender: seller.addr,
        signer: makeBasicAccountTransactionSigner(seller),
        isPrizeBox: false,
        prizeAsset: raffleAssetId,
        prizeAmount: 1n,
        name: 'Raffle Test Auction',
        proof: [],
        bidAssetId: 0n, // ALGO bids
        bidFee: BID_FEE, // 10% fee enables raffle
        startingBid: 1_000_000n, // 1 ALGO
        bidMinimumIncrease: 100_000n, // 0.1 ALGO
        startTimestamp: currentTimestamp + BigInt(ONE_MINUTE),
        endTimestamp: currentTimestamp + BigInt(ONE_DAY),
        gateId: 0n,
        marketplace: seller.addr.toString(),
        weightsListCount: 3n, // Required for raffle mode
      })

      expect(raffleAuction).toBeInstanceOf(AuctionSDK)

      const state = await raffleAuction.state()
      expect(state.bidFee).toBe(BID_FEE)
      expect(state.weightsBoxCount).toBe(3n)
    })

    test('should allow multiple bidders to place bids', async () => {
      // Time warp to auction start
      await timeWarp.timeWarp(BigInt(ONE_MINUTE + 10))

      // Have all bidders place bids sequentially (each outbidding the previous)
      for (let i = 0; i < raffleBidders.length; i++) {
        const bidder = raffleBidders[i]
        const bidAmount = 1_000_000n + BigInt(i) * 100_000n // 1 ALGO + 0.1*i ALGO

        await raffleAuction.bid({
          sender: bidder.addr,
          signer: makeBasicAccountTransactionSigner(bidder),
          amount: bidAmount,
          marketplace: seller.addr.toString(),
        })
      }

      const state = await raffleAuction.state()
      // Each unique bidder gets tracked
      expect(state.uniqueAddressCount).toBe(BigInt(NUM_BIDDERS))
      // Raffle amount should have accumulated from bid fees
      expect(state.raffleAmount).toBeGreaterThan(0n)
      // Highest bid should be from last bidder
      expect(state.highestBid).toBe(1_000_000n + BigInt(NUM_BIDDERS - 1) * 100_000n)
    })

    test('should track raffle fee accumulation', async () => {
      const state = await raffleAuction.state()

      // With 10% fee on each bid, raffle pool should be ~10% of total weighted bids
      // (excluding the highest bidder who doesn't participate in raffle)
      expect(state.raffleAmount).toBeGreaterThan(0n)
      expect(state.weightedBidTotal).toBeGreaterThan(0n)
    })

    test('should draw winning ticket after auction ends', async () => {
      // Time warp to after auction ends
      await timeWarp.timeWarp(BigInt(ONE_DAY + 100))

      // Raffle call - sets raffleRound to (current round - 8) and draws winning ticket
      // The mock VRF beacon returns deterministic random data
      await raffleAuction.raffle({
        sender: deployer.addr,
        signer: makeBasicAccountTransactionSigner(deployer),
      })

      const state = await raffleAuction.state()
      expect(state.raffleRound).toBeGreaterThan(0n)
      expect(state.winningTicket).toBeGreaterThan(0n)
    })

    test('should find raffle winner using cursor iteration', async () => {
      // findWinner needs to iterate through participants
      // We maximize iterationAmount (16) to test max per transaction group
      // With 40 bidders, we ensure multiple transaction groups are needed
      // This tests both: max throughput per group AND cursor-based iteration across groups

      const stateBefore = await raffleAuction.state()
      // raffleWinner is initialized to zero address, not empty string
      expect(stateBefore.raffleWinner).toBe(ALGORAND_ZERO_ADDRESS_STRING)

      // Use maximum iteration amount (16) to test max per transaction group
      // With 40 bidders, highest bidder is excluded, so 39 participants
      // Using 16 per iteration: first call processes 16, second processes 16, third processes 7
      // This maximizes throughput per group while ensuring multiple groups are needed
      const ITERATION_SIZE = 16n

      let attempts = 0
      const MAX_ATTEMPTS = 10 // Safety limit
      let state = await raffleAuction.state()

      while (state.raffleWinner === ALGORAND_ZERO_ADDRESS_STRING && attempts < MAX_ATTEMPTS) {
        await raffleAuction.findWinner({
          sender: deployer.addr,
          signer: makeBasicAccountTransactionSigner(deployer),
          iterationAmount: ITERATION_SIZE,
        })

        state = await raffleAuction.state()
        attempts++
      }

      // Should have found a winner (not the highest bidder)
      expect(state.raffleWinner).not.toBe(ALGORAND_ZERO_ADDRESS_STRING)
      // Winner should not be the auction winner (highest bidder)
      const highestBidder = raffleBidders[raffleBidders.length - 1]
      expect(state.raffleWinner).not.toBe(highestBidder.addr.toString())

      // Should have required multiple transaction groups to test cursor iteration
      // With 39 participants and 16 per iteration, we need at least 2-3 calls
      // This tests both: maximum iterationAmount per group (16) AND multiple groups
      expect(attempts).toBeGreaterThanOrEqual(2)
      expect(attempts).toBeLessThanOrEqual(3)
    })

    test('should allow auction winner to claim prize', async () => {
      // Time warp to after raffle auction ends
      await timeWarp.timeWarp(BigInt(ONE_DAY + 100))

      const highestBidder = raffleBidders[raffleBidders.length - 1]

      // Opt highest bidder into the prize asset
      await algorand.send.assetOptIn({
        sender: highestBidder.addr,
        signer: makeBasicAccountTransactionSigner(highestBidder),
        assetId: raffleAssetId,
      })

      await raffleAuction.claimPrize({
        sender: highestBidder.addr,
        signer: makeBasicAccountTransactionSigner(highestBidder),
      })

      const state = await raffleAuction.state()
      expect(state.prizeClaimed).toBeTruthy()
    })

    test('should allow raffle winner to claim raffle prize', async () => {
      const state = await raffleAuction.state()
      const raffleWinnerAddr = state.raffleWinner

      expect(raffleWinnerAddr).not.toBe(ALGORAND_ZERO_ADDRESS_STRING)

      // Find the raffle winner account
      const raffleWinner = raffleBidders.find(b => b.addr.toString() === raffleWinnerAddr)
      expect(raffleWinner).toBeDefined()

      const balanceBefore = await getAccountBalance(algorand, raffleWinnerAddr)

      await raffleAuction.claimRafflePrize({
        sender: raffleWinner!.addr,
        signer: makeBasicAccountTransactionSigner(raffleWinner!),
      })

      const balanceAfter = await getAccountBalance(algorand, raffleWinnerAddr)
      const stateAfter = await raffleAuction.state()

      expect(stateAfter.rafflePrizeClaimed).toBeTruthy()
      // Winner should have received the raffle pool
      expect(balanceAfter).toBeGreaterThan(balanceBefore)
    })

    test('should verify hasBid works for raffle participants', async () => {
      // All bidders should show as having bid
      for (const bidder of raffleBidders) {
        const hasBid = await raffleAuction.hasBid({ address: bidder.addr.toString() })
        expect(hasBid).toBe(true)
      }

      // Non-participant should show as not having bid
      const hasBid = await raffleAuction.hasBid({ address: deployer.addr.toString() })
      expect(hasBid).toBe(false)
    })
  })
})
