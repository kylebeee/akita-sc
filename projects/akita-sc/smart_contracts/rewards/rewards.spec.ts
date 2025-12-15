import * as algokit from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { afterEach, beforeAll, beforeEach, describe, expect, test } from '@jest/globals'
import { RewardsSDK, UserAllocation } from 'akita-sdk/rewards'
import algosdk, { makeBasicAccountTransactionSigner } from 'algosdk'
import { TimeWarp } from '../../tests/utils/time'
import { RewardsFactory } from '../artifacts/rewards/RewardsClient'
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

algokit.Config.configure({
  debug: true,
  populateAppCallResources: true,
})

describe('Rewards SDK Tests', () => {
  const fixture = algorandFixture()

  let deployer: algosdk.Address & TransactionSignerAccount & algosdk.Account
  let sdk: RewardsSDK
  let timeWarp: TimeWarp
  let algorand: import('@algorandfoundation/algokit-utils').AlgorandClient

  // Helper to get current timestamp
  const getCurrentTimestamp = async (): Promise<bigint> => {
    const status = await algorand.client.algod.status().do()
    const block = await algorand.client.algod.block(status.lastRound).do()
    return BigInt(block.block.header.timestamp)
  }

  beforeAll(async () => {
    await fixture.newScope()
    algorand = fixture.algorand
    const { testAccount } = fixture.context
    deployer = testAccount

    timeWarp = new TimeWarp(algorand)

    // Create the rewards contract
    const factory = algorand.client.getTypedAppFactory(RewardsFactory, {
      defaultSender: deployer.addr,
      defaultSigner: deployer.signer,
    })

    const results = await factory.send.create.create({
      args: { version: '1.0.0', akitaDao: 0n },
    })

    // Initialize the SDK
    sdk = new RewardsSDK({
      factoryParams: {
        appId: results.appClient.appId,
        defaultSender: deployer.addr,
        defaultSigner: deployer.signer,
      },
      algorand,
    })

    // Fund the contract
    const dispenser = await algorand.account.dispenserFromEnvironment()
    await algorand.send.payment({
      sender: dispenser.addr,
      signer: dispenser.signer,
      receiver: sdk.client.appAddress,
      amount: algokit.microAlgo(500_000_000n),
    })

    console.log('Rewards App ID:', sdk.appId)
    console.log('Rewards Address:', sdk.client.appAddress.toString())
  })

  beforeEach(async () => {
    const dispenser = await algorand.account.dispenserFromEnvironment()
    await algorand.account.ensureFunded(deployer.addr, dispenser, (100).algos())
  })

  afterEach(async () => {
    if (timeWarp) {
      await timeWarp.resetTimeWarp()
    }
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // SDK READ METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('SDK Read Methods', () => {
    test('getState returns correct global state', async () => {
      const state = await sdk.getState()

      expect(state.version).toBe('1.0.0')
      expect(state.disbursementId).toBeDefined()
      expect(typeof state.disbursementId).toBe('bigint')
    })

    test('mbr returns correct MBR data', async () => {
      const mbrData = await sdk.mbr({ title: 'Test Title', note: 'Test Note' })

      expect(mbrData.disbursements).toBeDefined()
      expect(mbrData.userAllocations).toBeDefined()
      expect(mbrData.disbursements).toBeGreaterThan(0n)
      expect(mbrData.userAllocations).toBeGreaterThan(0n)
    })

    test('mbr increases with longer strings', async () => {
      const shortMbr = await sdk.mbr({ title: 'A', note: 'B' })
      const longMbr = await sdk.mbr({
        title: 'This is a much longer title',
        note: 'This is a much longer note for testing',
      })

      expect(longMbr.disbursements).toBeGreaterThan(shortMbr.disbursements)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // SDK DISBURSEMENT CREATION
  // ═══════════════════════════════════════════════════════════════════════════

  describe('SDK Disbursement Creation', () => {
    test('createDisbursement creates successfully', async () => {
      const currentTimestamp = await getCurrentTimestamp()

      const disbursementId = await sdk.createDisbursement({
        title: 'SDK Test Disbursement',
        timeToUnlock: currentTimestamp + 60n,
        expiration: currentTimestamp + 86400n,
        note: 'Created via SDK',
      })

      expect(disbursementId).toBeDefined()
      expect(typeof disbursementId).toBe('bigint')
    })

    test('getDisbursement retrieves created disbursement', async () => {
      const currentTimestamp = await getCurrentTimestamp()

      const disbursementId = await sdk.createDisbursement({
        title: 'Retrievable Disbursement',
        timeToUnlock: currentTimestamp + 60n,
        expiration: currentTimestamp + 86400n,
        note: 'For retrieval test',
      })

      const disbursement = await sdk.getDisbursement({ id: disbursementId })

      expect(disbursement.title).toBe('Retrievable Disbursement')
      expect(disbursement.note).toBe('For retrieval test')
      expect(disbursement.finalized).toBe(false)
      expect(disbursement.amount).toBe(0n)
    })

    test('getDisbursements returns all disbursements', async () => {
      const disbursements = await sdk.getDisbursements()

      expect(disbursements).toBeInstanceOf(Map)
      expect(disbursements.size).toBeGreaterThan(0)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // SDK DISBURSEMENT EDITING
  // ═══════════════════════════════════════════════════════════════════════════

  describe('SDK Disbursement Editing', () => {
    test('editDisbursement updates successfully', async () => {
      const currentTimestamp = await getCurrentTimestamp()

      const disbursementId = await sdk.createDisbursement({
        title: 'Editable via SDK',
        timeToUnlock: currentTimestamp + 60n,
        expiration: currentTimestamp + 86400n,
        note: 'Original note',
      })

      await sdk.editDisbursement({
        id: disbursementId,
        title: 'Updated via SDK',
        timeToUnlock: currentTimestamp + 120n,
        expiration: currentTimestamp + 172800n,
        note: 'Updated note',
      })

      const updated = await sdk.getDisbursement({ id: disbursementId })
      expect(updated.title).toBe('Updated via SDK')
      expect(updated.note).toBe('Updated note')
    })

    test('editDisbursement fails for non-existent id', async () => {
      const currentTimestamp = await getCurrentTimestamp()

      await expect(
        sdk.editDisbursement({
          id: 999999n,
          title: 'Will Fail',
          timeToUnlock: currentTimestamp + 60n,
          expiration: currentTimestamp + 86400n,
          note: 'Should not work',
        })
      ).rejects.toThrow(ERR_DISBURSEMENT_DOES_NOT_EXIST)
    })

    test('editDisbursement fails for non-creator', async () => {
      const currentTimestamp = await getCurrentTimestamp()

      const disbursementId = await sdk.createDisbursement({
        title: 'Only Creator Can Edit',
        timeToUnlock: currentTimestamp + 60n,
        expiration: currentTimestamp + 86400n,
        note: 'Test note',
      })

      const otherAccount = await fixture.context.generateAccount({
        initialFunds: (10).algos(),
      })

      await expect(
        sdk.editDisbursement({
          sender: otherAccount.addr,
          signer: makeBasicAccountTransactionSigner(otherAccount),
          id: disbursementId,
          title: 'Malicious Edit',
          timeToUnlock: currentTimestamp + 60n,
          expiration: currentTimestamp + 86400n,
          note: 'Should fail',
        })
      ).rejects.toThrow(ERR_YOU_ARE_NOT_THE_CREATOR)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // SDK ALGO ALLOCATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('SDK ALGO Allocations', () => {
    test('createUserAllocations creates ALGO allocations', async () => {
      const user1 = await fixture.context.generateAccount({ initialFunds: (10).algos() })
      const user2 = await fixture.context.generateAccount({ initialFunds: (10).algos() })

      const currentTimestamp = await getCurrentTimestamp()

      const disbursementId = await sdk.createDisbursement({
        title: 'ALGO Allocation Test',
        timeToUnlock: currentTimestamp + 60n,
        expiration: currentTimestamp + 86400n,
        note: 'For allocation test',
      })

      const allocations: UserAllocation[] = [
        { address: user1.addr.toString(), amount: 1_000_000n },
        { address: user2.addr.toString(), amount: 2_000_000n },
      ]

      await sdk.createUserAllocations({
        id: disbursementId,
        allocations,
      })

      // Verify allocations were created
      const user1Allocation = await sdk.getUserAllocation({
        address: user1.addr.toString(),
        disbursementId,
        asset: 0n,
      })
      expect(user1Allocation).toBe(1_000_000n)

      const user2Allocation = await sdk.getUserAllocation({
        address: user2.addr.toString(),
        disbursementId,
        asset: 0n,
      })
      expect(user2Allocation).toBe(2_000_000n)
    })

    test('hasAllocation returns correct boolean', async () => {
      const user = await fixture.context.generateAccount({ initialFunds: (10).algos() })
      const otherUser = await fixture.context.generateAccount({ initialFunds: (10).algos() })

      const currentTimestamp = await getCurrentTimestamp()

      const disbursementId = await sdk.createDisbursement({
        title: 'Has Allocation Test',
        timeToUnlock: currentTimestamp + 60n,
        expiration: currentTimestamp + 86400n,
        note: 'Test note',
      })

      await sdk.createUserAllocations({
        id: disbursementId,
        allocations: [{ address: user.addr.toString(), amount: 1_000_000n }],
      })

      const hasAlloc = await sdk.hasAllocation({
        address: user.addr.toString(),
        disbursementId,
        asset: 0n,
      })
      expect(hasAlloc).toBe(true)

      const noAlloc = await sdk.hasAllocation({
        address: otherUser.addr.toString(),
        disbursementId,
        asset: 0n,
      })
      expect(noAlloc).toBe(false)
    })

    test('createUserAllocations fails for duplicate allocation', async () => {
      const user = await fixture.context.generateAccount({ initialFunds: (10).algos() })

      const currentTimestamp = await getCurrentTimestamp()

      const disbursementId = await sdk.createDisbursement({
        title: 'Duplicate Prevention',
        timeToUnlock: currentTimestamp + 60n,
        expiration: currentTimestamp + 86400n,
        note: 'Test note',
      })

      await sdk.createUserAllocations({
        id: disbursementId,
        allocations: [{ address: user.addr.toString(), amount: 1_000_000n }],
      })

      await expect(
        sdk.createUserAllocations({
          id: disbursementId,
          allocations: [{ address: user.addr.toString(), amount: 500_000n }],
        })
      ).rejects.toThrow(ERR_ALLOCATION_ALREADY_EXISTS)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // SDK FINALIZE DISBURSEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  describe('SDK Finalize Disbursement', () => {
    test('finalizeDisbursement works with allocations', async () => {
      const user = await fixture.context.generateAccount({ initialFunds: (10).algos() })

      const currentTimestamp = await getCurrentTimestamp()

      const disbursementId = await sdk.createDisbursement({
        title: 'To Finalize',
        timeToUnlock: currentTimestamp + 60n,
        expiration: currentTimestamp + 86400n,
        note: 'For finalization',
      })

      await sdk.createUserAllocations({
        id: disbursementId,
        allocations: [{ address: user.addr.toString(), amount: 1_000_000n }],
      })

      await sdk.finalizeDisbursement({ id: disbursementId })

      const disbursement = await sdk.getDisbursement({ id: disbursementId })
      expect(disbursement.finalized).toBe(true)
    })

    test('finalizeDisbursement fails without allocations', async () => {
      const currentTimestamp = await getCurrentTimestamp()

      const disbursementId = await sdk.createDisbursement({
        title: 'Empty Disbursement',
        timeToUnlock: currentTimestamp + 60n,
        expiration: currentTimestamp + 86400n,
        note: 'No allocations',
      })

      await expect(sdk.finalizeDisbursement({ id: disbursementId })).rejects.toThrow(
        ERR_DISBURSEMENTS_CANNOT_BE_EMPTY
      )
    })

    test('finalizeDisbursement fails twice', async () => {
      const user = await fixture.context.generateAccount({ initialFunds: (10).algos() })

      const currentTimestamp = await getCurrentTimestamp()

      const disbursementId = await sdk.createDisbursement({
        title: 'Double Finalize',
        timeToUnlock: currentTimestamp + 60n,
        expiration: currentTimestamp + 86400n,
        note: 'Test note',
      })

      await sdk.createUserAllocations({
        id: disbursementId,
        allocations: [{ address: user.addr.toString(), amount: 1_000_000n }],
      })

      await sdk.finalizeDisbursement({ id: disbursementId })

      await expect(sdk.finalizeDisbursement({ id: disbursementId })).rejects.toThrow(
        ERR_DISBURSEMENT_ALREADY_FINAL
      )
    })

    test('finalizeDisbursement fails with past unlock time', async () => {
      const user = await fixture.context.generateAccount({ initialFunds: (10).algos() })

      const currentTimestamp = await getCurrentTimestamp()

      const disbursementId = await sdk.createDisbursement({
        title: 'Past Unlock',
        timeToUnlock: currentTimestamp - 100n,
        expiration: currentTimestamp + 86400n,
        note: 'Test note',
      })

      await sdk.createUserAllocations({
        id: disbursementId,
        allocations: [{ address: user.addr.toString(), amount: 1_000_000n }],
      })

      await expect(sdk.finalizeDisbursement({ id: disbursementId })).rejects.toThrow(
        ERR_INVALID_DISBURSEMENT_UNLOCK_TIME
      )
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // SDK INSTANT DISBURSEMENTS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('SDK Instant Disbursements', () => {
    test('createInstantDisbursement creates finalized ALGO disbursement', async () => {
      const user1 = await fixture.context.generateAccount({ initialFunds: (10).algos() })
      const user2 = await fixture.context.generateAccount({ initialFunds: (10).algos() })

      const currentTimestamp = await getCurrentTimestamp()

      const disbursementId = await sdk.createInstantDisbursement({
        timeToUnlock: 0n,
        expiration: currentTimestamp + 86400n,
        allocations: [
          { address: user1.addr.toString(), amount: 1_000_000n },
          { address: user2.addr.toString(), amount: 2_000_000n },
        ],
      })

      expect(disbursementId).toBeDefined()

      const disbursement = await sdk.getDisbursement({ id: disbursementId })
      expect(disbursement.finalized).toBe(true)
      expect(disbursement.amount).toBe(3_000_000n)
    })

    test('createInstantAsaDisbursement creates finalized ASA disbursement', async () => {
      const user1 = await fixture.context.generateAccount({ initialFunds: (10).algos() })
      const user2 = await fixture.context.generateAccount({ initialFunds: (10).algos() })

      // Create test asset
      const assetResult = await algorand.send.assetCreate({
        sender: deployer.addr,
        signer: deployer.signer,
        total: 10_000_000_000n,
        decimals: 6,
        assetName: 'SDK Test Token',
        unitName: 'SDKT',
      })
      const assetId = BigInt(assetResult.assetId)

      // Opt contract into asset
      await sdk.optIn({ asset: assetId })

      // Users opt into asset
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

      const disbursementId = await sdk.createInstantAsaDisbursement({
        timeToUnlock: 0n,
        expiration: currentTimestamp + 86400n,
        asset: assetId,
        allocations: [
          { address: user1.addr.toString(), amount: 100_000_000n },
          { address: user2.addr.toString(), amount: 200_000_000n },
        ],
      })

      expect(disbursementId).toBeDefined()

      const disbursement = await sdk.getDisbursement({ id: disbursementId })
      expect(disbursement.finalized).toBe(true)
      expect(disbursement.amount).toBe(300_000_000n)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // SDK CLAIM REWARDS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('SDK Claim Rewards', () => {
    test('claimRewards claims ALGO rewards successfully', async () => {
      const user = await fixture.context.generateAccount({ initialFunds: (10).algos() })
      const rewardAmount = 5_000_000n

      const currentTimestamp = await getCurrentTimestamp()

      const disbursementId = await sdk.createInstantDisbursement({
        timeToUnlock: 0n,
        expiration: currentTimestamp + 86400n,
        allocations: [{ address: user.addr.toString(), amount: rewardAmount }],
      })

      const balanceBefore = await algorand.account.getInformation(user.addr)

      await sdk.claimRewards({
        sender: user.addr,
        signer: makeBasicAccountTransactionSigner(user),
        rewards: [{ id: disbursementId, asset: 0n }],
      })

      const balanceAfter = await algorand.account.getInformation(user.addr)
      const balanceIncrease = balanceAfter.balance.microAlgos - balanceBefore.balance.microAlgos

      // Account for transaction fees
      expect(balanceIncrease).toBeGreaterThan(Number(rewardAmount) - 15_000)
    })

    test('claimRewards claims ASA rewards successfully', async () => {
      const user = await fixture.context.generateAccount({ initialFunds: (10).algos() })
      const rewardAmount = 50_000_000n

      // Create test asset
      const assetResult = await algorand.send.assetCreate({
        sender: deployer.addr,
        signer: deployer.signer,
        total: 10_000_000_000n,
        decimals: 6,
        assetName: 'Claim Test Token',
        unitName: 'CLM',
      })
      const assetId = BigInt(assetResult.assetId)

      await sdk.optIn({ asset: assetId })

      await algorand.send.assetOptIn({
        sender: user.addr,
        signer: makeBasicAccountTransactionSigner(user),
        assetId,
      })

      const currentTimestamp = await getCurrentTimestamp()

      const disbursementId = await sdk.createInstantAsaDisbursement({
        timeToUnlock: 0n,
        expiration: currentTimestamp + 86400n,
        asset: assetId,
        allocations: [{ address: user.addr.toString(), amount: rewardAmount }],
      })

      await sdk.claimRewards({
        sender: user.addr,
        signer: makeBasicAccountTransactionSigner(user),
        rewards: [{ id: disbursementId, asset: assetId }],
      })

      const accountInfo = await algorand.client.algod.accountInformation(user.addr.toString()).do()
      const assetHolding = accountInfo.assets?.find(
        (a: { assetId?: number | bigint; 'asset-id'?: number }) =>
          BigInt(a.assetId ?? a['asset-id'] ?? 0) === assetId
      )
      expect(BigInt(assetHolding?.amount ?? 0)).toBe(rewardAmount)
    })

    test('claimRewards fails when rewards are locked', async () => {
      const user = await fixture.context.generateAccount({ initialFunds: (10).algos() })

      const currentTimestamp = await getCurrentTimestamp()

      const disbursementId = await sdk.createInstantDisbursement({
        timeToUnlock: currentTimestamp + 3600n, // Locked for 1 hour
        expiration: currentTimestamp + 86400n,
        allocations: [{ address: user.addr.toString(), amount: 1_000_000n }],
      })

      await expect(
        sdk.claimRewards({
          sender: user.addr,
          signer: makeBasicAccountTransactionSigner(user),
          rewards: [{ id: disbursementId, asset: 0n }],
        })
      ).rejects.toThrow(ERR_DISBURSEMENT_LOCKED)
    })

    test('claimRewards fails for non-allocated user', async () => {
      const user = await fixture.context.generateAccount({ initialFunds: (10).algos() })
      const otherUser = await fixture.context.generateAccount({ initialFunds: (10).algos() })

      const currentTimestamp = await getCurrentTimestamp()

      const disbursementId = await sdk.createInstantDisbursement({
        timeToUnlock: 0n,
        expiration: currentTimestamp + 86400n,
        allocations: [{ address: user.addr.toString(), amount: 1_000_000n }],
      })

      await expect(
        sdk.claimRewards({
          sender: otherUser.addr,
          signer: makeBasicAccountTransactionSigner(otherUser),
          rewards: [{ id: disbursementId, asset: 0n }],
        })
      ).rejects.toThrow(ERR_ALLOCATION_DOES_NOT_EXIST)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // SDK RECLAIM REWARDS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('SDK Reclaim Rewards', () => {
    test('reclaimRewards reclaims expired ALGO rewards', async () => {
      const user = await fixture.context.generateAccount({ initialFunds: (10).algos() })
      const rewardAmount = 3_000_000n

      const currentTimestamp = await getCurrentTimestamp()

      const disbursementId = await sdk.createInstantDisbursement({
        timeToUnlock: 0n,
        expiration: currentTimestamp + 120n, // Expires in 2 minutes
        allocations: [{ address: user.addr.toString(), amount: rewardAmount }],
      })

      await timeWarp.timeWarp(180n) // Warp 3 minutes

      const balanceBefore = await algorand.account.getInformation(deployer.addr)

      await sdk.reclaimRewards({
        id: disbursementId,
        reclaims: [{ address: user.addr.toString(), asset: 0n }],
      })

      const balanceAfter = await algorand.account.getInformation(deployer.addr)
      const balanceIncrease = balanceAfter.balance.microAlgos - balanceBefore.balance.microAlgos

      expect(balanceIncrease).toBeGreaterThan(Number(rewardAmount) - 15_000)
    })

    test('reclaimRewards fails for non-expired rewards', async () => {
      const user = await fixture.context.generateAccount({ initialFunds: (10).algos() })

      const currentTimestamp = await getCurrentTimestamp()

      const disbursementId = await sdk.createInstantDisbursement({
        timeToUnlock: 0n,
        expiration: currentTimestamp + 86400n, // Long expiration
        allocations: [{ address: user.addr.toString(), amount: 1_000_000n }],
      })

      await expect(
        sdk.reclaimRewards({
          id: disbursementId,
          reclaims: [{ address: user.addr.toString(), asset: 0n }],
        })
      ).rejects.toThrow(ERR_DISBURSEMENT_NOT_EXPIRED)
    })

    test('reclaimRewards fails for non-creator', async () => {
      const user = await fixture.context.generateAccount({ initialFunds: (10).algos() })
      const attacker = await fixture.context.generateAccount({ initialFunds: (10).algos() })

      const currentTimestamp = await getCurrentTimestamp()

      const disbursementId = await sdk.createInstantDisbursement({
        timeToUnlock: 0n,
        expiration: currentTimestamp + 120n,
        allocations: [{ address: user.addr.toString(), amount: 1_000_000n }],
      })

      await timeWarp.timeWarp(180n)

      await expect(
        sdk.reclaimRewards({
          sender: attacker.addr,
          signer: makeBasicAccountTransactionSigner(attacker),
          id: disbursementId,
          reclaims: [{ address: user.addr.toString(), asset: 0n }],
        })
      ).rejects.toThrow(ERR_YOU_ARE_NOT_THE_CREATOR)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // SDK ASA ALLOCATIONS (Multi-Step Flow)
  // ═══════════════════════════════════════════════════════════════════════════

  describe('SDK ASA Allocations (Multi-Step)', () => {
    test('createAsaUserAllocations creates ASA allocations', async () => {
      const user1 = await fixture.context.generateAccount({ initialFunds: (10).algos() })
      const user2 = await fixture.context.generateAccount({ initialFunds: (10).algos() })

      // Create test asset
      const assetResult = await algorand.send.assetCreate({
        sender: deployer.addr,
        signer: deployer.signer,
        total: 10_000_000_000n,
        decimals: 6,
        assetName: 'Allocation Token',
        unitName: 'ALOC',
      })
      const assetId = BigInt(assetResult.assetId)

      await sdk.optIn({ asset: assetId })

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

      const disbursementId = await sdk.createDisbursement({
        title: 'ASA Allocation Test',
        timeToUnlock: currentTimestamp + 60n,
        expiration: currentTimestamp + 86400n,
        note: 'For ASA allocation',
      })

      await sdk.createAsaUserAllocations({
        id: disbursementId,
        asset: assetId,
        allocations: [
          { address: user1.addr.toString(), amount: 100_000_000n },
          { address: user2.addr.toString(), amount: 200_000_000n },
        ],
      })

      // Verify allocations
      const user1Allocation = await sdk.getUserAllocation({
        address: user1.addr.toString(),
        disbursementId,
        asset: assetId,
      })
      expect(user1Allocation).toBe(100_000_000n)

      const user2Allocation = await sdk.getUserAllocation({
        address: user2.addr.toString(),
        disbursementId,
        asset: assetId,
      })
      expect(user2Allocation).toBe(200_000_000n)

      // Finalize and verify
      await sdk.finalizeDisbursement({ id: disbursementId })

      const disbursement = await sdk.getDisbursement({ id: disbursementId })
      expect(disbursement.finalized).toBe(true)
      expect(disbursement.amount).toBe(300_000_000n)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // SDK OPT-IN
  // ═══════════════════════════════════════════════════════════════════════════

  describe('SDK Opt-In', () => {
    test('optIn opts contract into asset', async () => {
      const assetResult = await algorand.send.assetCreate({
        sender: deployer.addr,
        signer: deployer.signer,
        total: 1_000_000n,
        decimals: 0,
        assetName: 'Opt In Test',
        unitName: 'OPT',
      })
      const assetId = BigInt(assetResult.assetId)

      await sdk.optIn({ asset: assetId })

      // Verify the contract holds the asset (balance should be 0)
      const accountInfo = await algorand.client.algod
        .accountInformation(sdk.client.appAddress.toString())
        .do()
      const assetHolding = accountInfo.assets?.find(
        (a: { assetId?: number | bigint; 'asset-id'?: number }) =>
          BigInt(a.assetId ?? a['asset-id'] ?? 0) === assetId
      )
      expect(assetHolding).toBeDefined()
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // BATCH LIMITS - Testing transaction limits
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Batch Limits', () => {
    // Helper to generate multiple test accounts
    const generateAccounts = async (count: number) => {
      const accounts = []
      for (let i = 0; i < count; i++) {
        const account = await fixture.context.generateAccount({ initialFunds: (10).algos() })
        accounts.push(account)
      }
      return accounts
    }

    // Helper to create allocations array
    const createAllocations = (accounts: algosdk.Account[], amount: bigint): UserAllocation[] => {
      return accounts.map(account => ({
        address: account.addr.toString(),
        amount,
      }))
    }

    describe('createUserAllocations limits (with dynamic opUp)', () => {
      test('can create 5 ALGO allocations (no opUp needed)', async () => {
        const accounts = await generateAccounts(5)
        const currentTimestamp = await getCurrentTimestamp()

        const disbursementId = await sdk.createDisbursement({
          title: 'Batch 5',
          timeToUnlock: currentTimestamp + 60n,
          expiration: currentTimestamp + 86400n,
          note: 'Testing 5 allocations',
        })

        await sdk.createUserAllocations({
          id: disbursementId,
          allocations: createAllocations(accounts, 100_000n),
        })

        const disbursement = await sdk.getDisbursement({ id: disbursementId })
        expect(disbursement.allocations).toBe(5n)
      })

      test('can create 10 ALGO allocations (with opUp)', async () => {
        const accounts = await generateAccounts(10)
        const currentTimestamp = await getCurrentTimestamp()

        const disbursementId = await sdk.createDisbursement({
          title: 'Batch 10',
          timeToUnlock: currentTimestamp + 60n,
          expiration: currentTimestamp + 86400n,
          note: 'Testing 10 allocations with opUp',
        })

        await sdk.createUserAllocations({
          id: disbursementId,
          allocations: createAllocations(accounts, 100_000n),
        })

        const disbursement = await sdk.getDisbursement({ id: disbursementId })
        expect(disbursement.allocations).toBe(10n)
      })

      test('can create 15 ALGO allocations (with multiple opUps)', async () => {
        const accounts = await generateAccounts(15)
        const currentTimestamp = await getCurrentTimestamp()

        const disbursementId = await sdk.createDisbursement({
          title: 'Batch 15',
          timeToUnlock: currentTimestamp + 60n,
          expiration: currentTimestamp + 86400n,
          note: 'Testing 15 allocations with opUps',
        })

        await sdk.createUserAllocations({
          id: disbursementId,
          allocations: createAllocations(accounts, 100_000n),
        })

        const disbursement = await sdk.getDisbursement({ id: disbursementId })
        expect(disbursement.allocations).toBe(15n)
      })
    })

    describe('createInstantDisbursement limits (with dynamic opUp)', () => {
      test('can create instant disbursement with 5 allocations (no opUp)', async () => {
        const accounts = await generateAccounts(5)
        const currentTimestamp = await getCurrentTimestamp()

        const disbursementId = await sdk.createInstantDisbursement({
          timeToUnlock: 0n,
          expiration: currentTimestamp + 86400n,
          allocations: createAllocations(accounts, 100_000n),
        })

        const disbursement = await sdk.getDisbursement({ id: disbursementId })
        expect(disbursement.allocations).toBe(5n)
        expect(disbursement.finalized).toBe(true)
      })

      test('can create instant disbursement with 10 allocations (with opUp)', async () => {
        const accounts = await generateAccounts(10)
        const currentTimestamp = await getCurrentTimestamp()

        const disbursementId = await sdk.createInstantDisbursement({
          timeToUnlock: 0n,
          expiration: currentTimestamp + 86400n,
          allocations: createAllocations(accounts, 100_000n),
        })

        const disbursement = await sdk.getDisbursement({ id: disbursementId })
        expect(disbursement.allocations).toBe(10n)
        expect(disbursement.finalized).toBe(true)
      })

      test('can create instant disbursement with 15 allocations (with multiple opUps)', async () => {
        const accounts = await generateAccounts(15)
        const currentTimestamp = await getCurrentTimestamp()

        const disbursementId = await sdk.createInstantDisbursement({
          timeToUnlock: 0n,
          expiration: currentTimestamp + 86400n,
          allocations: createAllocations(accounts, 100_000n),
        })

        const disbursement = await sdk.getDisbursement({ id: disbursementId })
        expect(disbursement.allocations).toBe(15n)
        expect(disbursement.finalized).toBe(true)
      })
    })

    describe('claimRewards limits (with dynamic opUp)', () => {
      test('user can claim from 2 disbursements (no opUp)', async () => {
        const user = await fixture.context.generateAccount({ initialFunds: (10).algos() })
        const currentTimestamp = await getCurrentTimestamp()

        // Create 2 disbursements for the same user
        const disbursementIds: bigint[] = []
        for (let i = 0; i < 2; i++) {
          const id = await sdk.createInstantDisbursement({
            timeToUnlock: 0n,
            expiration: currentTimestamp + 86400n,
            allocations: [{ address: user.addr.toString(), amount: 100_000n }],
          })
          disbursementIds.push(id)
        }

        const balanceBefore = await algorand.account.getInformation(user.addr)

        await sdk.claimRewards({
          sender: user.addr,
          signer: makeBasicAccountTransactionSigner(user),
          rewards: disbursementIds.map(id => ({ id, asset: 0n })),
        })

        const balanceAfter = await algorand.account.getInformation(user.addr)
        const balanceIncrease = balanceAfter.balance.microAlgos - balanceBefore.balance.microAlgos

        // Should have received 200,000 - fees
        expect(balanceIncrease).toBeGreaterThan(180_000)
      })

      test('user can claim from 4 disbursements (with opUp)', async () => {
        const user = await fixture.context.generateAccount({ initialFunds: (10).algos() })
        const currentTimestamp = await getCurrentTimestamp()

        const disbursementIds: bigint[] = []
        for (let i = 0; i < 4; i++) {
          const id = await sdk.createInstantDisbursement({
            timeToUnlock: 0n,
            expiration: currentTimestamp + 86400n,
            allocations: [{ address: user.addr.toString(), amount: 100_000n }],
          })
          disbursementIds.push(id)
        }

        const balanceBefore = await algorand.account.getInformation(user.addr)

        await sdk.claimRewards({
          sender: user.addr,
          signer: makeBasicAccountTransactionSigner(user),
          rewards: disbursementIds.map(id => ({ id, asset: 0n })),
        })

        const balanceAfter = await algorand.account.getInformation(user.addr)
        const balanceIncrease = balanceAfter.balance.microAlgos - balanceBefore.balance.microAlgos

        // Should have received 400,000 - fees
        expect(balanceIncrease).toBeGreaterThan(360_000)
      })

      test('user can claim from 5 disbursements (with opUps)', async () => {
        const user = await fixture.context.generateAccount({ initialFunds: (10).algos() })
        const currentTimestamp = await getCurrentTimestamp()

        const disbursementIds: bigint[] = []
        for (let i = 0; i < 5; i++) {
          const id = await sdk.createInstantDisbursement({
            timeToUnlock: 0n,
            expiration: currentTimestamp + 86400n,
            allocations: [{ address: user.addr.toString(), amount: 100_000n }],
          })
          disbursementIds.push(id)
        }

        const balanceBefore = await algorand.account.getInformation(user.addr)

        await sdk.claimRewards({
          sender: user.addr,
          signer: makeBasicAccountTransactionSigner(user),
          rewards: disbursementIds.map(id => ({ id, asset: 0n })),
        })

        const balanceAfter = await algorand.account.getInformation(user.addr)
        const balanceIncrease = balanceAfter.balance.microAlgos - balanceBefore.balance.microAlgos

        // Should have received 500,000 - fees
        expect(balanceIncrease).toBeGreaterThan(450_000)
      })
    })

    describe('reclaimRewards limits', () => {
      test('creator can reclaim from 3 users in one call', async () => {
        const accounts = await generateAccounts(3)
        const currentTimestamp = await getCurrentTimestamp()

        const disbursementId = await sdk.createInstantDisbursement({
          timeToUnlock: 0n,
          expiration: currentTimestamp + 120n, // Expires in 2 minutes
          allocations: createAllocations(accounts, 100_000n),
        })

        await timeWarp.timeWarp(180n) // Warp past expiration

        const balanceBefore = await algorand.account.getInformation(deployer.addr)

        await sdk.reclaimRewards({
          id: disbursementId,
          reclaims: accounts.map(acc => ({ address: acc.addr.toString(), asset: 0n })),
        })

        const balanceAfter = await algorand.account.getInformation(deployer.addr)
        const balanceIncrease = balanceAfter.balance.microAlgos - balanceBefore.balance.microAlgos

        // Should have received 300,000 - fees + MBR refunds
        expect(balanceIncrease).toBeGreaterThan(250_000)
      })

      test('creator can reclaim from 5 users in one call', async () => {
        const accounts = await generateAccounts(5)
        const currentTimestamp = await getCurrentTimestamp()

        const disbursementId = await sdk.createInstantDisbursement({
          timeToUnlock: 0n,
          expiration: currentTimestamp + 120n,
          allocations: createAllocations(accounts, 100_000n),
        })

        await timeWarp.timeWarp(180n)

        const balanceBefore = await algorand.account.getInformation(deployer.addr)

        await sdk.reclaimRewards({
          id: disbursementId,
          reclaims: accounts.map(acc => ({ address: acc.addr.toString(), asset: 0n })),
        })

        const balanceAfter = await algorand.account.getInformation(deployer.addr)
        const balanceIncrease = balanceAfter.balance.microAlgos - balanceBefore.balance.microAlgos

        // Should have received 500,000 - fees + MBR refunds
        expect(balanceIncrease).toBeGreaterThan(450_000)
      })
    })

    describe('ASA batch limits (with dynamic opUp)', () => {
      test('can create instant ASA disbursement with 5 allocations (no opUp)', async () => {
        const accounts = await generateAccounts(5)

        // Create test asset
        const assetResult = await algorand.send.assetCreate({
          sender: deployer.addr,
          signer: deployer.signer,
          total: 10_000_000_000n,
          decimals: 6,
          assetName: 'Batch ASA Test',
          unitName: 'BATCH',
        })
        const assetId = BigInt(assetResult.assetId)

        await sdk.optIn({ asset: assetId })

        // Users opt into asset
        for (const account of accounts) {
          await algorand.send.assetOptIn({
            sender: account.addr,
            signer: makeBasicAccountTransactionSigner(account),
            assetId,
          })
        }

        const currentTimestamp = await getCurrentTimestamp()

        const disbursementId = await sdk.createInstantAsaDisbursement({
          timeToUnlock: 0n,
          expiration: currentTimestamp + 86400n,
          asset: assetId,
          allocations: createAllocations(accounts, 1_000_000n),
        })

        const disbursement = await sdk.getDisbursement({ id: disbursementId })
        expect(disbursement.allocations).toBe(5n)
        expect(disbursement.amount).toBe(5_000_000n)
      })

      test('can create instant ASA disbursement with 10 allocations (with opUp)', async () => {
        const accounts = await generateAccounts(10)

        const assetResult = await algorand.send.assetCreate({
          sender: deployer.addr,
          signer: deployer.signer,
          total: 10_000_000_000n,
          decimals: 6,
          assetName: 'Batch ASA Test 10',
          unitName: 'BAT10',
        })
        const assetId = BigInt(assetResult.assetId)

        await sdk.optIn({ asset: assetId })

        for (const account of accounts) {
          await algorand.send.assetOptIn({
            sender: account.addr,
            signer: makeBasicAccountTransactionSigner(account),
            assetId,
          })
        }

        const currentTimestamp = await getCurrentTimestamp()

        const disbursementId = await sdk.createInstantAsaDisbursement({
          timeToUnlock: 0n,
          expiration: currentTimestamp + 86400n,
          asset: assetId,
          allocations: createAllocations(accounts, 1_000_000n),
        })

        const disbursement = await sdk.getDisbursement({ id: disbursementId })
        expect(disbursement.allocations).toBe(10n)
        expect(disbursement.amount).toBe(10_000_000n)
      })

      test('can create instant ASA disbursement with 15 allocations (with multiple opUps)', async () => {
        const accounts = await generateAccounts(15)

        const assetResult = await algorand.send.assetCreate({
          sender: deployer.addr,
          signer: deployer.signer,
          total: 10_000_000_000n,
          decimals: 6,
          assetName: 'Batch ASA Test 15',
          unitName: 'BAT15',
        })
        const assetId = BigInt(assetResult.assetId)

        await sdk.optIn({ asset: assetId })

        for (const account of accounts) {
          await algorand.send.assetOptIn({
            sender: account.addr,
            signer: makeBasicAccountTransactionSigner(account),
            assetId,
          })
        }

        const currentTimestamp = await getCurrentTimestamp()

        const disbursementId = await sdk.createInstantAsaDisbursement({
          timeToUnlock: 0n,
          expiration: currentTimestamp + 86400n,
          asset: assetId,
          allocations: createAllocations(accounts, 1_000_000n),
        })

        const disbursement = await sdk.getDisbursement({ id: disbursementId })
        expect(disbursement.allocations).toBe(15n)
        expect(disbursement.amount).toBe(15_000_000n)
      })
    })

    // ═══════════════════════════════════════════════════════════════════════════
    // MAXIMUM ALLOCATION LIMITS
    // ═══════════════════════════════════════════════════════════════════════════
    // Limiting factor: ApplicationArgs size limit (2048 bytes)
    // Each allocation = 40 bytes (32 byte address + 8 byte amount)
    // Overhead = ~22 bytes (method selector + other args)
    // Max allocations = floor((2048 - 22) / 40) = 50 allocations
    //
    // Reference limits (128 with 15 opUps) are NOT the bottleneck here.
    // ═══════════════════════════════════════════════════════════════════════════

    describe('Maximum allocation limits (50 per transaction group)', () => {
      test('ALGO: can create instant disbursement with 50 allocations (MAX)', async () => {
        const MAX_ALLOCATIONS = 50
        const accounts = await generateAccounts(MAX_ALLOCATIONS)
        const currentTimestamp = await getCurrentTimestamp()

        const disbursementId = await sdk.createInstantDisbursement({
          timeToUnlock: 0n,
          expiration: currentTimestamp + 86400n,
          allocations: createAllocations(accounts, 100_000n),
        })

        const disbursement = await sdk.getDisbursement({ id: disbursementId })
        expect(disbursement.allocations).toBe(BigInt(MAX_ALLOCATIONS))
        expect(disbursement.amount).toBe(BigInt(MAX_ALLOCATIONS) * 100_000n)
        expect(disbursement.finalized).toBe(true)
      })

      test('ASA: can create instant disbursement with 50 allocations (MAX)', async () => {
        const MAX_ALLOCATIONS = 50
        const accounts = await generateAccounts(MAX_ALLOCATIONS)

        const assetResult = await algorand.send.assetCreate({
          sender: deployer.addr,
          signer: deployer.signer,
          total: 100_000_000_000n,
          decimals: 6,
          assetName: 'Max Allocation Test',
          unitName: 'MAXA',
        })
        const assetId = BigInt(assetResult.assetId)

        await sdk.optIn({ asset: assetId })

        for (const account of accounts) {
          await algorand.send.assetOptIn({
            sender: account.addr,
            signer: makeBasicAccountTransactionSigner(account),
            assetId,
          })
        }

        const currentTimestamp = await getCurrentTimestamp()

        const disbursementId = await sdk.createInstantAsaDisbursement({
          timeToUnlock: 0n,
          expiration: currentTimestamp + 86400n,
          asset: assetId,
          allocations: createAllocations(accounts, 1_000_000n),
        })

        const disbursement = await sdk.getDisbursement({ id: disbursementId })
        expect(disbursement.allocations).toBe(BigInt(MAX_ALLOCATIONS))
        expect(disbursement.amount).toBe(BigInt(MAX_ALLOCATIONS) * 1_000_000n)
        expect(disbursement.finalized).toBe(true)
      })
    })
  })
})

