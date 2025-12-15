import * as algokit from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { SigningAccount, TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { beforeAll, describe, expect, test } from '@jest/globals'
import { RaffleSDK } from 'akita-sdk/raffle'
import algosdk, { makeBasicAccountTransactionSigner } from 'algosdk'
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

describe('Raffle SDK', () => {
  let deployer: algosdk.Account
  let creator: algosdk.Account
  let participant1: algosdk.Account
  let participant2: algosdk.Account
  let akitaUniverse: AkitaUniverse
  let raffleSDK: RaffleSDK
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
    creator = await ctx.generateAccount({ initialFunds: algokit.microAlgos(500_000_000) })
    participant1 = await ctx.generateAccount({ initialFunds: algokit.microAlgos(500_000_000) })
    participant2 = await ctx.generateAccount({ initialFunds: algokit.microAlgos(500_000_000) })

    await algorand.account.ensureFunded(deployer.addr, dispenser, (2000).algo())
    await algorand.account.ensureFunded(creator.addr, dispenser, (500).algo())
    await algorand.account.ensureFunded(participant1.addr, dispenser, (500).algo())
    await algorand.account.ensureFunded(participant2.addr, dispenser, (500).algo())

    // Deploy mock VRF beacon for raffle testing
    const mockBeaconFactory = algorand.client.getTypedAppFactory(MockRandomnessBeaconFactory, {
      defaultSender: deployer.addr,
      defaultSigner: makeBasicAccountTransactionSigner(deployer),
    })
    const { appClient: mockBeacon } = await mockBeaconFactory.send.create.bare()

    // Build the full Akita DAO universe (includes raffleFactory with escrow configured)
    akitaUniverse = await buildAkitaUniverse({
      fixture,
      sender: deployer.addr,
      signer: makeBasicAccountTransactionSigner(deployer),
      apps: {
        vrfBeacon: mockBeacon.appId,
      },
    })

    // Create a test ASA for raffle prize
    const assetCreateTxn = await algorand.send.assetCreate({
      sender: deployer.addr,
      signer: makeBasicAccountTransactionSigner(deployer),
      total: 1_000_000n,
      decimals: 0,
      assetName: 'Raffle Prize NFT',
      unitName: 'RPNFT',
    })
    testAssetId = BigInt(assetCreateTxn.confirmation.assetIndex!)

    // Opt all accounts into the test asset
    for (const account of [creator, participant1, participant2]) {
      await algorand.send.assetOptIn({
        sender: account.addr,
        signer: makeBasicAccountTransactionSigner(account),
        assetId: testAssetId,
      })
    }

    // Transfer prize asset to the creator
    await algorand.send.assetTransfer({
      sender: deployer.addr,
      signer: makeBasicAccountTransactionSigner(deployer),
      assetId: testAssetId,
      amount: 100n,
      receiver: creator.addr,
    })

    // Fund the raffle factory to cover raffle creation MBR
    await algorand.account.ensureFunded(akitaUniverse.raffleFactory.client.appAddress, dispenser, (100).algo())

    // Opt the raffle factory into the test asset so it can receive the prize during raffle creation
    const optInCost = await akitaUniverse.raffleFactory.client.optInCost({ args: { asset: testAssetId } })
    await akitaUniverse.raffleFactory.client.send.optIn({
      args: {
        payment: await algorand.createTransaction.payment({
          sender: deployer.addr,
          receiver: akitaUniverse.raffleFactory.client.appAddress,
          amount: optInCost.microAlgo(),
        }),
        asset: testAssetId,
      },
      sender: deployer.addr,
      signer: makeBasicAccountTransactionSigner(deployer),
      extraFee: (1_000).microAlgo(), // Cover inner transaction fee for asset opt-in
    })
  })

  describe('RaffleFactorySDK', () => {
    describe('cost()', () => {
      test('should return the cost to create a raffle', () => {
        const cost = akitaUniverse.raffleFactory.cost({
          isPrizeBox: false,
          isAlgoTicket: true,
          weightsListCount: 4n, // Minimum required by contract
        })
        expect(cost).toBeGreaterThan(0n)
      })

      test('should return higher cost for ASA tickets', () => {
        const algoCost = akitaUniverse.raffleFactory.cost({ isAlgoTicket: true })
        const asaCost = akitaUniverse.raffleFactory.cost({ isAlgoTicket: false })
        expect(asaCost).toBeGreaterThan(algoCost)
      })
    })

    describe('newRaffle()', () => {
      // TODO: The SDK's cost() uses hardcoded values that need to be aligned with the actual contract.
      // The contract calculates totalMBR dynamically based on globalUints/globalBytes from compileArc4.
      // Need to add a readonly cost method to the factory or make SDK query the contract.
      test('should create a new ALGO ticket raffle', async () => {
        const currentTimestamp = await getBlockTimestamp(algorand)
        const creatorBalanceBefore = await getAccountBalance(algorand, creator.addr.toString())

        const newRaffleSDK = await akitaUniverse.raffleFactory.newRaffle({
          sender: creator.addr,
          signer: makeBasicAccountTransactionSigner(creator),
          prizeAsset: testAssetId,
          prizeAmount: 1n,
          ticketAsset: 0n, // ALGO tickets
          startTimestamp: currentTimestamp + BigInt(ONE_MINUTE),
          endTimestamp: currentTimestamp + BigInt(ONE_DAY),
          minTickets: 1_000_000n, // 1 ALGO minimum
          maxTickets: 100_000_000n, // 100 ALGO maximum
          gateId: 0n,
          marketplace: creator.addr.toString(),
          name: 'Test Raffle',
          proof: [],
          weightsListCount: 4n, // Minimum required by contract
        })

        expect(newRaffleSDK).toBeInstanceOf(RaffleSDK)
        expect(newRaffleSDK.client.appId).toBeGreaterThan(0n)

        // Verify cost was deducted from creator
        const creatorBalanceAfter = await getAccountBalance(algorand, creator.addr.toString())
        expect(creatorBalanceBefore - creatorBalanceAfter).toBeGreaterThan(0n)
      })
    })

    describe('get()', () => {
      // Skipped: depends on raffleSDK from newRaffle
      test('should return RaffleSDK for existing raffle', async () => {
        // Create a raffle first to test get()
        const currentTimestamp = await getBlockTimestamp(algorand)
        const testRaffleSDK = await akitaUniverse.raffleFactory.newRaffle({
          sender: creator.addr,
          signer: makeBasicAccountTransactionSigner(creator),
          prizeAsset: testAssetId,
          prizeAmount: 1n,
          ticketAsset: 0n, // ALGO tickets
          startTimestamp: currentTimestamp + BigInt(ONE_MINUTE),
          endTimestamp: currentTimestamp + BigInt(ONE_DAY),
          minTickets: 1_000_000n, // 1 ALGO minimum
          maxTickets: 100_000_000n, // 100 ALGO maximum
          gateId: 0n,
          marketplace: creator.addr.toString(),
          name: 'Test Raffle for get()',
          proof: [],
          weightsListCount: 4n, // Minimum required by contract
        })

        const existingRaffle = akitaUniverse.raffleFactory.get({ appId: testRaffleSDK.client.appId })
        expect(existingRaffle).toBeInstanceOf(RaffleSDK)
        expect(existingRaffle.client.appId).toBe(testRaffleSDK.client.appId)
      })
    })
  })

  // NOTE: All RaffleSDK tests are skipped because they depend on raffleSDK
  // being created via newRaffle(), which requires cost calculation alignment.
  describe('RaffleSDK', () => {
    beforeAll(async () => {
      // Create a raffle for all RaffleSDK tests to use
      if (!raffleSDK) {
        const currentTimestamp = await getBlockTimestamp(algorand)
        raffleSDK = await akitaUniverse.raffleFactory.newRaffle({
          sender: creator.addr,
          signer: makeBasicAccountTransactionSigner(creator),
          prizeAsset: testAssetId,
          prizeAmount: 1n,
          ticketAsset: 0n, // ALGO tickets
          startTimestamp: currentTimestamp + BigInt(ONE_MINUTE),
          endTimestamp: currentTimestamp + BigInt(ONE_DAY),
          minTickets: 1_000_000n, // 1 ALGO minimum
          maxTickets: 100_000_000n, // 100 ALGO maximum
          gateId: 0n,
          marketplace: creator.addr.toString(),
          name: 'Test Raffle',
          proof: [],
          weightsListCount: 4n, // Minimum required by contract
        })
      }
    })

    describe('state()', () => {
      test('should return the current raffle state', async () => {
        const state = await raffleSDK.state()
        expect(state.prize).toBe(testAssetId)
        expect(state.seller).toBe(creator.addr.toString())
      })
    })

    describe('isLive()', () => {
      test('should return false before raffle starts', async () => {
        const isLive = await raffleSDK.isLive()
        expect(isLive).toBe(false)
      })

      test('should return true during raffle', async () => {
        // Time warp to after start time
        await timeWarp.timeWarp(BigInt(ONE_MINUTE + 10))
        const isLive = await raffleSDK.isLive()
        expect(isLive).toBe(true)
      })
    })

    describe('mbr()', () => {
      test('should return MBR data', async () => {
        const mbr = await raffleSDK.mbr()
        expect(mbr.entries).toBeGreaterThan(0n)
        expect(mbr.entriesByAddress).toBeGreaterThan(0n)
      })
    })

    describe('enter()', () => {
      test('should allow entering with ALGO tickets', async () => {
        // Ensure raffle is live
        await timeWarp.timeWarp(BigInt(ONE_MINUTE + 10))

        const balanceBefore = await getAccountBalance(algorand, participant1.addr.toString())

        await raffleSDK.enter({
          sender: participant1.addr,
          signer: makeBasicAccountTransactionSigner(participant1),
          amount: 5_000_000n, // 5 ALGO worth of tickets
          marketplace: creator.addr.toString(),
        })

        const balanceAfter = await getAccountBalance(algorand, participant1.addr.toString())
        // Should have spent 5 ALGO + MBR + fees
        expect(balanceBefore - balanceAfter).toBeGreaterThanOrEqual(5_000_000n)
      })
    })

    describe('isEntered()', () => {
      test('should return true for entered participant', async () => {
        const isEntered = await raffleSDK.isEntered({ address: participant1.addr.toString() })
        expect(isEntered).toBe(true)
      })

      test('should return false for non-participant', async () => {
        const isEntered = await raffleSDK.isEntered({ address: deployer.addr.toString() })
        expect(isEntered).toBe(false)
      })
    })

    describe('getEntryByAddress()', () => {
      test('should return entry ID for participant', async () => {
        const entryId = await raffleSDK.getEntryByAddress({ address: participant1.addr.toString() })
        expect(entryId).toBeGreaterThanOrEqual(0n)
      })
    })

    describe('getEntry()', () => {
      test('should return entry data', async () => {
        const entryId = await raffleSDK.getEntryByAddress({ address: participant1.addr.toString() })
        const entry = await raffleSDK.getEntry({ entryId })
        expect(entry).toBeDefined()
        expect(entry.account).toBe(participant1.addr.toString())
      })
    })

    describe('getTicketCount()', () => {
      test('should return ticket count for an entry', async () => {
        const entryId = await raffleSDK.getEntryByAddress({ address: participant1.addr.toString() })
        const ticketCount = await raffleSDK.getTicketCount({ entryId })
        expect(ticketCount).toBe(5_000_000n) // Initial entry amount
      })
    })

    describe('getEntryWithTickets()', () => {
      test('should return entry data with ticket count by entry ID', async () => {
        const entryId = await raffleSDK.getEntryByAddress({ address: participant1.addr.toString() })
        const entryWithTickets = await raffleSDK.getEntryWithTickets({ entryId })

        expect(entryWithTickets).toBeDefined()
        expect(entryWithTickets.account).toBe(participant1.addr.toString())
        expect(entryWithTickets.entryId).toBe(entryId)
        expect(entryWithTickets.ticketCount).toBe(5_000_000n)
      })
    })

    describe('getEntryWithTicketsByAddress()', () => {
      test('should return entry data with ticket count by address', async () => {
        const entryWithTickets = await raffleSDK.getEntryWithTicketsByAddress({
          address: participant1.addr.toString()
        })

        expect(entryWithTickets).toBeDefined()
        expect(entryWithTickets.account).toBe(participant1.addr.toString())
        expect(entryWithTickets.ticketCount).toBe(5_000_000n)
        expect(entryWithTickets.entryId).toBeGreaterThanOrEqual(0n)
      })

      test('should throw for non-existent address', async () => {
        await expect(
          raffleSDK.getEntryWithTicketsByAddress({ address: deployer.addr.toString() })
        ).rejects.toThrow('No entry found for address')
      })
    })

    describe('add()', () => {
      test('should allow adding more tickets', async () => {
        await raffleSDK.add({
          sender: participant1.addr,
          signer: makeBasicAccountTransactionSigner(participant1),
          amount: 2_000_000n, // 2 more ALGO
        })

        // Entry should now have more tickets - verify using getEntryWithTickets
        const entryWithTickets = await raffleSDK.getEntryWithTicketsByAddress({
          address: participant1.addr.toString()
        })
        expect(entryWithTickets.ticketCount).toBe(7_000_000n) // 5 + 2 ALGO
      })
    })

    describe('getAllEntriesWithTickets()', () => {
      test('should return all entries with ticket counts', async () => {
        // Add a second participant
        await raffleSDK.enter({
          sender: participant2.addr,
          signer: makeBasicAccountTransactionSigner(participant2),
          amount: 10_000_000n, // 10 ALGO
          marketplace: creator.addr.toString(),
        })

        const allEntries = await raffleSDK.getAllEntriesWithTickets()

        expect(allEntries.length).toBe(2)

        // Find each participant's entry
        const p1Entry = allEntries.find(e => e.account === participant1.addr.toString())
        const p2Entry = allEntries.find(e => e.account === participant2.addr.toString())

        expect(p1Entry).toBeDefined()
        expect(p1Entry!.ticketCount).toBe(7_000_000n) // 5 + 2 ALGO from previous tests
        expect(p1Entry!.entryId).toBeGreaterThanOrEqual(0n)

        expect(p2Entry).toBeDefined()
        expect(p2Entry!.ticketCount).toBe(10_000_000n)
        expect(p2Entry!.entryId).toBeGreaterThanOrEqual(0n)
      })

      test('should include marketplace in entry data', async () => {
        const allEntries = await raffleSDK.getAllEntriesWithTickets()

        for (const entry of allEntries) {
          expect(entry.marketplace).toBe(creator.addr.toString())
        }
      })
    })
  })

  describe('Fee System & Revenue Collection', () => {
    test('should verify raffle factory has escrow configured', async () => {
      // The raffle factory should have its akitaDaoEscrow configured
      const factoryState = await akitaUniverse.raffleFactory.client.state.global.getAll()
      expect(factoryState.akitaDaoEscrow).toBeGreaterThan(0n)
    })

    test('should verify DAO escrow exists for raffle revenue', async () => {
      // Get the escrow info for raffle revenue
      const raffleEscrow = await akitaUniverse.dao.wallet.getEscrow('rev_raffle')
      expect(raffleEscrow).toBeDefined()
      expect(raffleEscrow.id).toBeGreaterThan(0n)

      // The escrow balance should be tracked
      const escrowAddress = algosdk.getApplicationAddress(raffleEscrow.id).toString()
      const escrowBalance = await getAccountBalance(algorand, escrowAddress)
      expect(escrowBalance).toBeGreaterThanOrEqual(0n)
    })
  })
})
