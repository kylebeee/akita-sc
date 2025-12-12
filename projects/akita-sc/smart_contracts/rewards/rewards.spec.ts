import { Config, microAlgo } from '@algorandfoundation/algokit-utils'
import { registerDebugEventHandlers } from '@algorandfoundation/algokit-utils-debug'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { afterEach, beforeAll, beforeEach, describe, expect, test } from '@jest/globals'
import algosdk, { makeBasicAccountTransactionSigner } from 'algosdk'
import { TimeWarp } from '../../tests/utils/time'
import { RewardsClient, RewardsFactory } from '../artifacts/rewards/RewardsClient'
import { MinDisbursementsMBR, UserAllocationMBR } from './constants'
import {
  ERR_ALLOCATION_ALREADY_EXISTS,
  ERR_ALLOCATION_DOES_NOT_EXIST,
  ERR_DISBURSEMENT_ALREADY_FINAL,
  ERR_DISBURSEMENT_DOES_NOT_EXIST,
  ERR_DISBURSEMENT_LOCKED,
  ERR_DISBURSEMENT_NOT_EXPIRED,
  ERR_DISBURSEMENTS_CANNOT_BE_EMPTY,
  ERR_INVALID_DISBURSEMENT_UNLOCK_TIME,
  ERR_YOU_ARE_NOT_THE_CREATOR,
} from './errors'

Config.configure({
  debug: true,
  populateAppCallResources: true,
})
registerDebugEventHandlers()

// Box cost per byte for MBR calculation
const BoxCostPerByte = 400n

/**
 * Calculate MBR for a disbursement based on title and note length
 */
const calculateDisbursementMBR = (title: string, note: string): bigint => {
  return BigInt(MinDisbursementsMBR) + (BoxCostPerByte * BigInt(title.length + note.length))
}

