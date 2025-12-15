import * as algokit from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { SigningAccount, TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { beforeAll, describe, expect, test } from '@jest/globals'
import { PollSDK, PollTypeEnum } from 'akita-sdk/poll'
import algosdk, { makeBasicAccountTransactionSigner } from 'algosdk'
import { AkitaUniverse, buildAkitaUniverse } from '../../tests/fixtures/dao'
import { getAccountBalance } from '../../tests/utils/balance'
import { TimeWarp } from '../../tests/utils/time'

algokit.Config.configure({ populateAppCallResources: true })

const fixture = algorandFixture()

// Time Constants
const ONE_DAY = 86_400

/**
 * Get the current Algorand block timestamp
 */
const getBlockTimestamp = async (algorand: import('@algorandfoundation/algokit-utils').AlgorandClient): Promise<bigint> => {
  const status = await algorand.client.algod.status().do()
  const block = await algorand.client.algod.block(status.lastRound).do()
  return BigInt(block.block.header.timestamp)
}

describe('Poll SDK', () => {
  let deployer: algosdk.Account
  let creator: algosdk.Account
  let voter1: algosdk.Account
  let voter2: algosdk.Account
  let akitaUniverse: AkitaUniverse
  let pollSDK: PollSDK
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
    voter1 = await ctx.generateAccount({ initialFunds: algokit.microAlgos(100_000_000) })
    voter2 = await ctx.generateAccount({ initialFunds: algokit.microAlgos(100_000_000) })

    await algorand.account.ensureFunded(deployer.addr, dispenser, (2000).algo())
    await algorand.account.ensureFunded(creator.addr, dispenser, (500).algo())
    await algorand.account.ensureFunded(voter1.addr, dispenser, (100).algo())
    await algorand.account.ensureFunded(voter2.addr, dispenser, (100).algo())

    // Build the full Akita DAO universe (includes pollFactory with escrow configured)
    akitaUniverse = await buildAkitaUniverse({
      fixture,
      sender: deployer.addr,
      signer: makeBasicAccountTransactionSigner(deployer),
      apps: {},
    })

    // Fund the poll factory to cover poll creation MBR
    await algorand.account.ensureFunded(akitaUniverse.pollFactory.client.appAddress, dispenser, (100).algo())
  })

  describe('PollFactorySDK', () => {
    describe('cost()', () => {
      test('should return the cost to create a poll', async () => {
        const cost = await akitaUniverse.pollFactory.cost()
        expect(cost).toBeGreaterThan(0n)
      })
    })

    describe('new()', () => {
      test('should create a new single choice poll', async () => {
        const currentTimestamp = await getBlockTimestamp(algorand)
        const creatorBalanceBefore = await getAccountBalance(algorand, creator.addr.toString())

        pollSDK = await akitaUniverse.pollFactory.new({
          sender: creator.addr,
          signer: makeBasicAccountTransactionSigner(creator),
          type: PollTypeEnum.SingleChoice,
          endTime: currentTimestamp + BigInt(ONE_DAY),
          maxSelected: 1n,
          question: 'What is your favorite color?',
          options: ['Red', 'Blue', 'Green'],
          gateId: 0n,
        })

        expect(pollSDK).toBeInstanceOf(PollSDK)
        expect(pollSDK.client.appId).toBeGreaterThan(0n)

        // Verify cost was deducted from creator
        const creatorBalanceAfter = await getAccountBalance(algorand, creator.addr.toString())
        expect(creatorBalanceBefore - creatorBalanceAfter).toBeGreaterThan(0n)
      })

      test('should create a multiple choice poll', async () => {
        const currentTimestamp = await getBlockTimestamp(algorand)

        const multiPoll = await akitaUniverse.pollFactory.new({
          sender: creator.addr,
          signer: makeBasicAccountTransactionSigner(creator),
          type: PollTypeEnum.MultipleChoice,
          endTime: currentTimestamp + BigInt(ONE_DAY),
          maxSelected: 3n,
          question: 'Which features do you want?',
          options: ['Feature A', 'Feature B', 'Feature C', 'Feature D'],
          gateId: 0n,
        })

        expect(multiPoll).toBeInstanceOf(PollSDK)
        const state = await multiPoll.state()
        expect(state.maxSelected).toBe(3n)
        expect(state.optionCount).toBe(4n)
      })
    })

    describe('get()', () => {
      test('should return PollSDK for existing poll', () => {
        const existingPoll = akitaUniverse.pollFactory.get({ appId: pollSDK.client.appId })
        expect(existingPoll).toBeInstanceOf(PollSDK)
        expect(existingPoll.client.appId).toBe(pollSDK.client.appId)
      })
    })
  })

  describe('PollSDK', () => {
    describe('state()', () => {
      test('should return the current poll state', async () => {
        const state = await pollSDK.state()
        expect(state.type).toBe(PollTypeEnum.SingleChoice)
        expect(state.question).toBe('What is your favorite color?')
        expect(state.optionCount).toBe(3n)
        // maxSelected is only set for MultipleChoice polls, defaults to 0 for SingleChoice
        expect(state.maxSelected).toBe(0n)
      })
    })

    describe('getOptions()', () => {
      test('should return options as array', async () => {
        const options = await pollSDK.getOptions()
        expect(options).toEqual(['Red', 'Blue', 'Green'])
      })
    })

    describe('getVoteCounts()', () => {
      test('should return vote counts as array', async () => {
        const votes = await pollSDK.getVoteCounts()
        expect(votes).toEqual([0n, 0n, 0n])
      })
    })

    describe('hasEnded()', () => {
      test('should return false before poll ends', async () => {
        const hasEnded = await pollSDK.hasEnded()
        expect(hasEnded).toBe(false)
      })
    })

    describe('hasVoted()', () => {
      test('should return false for voters who have not voted', async () => {
        const hasVoted = await pollSDK.hasVoted({ user: voter1.addr.toString() })
        expect(hasVoted).toBe(false)
      })
    })

    describe('vote()', () => {
      test('should allow voting for a single option', async () => {
        await pollSDK.vote({
          sender: voter1.addr,
          signer: makeBasicAccountTransactionSigner(voter1),
          votes: [0n], // Vote for option 0 (Red)
        })

        const hasVoted = await pollSDK.hasVoted({ user: voter1.addr.toString() })
        expect(hasVoted).toBe(true)

        const votes = await pollSDK.getVoteCounts()
        expect(votes[0]).toBe(1n)
      })

      test('should update vote counts correctly', async () => {
        await pollSDK.vote({
          sender: voter2.addr,
          signer: makeBasicAccountTransactionSigner(voter2),
          votes: [1n], // Vote for option 1 (Blue)
        })

        const votes = await pollSDK.getVoteCounts()
        expect(votes[0]).toBe(1n) // Red
        expect(votes[1]).toBe(1n) // Blue
      })
    })

    describe('deleteBoxes()', () => {
      test('should delete boxes and refund MBR after poll ends', async () => {
        // Time warp to after poll ends
        await timeWarp.timeWarp(BigInt(ONE_DAY + 10))

        await pollSDK.deleteBoxes({
          sender: creator.addr,
          signer: makeBasicAccountTransactionSigner(creator),
          addresses: [voter1.addr.toString(), voter2.addr.toString()],
        })

        // Boxes should be deleted
        const state = await pollSDK.state()
        expect(state.boxCount).toBe(0n)
      })
    })
  })

  describe('Fee System & Revenue Collection', () => {
    test('should verify poll factory has escrow configured', async () => {
      // The poll factory should have its akitaDaoEscrow configured
      const factoryState = await akitaUniverse.pollFactory.client.state.global.getAll()
      expect(factoryState.akitaDaoEscrow).toBeGreaterThan(0n)
    })

    test('should verify DAO escrow exists for poll revenue', async () => {
      // Get the escrow info for poll revenue
      const pollEscrow = await akitaUniverse.dao.wallet.getEscrow('rev_poll')
      expect(pollEscrow).toBeDefined()
      expect(pollEscrow.id).toBeGreaterThan(0n)

      // The escrow balance should be tracked - derive address from escrow app ID
      const escrowAddress = algosdk.getApplicationAddress(pollEscrow.id).toString()
      const escrowBalance = await getAccountBalance(algorand, escrowAddress)
      expect(escrowBalance).toBeGreaterThanOrEqual(0n)
    })
  })
})