describe('Rewards Contract Tests', () => {
  const localnet = algorandFixture()

  let deployer: algosdk.Address & TransactionSignerAccount & algosdk.Account
  let client: RewardsClient
  let timeWarp: TimeWarp
  let algorand: import('@algorandfoundation/algokit-utils').AlgorandClient

  beforeAll(async () => {
    await localnet.newScope()
    algorand = localnet.algorand
    const { testAccount } = localnet.context
    deployer = testAccount

    timeWarp = new TimeWarp(algorand)

    const factory = algorand.client.getTypedAppFactory(RewardsFactory, {
      defaultSender: deployer.addr,
      defaultSigner: deployer.signer,
    })

    const results = await factory.send.create.create({
      args: { version: '1.0.0', akitaDao: 0n },
    })
    client = results.appClient

    // Fund the contract generously to handle all tests
    const dispenser = await algorand.account.dispenserFromEnvironment()
    await algorand.send.payment({
      sender: dispenser.addr,
      signer: dispenser.signer,
      receiver: client.appAddress,
      amount: microAlgo(500_000_000n), // 500 ALGO
    })

    console.log('Rewards App ID:', client.appId)
    console.log('Rewards Address:', client.appAddress.toString())

    const disbursementId = await client.state.global.disbursementId()
    console.log('Initial disbursementID:', disbursementId)
  })

  beforeEach(async () => {
    // Ensure deployer has enough funds for each test
    const dispenser = await algorand.account.dispenserFromEnvironment()
    await algorand.account.ensureFunded(deployer.addr, dispenser, (100).algos())
  })

  afterEach(async () => {
    if (timeWarp) {
      await timeWarp.resetTimeWarp()
    }
  })

  // Helper to get current timestamp
  const getCurrentTimestamp = async (): Promise<bigint> => {
    const status = await algorand.client.algod.status().do()
    const block = await algorand.client.algod.block(status.lastRound).do()
    return BigInt(block.block.header.timestamp)
  }

  // Helper to create a disbursement
  const createDisbursement = async (title: string, note: string, timeToUnlock: bigint, expiration: bigint): Promise<bigint> => {
    const mbrAmount = calculateDisbursementMBR(title, note)

    const mbrPayment = await algorand.createTransaction.payment({
      sender: deployer.addr,
      receiver: client.appAddress,
      amount: microAlgo(mbrAmount),
    })

    const result = await client.send.createDisbursement({
      args: {
        mbrPayment,
        title,
        timeToUnlock,
        expiration,
        note,
      },
      sender: deployer.addr,
      signer: deployer.signer,
    })

    return result.return!
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CONTRACT INITIALIZATION TESTS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Contract Initialization', () => {
    test('contract is created with correct version', async () => {
      const version = await client.state.global.version()
      expect(version).toBe('1.0.0')
    })

    test('contract balance is sufficient', async () => {
      const accountInfo = await algorand.account.getInformation(client.appAddress)
      expect(accountInfo.balance.microAlgos).toBeGreaterThanOrEqual(accountInfo.minBalance.microAlgos)
    })

    test('disbursement ID is initialized', async () => {
      const disbursementId = await client.state.global.disbursementId()
      expect(disbursementId).toBeDefined()
      expect(typeof disbursementId).toBe('bigint')
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // DISBURSEMENT CREATION TESTS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Disbursement Creation', () => {
    test('create a disbursement successfully', async () => {
      const currentTimestamp = await getCurrentTimestamp()

      const disbursementId = await createDisbursement(
        'Community Rewards Q1',
        'Quarterly rewards for community members',
        currentTimestamp + 60n,
        currentTimestamp + 3600n
      )

      expect(disbursementId).toBeDefined()
      expect(typeof disbursementId).toBe('bigint')
    })

    test('create multiple disbursements increments ID correctly', async () => {
      const currentTimestamp = await getCurrentTimestamp()

      const id1 = await createDisbursement(
        'Test 1',
        'Note 1',
        currentTimestamp + 60n,
        currentTimestamp + 3600n
      )

      const id2 = await createDisbursement(
        'Test 2',
        'Note 2',
        currentTimestamp + 60n,
        currentTimestamp + 3600n
      )

      // IDs should be sequential
      expect(id2 - id1).toBe(1n)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // DISBURSEMENT EDITING TESTS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Disbursement Editing', () => {
    test('edit disbursement title and note', async () => {
      const currentTimestamp = await getCurrentTimestamp()

      const disbursementId = await createDisbursement(
        'Editable Disbursement',
        'Will be edited',
        currentTimestamp + 120n,
        currentTimestamp + 7200n
      )

      await client.send.editDisbursement({
        args: {
          id: disbursementId,
          title: 'Updated Title',
          timeToUnlock: currentTimestamp + 180n,
          expiration: currentTimestamp + 86400n,
          note: 'Updated note with more details',
        },
        sender: deployer.addr,
        signer: deployer.signer,
      })

      expect(true).toBe(true)
    })

    test('cannot edit non-existent disbursement', async () => {
      const currentTimestamp = await getCurrentTimestamp()

      let error = 'no error thrown'
      try {
        await client.send.editDisbursement({
          args: {
            id: 999999n, // Non-existent ID
            title: 'Does not exist',
            timeToUnlock: currentTimestamp + 60n,
            expiration: currentTimestamp + 3600n,
            note: 'This should fail',
          },
          sender: deployer.addr,
          signer: deployer.signer,
        })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_DISBURSEMENT_DOES_NOT_EXIST)
    })

    test('cannot edit disbursement if not creator', async () => {
      const currentTimestamp = await getCurrentTimestamp()

      const disbursementId = await createDisbursement(
        'Creator Only',
        'Only creator can edit',
        currentTimestamp + 60n,
        currentTimestamp + 3600n
      )

      const otherAccount = await localnet.context.generateAccount({
        initialFunds: (10).algos(),
      })

      let error = 'no error thrown'
      try {
        await client.send.editDisbursement({
          args: {
            id: disbursementId,
            title: 'Malicious edit',
            timeToUnlock: currentTimestamp + 60n,
            expiration: currentTimestamp + 3600n,
            note: 'This should fail',
          },
          sender: otherAccount.addr,
          signer: makeBasicAccountTransactionSigner(otherAccount),
        })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_YOU_ARE_NOT_THE_CREATOR)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // USER ALLOCATIONS TESTS (ALGO)
  // ═══════════════════════════════════════════════════════════════════════════

  describe('User Allocations (ALGO)', () => {
    test('create user allocations for ALGO rewards', async () => {
      const user1 = await localnet.context.generateAccount({ initialFunds: (10).algos() })
      const user2 = await localnet.context.generateAccount({ initialFunds: (10).algos() })

      const currentTimestamp = await getCurrentTimestamp()

      const disbursementId = await createDisbursement(
        'ALGO Rewards',
        'ALGO distribution test',
        currentTimestamp + 60n,
        currentTimestamp + 86400n
      )

      const allocations: [string, bigint][] = [
        [user1.addr.toString(), 1_000_000n],
        [user2.addr.toString(), 2_000_000n],
      ]

      const totalRewards = allocations.reduce((sum, a) => sum + a[1], 0n)
      const allocationMbr = BigInt(UserAllocationMBR) * BigInt(allocations.length)

      const allocPayment = await algorand.createTransaction.payment({
        sender: deployer.addr,
        receiver: client.appAddress,
        amount: microAlgo(allocationMbr + totalRewards),
      })

      await client.send.createUserAllocations({
        args: {
          payment: allocPayment,
          id: disbursementId,
          allocations,
        },
        sender: deployer.addr,
        signer: deployer.signer,
      })

      expect(true).toBe(true)
    })

    test('cannot create duplicate allocation for same user', async () => {
      const user = await localnet.context.generateAccount({ initialFunds: (10).algos() })

      const currentTimestamp = await getCurrentTimestamp()

      const disbursementId = await createDisbursement(
        'Duplicate Test',
        'Testing duplicate prevention',
        currentTimestamp + 60n,
        currentTimestamp + 86400n
      )

      // First allocation
      const allocations1: [string, bigint][] = [[user.addr.toString(), 1_000_000n]]
      const totalRewards1 = allocations1.reduce((sum, a) => sum + a[1], 0n)
      const allocationMbr1 = BigInt(UserAllocationMBR) * BigInt(allocations1.length)

      const allocPayment1 = await algorand.createTransaction.payment({
        sender: deployer.addr,
        receiver: client.appAddress,
        amount: microAlgo(allocationMbr1 + totalRewards1),
      })

      await client.send.createUserAllocations({
        args: {
          payment: allocPayment1,
          id: disbursementId,
          allocations: allocations1,
        },
        sender: deployer.addr,
        signer: deployer.signer,
      })

      // Try duplicate
      const allocations2: [string, bigint][] = [[user.addr.toString(), 500_000n]]
      const totalRewards2 = allocations2.reduce((sum, a) => sum + a[1], 0n)
      const allocationMbr2 = BigInt(UserAllocationMBR) * BigInt(allocations2.length)

      const allocPayment2 = await algorand.createTransaction.payment({
        sender: deployer.addr,
        receiver: client.appAddress,
        amount: microAlgo(allocationMbr2 + totalRewards2),
      })

      let error = 'no error thrown'
      try {
        await client.send.createUserAllocations({
          args: {
            payment: allocPayment2,
            id: disbursementId,
            allocations: allocations2,
          },
          sender: deployer.addr,
          signer: deployer.signer,
        })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_ALLOCATION_ALREADY_EXISTS)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // FINALIZE DISBURSEMENT TESTS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Finalize Disbursement', () => {
    test('finalize a disbursement with allocations', async () => {
      const user = await localnet.context.generateAccount({ initialFunds: (10).algos() })

      const currentTimestamp = await getCurrentTimestamp()

      const disbursementId = await createDisbursement(
        'Final Test',
        'To be finalized',
        currentTimestamp + 60n,
        currentTimestamp + 86400n
      )

      const allocations: [string, bigint][] = [[user.addr.toString(), 1_000_000n]]
      const totalRewards = allocations.reduce((sum, a) => sum + a[1], 0n)
      const allocationMbr = BigInt(UserAllocationMBR) * BigInt(allocations.length)

      const allocPayment = await algorand.createTransaction.payment({
        sender: deployer.addr,
        receiver: client.appAddress,
        amount: microAlgo(allocationMbr + totalRewards),
      })

      await client.send.createUserAllocations({
        args: {
          payment: allocPayment,
          id: disbursementId,
          allocations,
        },
        sender: deployer.addr,
        signer: deployer.signer,
      })

      await client.send.finalizeDisbursement({
        args: { id: disbursementId },
        sender: deployer.addr,
        signer: deployer.signer,
      })

      expect(true).toBe(true)
    })

    test('cannot finalize disbursement without allocations', async () => {
      const currentTimestamp = await getCurrentTimestamp()

      const disbursementId = await createDisbursement(
        'Empty Disbursement',
        'No allocations',
        currentTimestamp + 60n,
        currentTimestamp + 86400n
      )

      let error = 'no error thrown'
      try {
        await client.send.finalizeDisbursement({
          args: { id: disbursementId },
          sender: deployer.addr,
          signer: deployer.signer,
        })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_DISBURSEMENTS_CANNOT_BE_EMPTY)
    })

    test('cannot finalize already finalized disbursement', async () => {
      const user = await localnet.context.generateAccount({ initialFunds: (10).algos() })

      const currentTimestamp = await getCurrentTimestamp()

      const disbursementId = await createDisbursement(
        'Double Final',
        'Try to finalize twice',
        currentTimestamp + 60n,
        currentTimestamp + 86400n
      )

      const allocations: [string, bigint][] = [[user.addr.toString(), 1_000_000n]]
      const totalRewards = allocations.reduce((sum, a) => sum + a[1], 0n)
      const allocationMbr = BigInt(UserAllocationMBR) * BigInt(allocations.length)

      const allocPayment = await algorand.createTransaction.payment({
        sender: deployer.addr,
        receiver: client.appAddress,
        amount: microAlgo(allocationMbr + totalRewards),
      })

      await client.send.createUserAllocations({
        args: {
          payment: allocPayment,
          id: disbursementId,
          allocations,
        },
        sender: deployer.addr,
        signer: deployer.signer,
      })

      await client.send.finalizeDisbursement({
        args: { id: disbursementId },
        sender: deployer.addr,
        signer: deployer.signer,
      })

      let error = 'no error thrown'
      try {
        await client.send.finalizeDisbursement({
          args: { id: disbursementId },
          sender: deployer.addr,
          signer: deployer.signer,
        })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_DISBURSEMENT_ALREADY_FINAL)
    })

    test('cannot finalize with invalid unlock time (in the past)', async () => {
      const user = await localnet.context.generateAccount({ initialFunds: (10).algos() })

      const currentTimestamp = await getCurrentTimestamp()

      const disbursementId = await createDisbursement(
        'Past Unlock',
        'Unlock in past',
        currentTimestamp - 100n, // Past time
        currentTimestamp + 86400n
      )

      const allocations: [string, bigint][] = [[user.addr.toString(), 1_000_000n]]
      const totalRewards = allocations.reduce((sum, a) => sum + a[1], 0n)
      const allocationMbr = BigInt(UserAllocationMBR) * BigInt(allocations.length)

      const allocPayment = await algorand.createTransaction.payment({
        sender: deployer.addr,
        receiver: client.appAddress,
        amount: microAlgo(allocationMbr + totalRewards),
      })

      await client.send.createUserAllocations({
        args: {
          payment: allocPayment,
          id: disbursementId,
          allocations,
        },
        sender: deployer.addr,
        signer: deployer.signer,
      })

      let error = 'no error thrown'
      try {
        await client.send.finalizeDisbursement({
          args: { id: disbursementId },
          sender: deployer.addr,
          signer: deployer.signer,
        })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_INVALID_DISBURSEMENT_UNLOCK_TIME)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // INSTANT DISBURSEMENT TESTS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Instant Disbursements', () => {
    test('create instant ALGO disbursement', async () => {
      const user1 = await localnet.context.generateAccount({ initialFunds: (10).algos() })
      const user2 = await localnet.context.generateAccount({ initialFunds: (10).algos() })

      const currentTimestamp = await getCurrentTimestamp()

      const allocations: [string, bigint][] = [
        [user1.addr.toString(), 1_000_000n],
        [user2.addr.toString(), 2_000_000n],
      ]

      const totalRewards = allocations.reduce((sum, a) => sum + a[1], 0n)
      const mbrAmount = BigInt(MinDisbursementsMBR) + BigInt(UserAllocationMBR) * BigInt(allocations.length)

      const mbrPayment = await algorand.createTransaction.payment({
        sender: deployer.addr,
        receiver: client.appAddress,
        amount: microAlgo(mbrAmount + totalRewards),
      })

      const result = await client.send.createInstantDisbursement({
        args: {
          mbrPayment,
          timeToUnlock: 0n,
          expiration: currentTimestamp + 86400n,
          allocations,
        },
        sender: deployer.addr,
        signer: deployer.signer,
      })

      expect(result.return).toBeDefined()
    })

    test('create instant ASA disbursement', async () => {
      const user1 = await localnet.context.generateAccount({ initialFunds: (10).algos() })
      const user2 = await localnet.context.generateAccount({ initialFunds: (10).algos() })

      const assetResult = await algorand.send.assetCreate({
        sender: deployer.addr,
        signer: deployer.signer,
        total: 10_000_000_000n,
        decimals: 6,
        assetName: 'Instant Token',
        unitName: 'INST',
      })
      const assetId = BigInt(assetResult.assetId)

      // Opt the contract into the asset using its optIn method
      const optInPayment = await algorand.createTransaction.payment({
        sender: deployer.addr,
        receiver: client.appAddress,
        amount: microAlgo(100_000n), // Asset opt-in MBR
      })
      await client.send.optIn({
        args: { payment: optInPayment, asset: assetId },
        sender: deployer.addr,
        signer: deployer.signer,
        extraFee: microAlgo(1000n), // Cover inner transaction fee
      })

      await algorand.send.assetOptIn({
        sender: user1.addr,
        signer: makeBasicAccountTransactionSigner(user1),
        assetId,
      })
      await algorand.send.assetOptIn({
        sender: user2.addr,
        signer: makeBasicAccountTransactionSigner(user2),
        assetId,
      })

      const currentTimestamp = await getCurrentTimestamp()

      const allocations: [string, bigint][] = [
        [user1.addr.toString(), 100_000_000n],
        [user2.addr.toString(), 200_000_000n],
      ]

      const totalRewards = allocations.reduce((sum, a) => sum + a[1], 0n)
      const mbrAmount = BigInt(MinDisbursementsMBR) + BigInt(UserAllocationMBR) * BigInt(allocations.length)

      const mbrPayment = await algorand.createTransaction.payment({
        sender: deployer.addr,
        receiver: client.appAddress,
        amount: microAlgo(mbrAmount),
      })

      const assetXfer = await algorand.createTransaction.assetTransfer({
        sender: deployer.addr,
        receiver: client.appAddress,
        assetId,
        amount: totalRewards,
      })

      const result = await client.send.createInstantAsaDisbursement({
        args: {
          mbrPayment,
          assetXfer,
          timeToUnlock: 0n,
          expiration: currentTimestamp + 86400n,
          allocations,
        },
        sender: deployer.addr,
        signer: deployer.signer,
        extraFee: microAlgo(4000n), // Cover inner transaction fees for 2 users
      })

      expect(result.return).toBeDefined()
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // CLAIM REWARDS TESTS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Claim Rewards', () => {
    test('user can claim ALGO rewards', async () => {
      const user = await localnet.context.generateAccount({ initialFunds: (10).algos() })
      const rewardAmount = 5_000_000n

      const currentTimestamp = await getCurrentTimestamp()

      const allocations: [string, bigint][] = [[user.addr.toString(), rewardAmount]]

      const mbrAmount = BigInt(MinDisbursementsMBR) + BigInt(UserAllocationMBR) * BigInt(allocations.length)

      const mbrPayment = await algorand.createTransaction.payment({
        sender: deployer.addr,
        receiver: client.appAddress,
        amount: microAlgo(mbrAmount + rewardAmount),
      })

      const createResult = await client.send.createInstantDisbursement({
        args: {
          mbrPayment,
          timeToUnlock: 0n,
          expiration: currentTimestamp + 86400n,
          allocations,
        },
        sender: deployer.addr,
        signer: deployer.signer,
      })
      const disbursementId = createResult.return!

      const balanceBefore = await algorand.account.getInformation(user.addr)

      await client.send.claimRewards({
        args: {
          rewards: [[disbursementId, 0n]],
        },
        sender: user.addr,
        signer: makeBasicAccountTransactionSigner(user),
        extraFee: microAlgo(2000n), // Cover inner transaction fees
      })

      const balanceAfter = await algorand.account.getInformation(user.addr)

      const balanceIncrease = balanceAfter.balance.microAlgos - balanceBefore.balance.microAlgos
      expect(balanceIncrease).toBeGreaterThan(Number(rewardAmount) - 15_000) // Allow for extra fees
    })

    test('user can claim ASA rewards', async () => {
      const user = await localnet.context.generateAccount({ initialFunds: (10).algos() })
      const rewardAmount = 50_000_000n

      const assetResult = await algorand.send.assetCreate({
        sender: deployer.addr,
        signer: deployer.signer,
        total: 10_000_000_000n,
        decimals: 6,
        assetName: 'Claim Test Token',
        unitName: 'CLM',
      })
      const assetId = BigInt(assetResult.assetId)

      // Opt the contract into the asset using its optIn method
      const optInPayment = await algorand.createTransaction.payment({
        sender: deployer.addr,
        receiver: client.appAddress,
        amount: microAlgo(100_000n),
      })
      await client.send.optIn({
        args: { payment: optInPayment, asset: assetId },
        sender: deployer.addr,
        signer: deployer.signer,
        extraFee: microAlgo(1000n), // Cover inner transaction fee
      })

      await algorand.send.assetOptIn({
        sender: user.addr,
        signer: makeBasicAccountTransactionSigner(user),
        assetId,
      })

      const currentTimestamp = await getCurrentTimestamp()

      const allocations: [string, bigint][] = [[user.addr.toString(), rewardAmount]]

      const mbrAmount = BigInt(MinDisbursementsMBR) + BigInt(UserAllocationMBR) * BigInt(allocations.length)

      const mbrPayment = await algorand.createTransaction.payment({
        sender: deployer.addr,
        receiver: client.appAddress,
        amount: microAlgo(mbrAmount),
      })

      const assetXfer = await algorand.createTransaction.assetTransfer({
        sender: deployer.addr,
        receiver: client.appAddress,
        assetId,
        amount: rewardAmount,
      })

      const createResult = await client.send.createInstantAsaDisbursement({
        args: {
          mbrPayment,
          assetXfer,
          timeToUnlock: 0n,
          expiration: currentTimestamp + 86400n,
          allocations,
        },
        sender: deployer.addr,
        signer: deployer.signer,
        extraFee: microAlgo(2000n), // Cover inner transaction fees
      })
      const disbursementId = createResult.return!

      await client.send.claimRewards({
        args: {
          rewards: [[disbursementId, assetId]],
        },
        sender: user.addr,
        signer: makeBasicAccountTransactionSigner(user),
        extraFee: microAlgo(3000n), // Cover inner transaction fees for ASA transfer
      })

      // Check the user's ASA balance
      const accountInfo = await algorand.client.algod.accountInformation(user.addr.toString()).do()
      const assetHolding = accountInfo.assets?.find((a: { assetId?: number | bigint; 'asset-id'?: number }) =>
        BigInt(a.assetId ?? a['asset-id'] ?? 0) === assetId
      )
      expect(BigInt(assetHolding?.amount ?? 0)).toBe(rewardAmount)
    })

    test('cannot claim locked rewards', async () => {
      const user = await localnet.context.generateAccount({ initialFunds: (10).algos() })
      const rewardAmount = 1_000_000n

      const currentTimestamp = await getCurrentTimestamp()

      const allocations: [string, bigint][] = [[user.addr.toString(), rewardAmount]]

      const mbrAmount = BigInt(MinDisbursementsMBR) + BigInt(UserAllocationMBR) * BigInt(allocations.length)

      const mbrPayment = await algorand.createTransaction.payment({
        sender: deployer.addr,
        receiver: client.appAddress,
        amount: microAlgo(mbrAmount + rewardAmount),
      })

      const createResult = await client.send.createInstantDisbursement({
        args: {
          mbrPayment,
          timeToUnlock: currentTimestamp + 3600n, // Locked for 1 hour
          expiration: currentTimestamp + 86400n,
          allocations,
        },
        sender: deployer.addr,
        signer: deployer.signer,
      })
      const disbursementId = createResult.return!

      let error = 'no error thrown'
      try {
        await client.send.claimRewards({
          args: {
            rewards: [[disbursementId, 0n]],
          },
          sender: user.addr,
          signer: makeBasicAccountTransactionSigner(user),
        })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_DISBURSEMENT_LOCKED)
    })

    test('cannot claim non-existent allocation', async () => {
      const user = await localnet.context.generateAccount({ initialFunds: (10).algos() })
      const otherUser = await localnet.context.generateAccount({ initialFunds: (10).algos() })
      const rewardAmount = 1_000_000n

      const currentTimestamp = await getCurrentTimestamp()

      const allocations: [string, bigint][] = [[user.addr.toString(), rewardAmount]]

      const mbrAmount = BigInt(MinDisbursementsMBR) + BigInt(UserAllocationMBR) * BigInt(allocations.length)

      const mbrPayment = await algorand.createTransaction.payment({
        sender: deployer.addr,
        receiver: client.appAddress,
        amount: microAlgo(mbrAmount + rewardAmount),
      })

      const createResult = await client.send.createInstantDisbursement({
        args: {
          mbrPayment,
          timeToUnlock: 0n,
          expiration: currentTimestamp + 86400n,
          allocations,
        },
        sender: deployer.addr,
        signer: deployer.signer,
      })
      const disbursementId = createResult.return!

      let error = 'no error thrown'
      try {
        await client.send.claimRewards({
          args: {
            rewards: [[disbursementId, 0n]],
          },
          sender: otherUser.addr,
          signer: makeBasicAccountTransactionSigner(otherUser),
        })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_ALLOCATION_DOES_NOT_EXIST)
    })

    test('cannot claim same rewards twice', async () => {
      const user = await localnet.context.generateAccount({ initialFunds: (10).algos() })
      const rewardAmount = 1_000_000n

      const currentTimestamp = await getCurrentTimestamp()

      const allocations: [string, bigint][] = [[user.addr.toString(), rewardAmount]]

      const mbrAmount = BigInt(MinDisbursementsMBR) + BigInt(UserAllocationMBR) * BigInt(allocations.length)

      const mbrPayment = await algorand.createTransaction.payment({
        sender: deployer.addr,
        receiver: client.appAddress,
        amount: microAlgo(mbrAmount + rewardAmount),
      })

      const createResult = await client.send.createInstantDisbursement({
        args: {
          mbrPayment,
          timeToUnlock: 0n,
          expiration: currentTimestamp + 86400n,
          allocations,
        },
        sender: deployer.addr,
        signer: deployer.signer,
      })
      const disbursementId = createResult.return!

      // First claim should succeed
      await client.send.claimRewards({
        args: {
          rewards: [[disbursementId, 0n]],
        },
        sender: user.addr,
        signer: makeBasicAccountTransactionSigner(user),
        extraFee: microAlgo(2000n), // Cover inner transaction fees
      })

      let error = 'no error thrown'
      try {
        // Second claim should fail
        await client.send.claimRewards({
          args: {
            rewards: [[disbursementId, 0n]],
          },
          sender: user.addr,
          signer: makeBasicAccountTransactionSigner(user),
          extraFee: microAlgo(2000n),
        })
      } catch (e: any) {
        error = e.message
      }

      // After the first claim, disbursement is fully distributed (amount == distributed)
      // The contract checks this condition before checking if allocation exists
      expect(error).toContain('Disbursement is fully distributed')
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // RECLAIM REWARDS TESTS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Reclaim Expired Rewards', () => {
    test('creator can reclaim expired ALGO rewards', async () => {
      const user = await localnet.context.generateAccount({ initialFunds: (10).algos() })
      const rewardAmount = 3_000_000n

      const currentTimestamp = await getCurrentTimestamp()

      const allocations: [string, bigint][] = [[user.addr.toString(), rewardAmount]]

      const mbrAmount = BigInt(MinDisbursementsMBR) + BigInt(UserAllocationMBR) * BigInt(allocations.length)

      const mbrPayment = await algorand.createTransaction.payment({
        sender: deployer.addr,
        receiver: client.appAddress,
        amount: microAlgo(mbrAmount + rewardAmount),
      })

      const createResult = await client.send.createInstantDisbursement({
        args: {
          mbrPayment,
          timeToUnlock: 0n,
          expiration: currentTimestamp + 120n, // Expires in 2 minutes
          allocations,
        },
        sender: deployer.addr,
        signer: deployer.signer,
      })
      const disbursementId = createResult.return!

      await timeWarp.timeWarp(180n) // Warp 3 minutes

      const balanceBefore = await algorand.account.getInformation(deployer.addr)

      await client.send.reclaimRewards({
        args: {
          id: disbursementId,
          reclaims: [[user.addr.toString(), 0n]],
        },
        sender: deployer.addr,
        signer: deployer.signer,
        extraFee: microAlgo(2000n), // Cover inner transaction fees
      })

      const balanceAfter = await algorand.account.getInformation(deployer.addr)

      const balanceIncrease = balanceAfter.balance.microAlgos - balanceBefore.balance.microAlgos
      expect(balanceIncrease).toBeGreaterThan(Number(rewardAmount) - 15_000) // Allow for extra fees
    })

    test('cannot reclaim non-expired rewards', async () => {
      const user = await localnet.context.generateAccount({ initialFunds: (10).algos() })
      const rewardAmount = 1_000_000n

      const currentTimestamp = await getCurrentTimestamp()

      const allocations: [string, bigint][] = [[user.addr.toString(), rewardAmount]]

      const mbrAmount = BigInt(MinDisbursementsMBR) + BigInt(UserAllocationMBR) * BigInt(allocations.length)

      const mbrPayment = await algorand.createTransaction.payment({
        sender: deployer.addr,
        receiver: client.appAddress,
        amount: microAlgo(mbrAmount + rewardAmount),
      })

      const createResult = await client.send.createInstantDisbursement({
        args: {
          mbrPayment,
          timeToUnlock: 0n,
          expiration: currentTimestamp + 86400n, // Long expiration
          allocations,
        },
        sender: deployer.addr,
        signer: deployer.signer,
      })
      const disbursementId = createResult.return!

      let error = 'no error thrown'
      try {
        await client.send.reclaimRewards({
          args: {
            id: disbursementId,
            reclaims: [[user.addr.toString(), 0n]],
          },
          sender: deployer.addr,
          signer: deployer.signer,
        })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_DISBURSEMENT_NOT_EXPIRED)
    })

    test('only creator can reclaim rewards', async () => {
      const user = await localnet.context.generateAccount({ initialFunds: (10).algos() })
      const attacker = await localnet.context.generateAccount({ initialFunds: (10).algos() })
      const rewardAmount = 1_000_000n

      const currentTimestamp = await getCurrentTimestamp()

      const allocations: [string, bigint][] = [[user.addr.toString(), rewardAmount]]

      const mbrAmount = BigInt(MinDisbursementsMBR) + BigInt(UserAllocationMBR) * BigInt(allocations.length)

      const mbrPayment = await algorand.createTransaction.payment({
        sender: deployer.addr,
        receiver: client.appAddress,
        amount: microAlgo(mbrAmount + rewardAmount),
      })

      const createResult = await client.send.createInstantDisbursement({
        args: {
          mbrPayment,
          timeToUnlock: 0n,
          expiration: currentTimestamp + 120n,
          allocations,
        },
        sender: deployer.addr,
        signer: deployer.signer,
      })
      const disbursementId = createResult.return!

      await timeWarp.timeWarp(180n)

      let error = 'no error thrown'
      try {
        await client.send.reclaimRewards({
          args: {
            id: disbursementId,
            reclaims: [[user.addr.toString(), 0n]],
          },
          sender: attacker.addr,
          signer: makeBasicAccountTransactionSigner(attacker),
        })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_YOU_ARE_NOT_THE_CREATOR)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // MBR CALCULATION TESTS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('MBR Calculation', () => {
    test('mbr calculation returns correct values', async () => {
      const title = 'Test Title'
      const note = 'Test note for MBR calculation'

      const result = await client.send.mbr({
        args: { title, note },
        sender: deployer.addr,
        signer: deployer.signer,
      })

      expect(result.return).toBeDefined()

      const mbrResult = result.return!
      expect(mbrResult.disbursements).toBeDefined()
      expect(mbrResult.userAllocations).toBeDefined()

      const expectedDisbursementMbr = calculateDisbursementMBR(title, note)
      expect(mbrResult.disbursements).toBe(expectedDisbursementMbr)

      expect(mbrResult.userAllocations).toBe(BigInt(UserAllocationMBR))
    })

    test('mbr increases with longer title and note', async () => {
      const shortTitle = 'A'
      const shortNote = 'B'
      const longTitle = 'This is a much longer title for testing'
      const longNote = 'This is a much longer note for testing MBR calculations'

      const shortResult = await client.send.mbr({
        args: { title: shortTitle, note: shortNote },
        sender: deployer.addr,
        signer: deployer.signer,
      })

      const longResult = await client.send.mbr({
        args: { title: longTitle, note: longNote },
        sender: deployer.addr,
        signer: deployer.signer,
      })

      expect(longResult.return!.disbursements).toBeGreaterThan(shortResult.return!.disbursements)
    })
  })
})
