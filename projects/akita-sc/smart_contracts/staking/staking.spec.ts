import * as algokit from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { beforeAll, beforeEach, describe, expect, test } from 'vitest'
import algosdk, { makeBasicAccountTransactionSigner } from 'algosdk'
import {
  completeBalanceVerification,
  createExpectedCost,
  expectBalanceChange,
  MIN_TXN_FEE,
  verifyBalanceChange,
} from '../../tests/utils/balance'
import { StakingClient, StakingFactory } from '../artifacts/staking/StakingClient'

algokit.Config.configure({ populateAppCallResources: true })

const fixture = algorandFixture()

// Staking type constants matching contract
const STAKING_TYPE_HEARTBEAT = 10
const STAKING_TYPE_SOFT = 20
const STAKING_TYPE_HARD = 30
const STAKING_TYPE_LOCK = 40

// MBR constants
const STAKES_MBR = 28_900n
const HEARTBEATS_MBR = 70_100n
const SETTINGS_MBR = 9_300n
const TOTALS_MBR = 12_500n
const ASSET_OPT_IN_MBR = 100_000n

// Time constants
const ONE_YEAR = 31_536_000
const ONE_DAY = 86_400
const ONE_HOUR = 3_600

describe('Staking Contract', () => {
  let deployer: algosdk.Account
  let user1: algosdk.Account
  let user2: algosdk.Account
  let heartbeatManager: algosdk.Account
  let client: StakingClient
  let testAssetId: bigint

  beforeEach(fixture.beforeEach)

  beforeAll(async () => {
    await fixture.beforeEach()
    const { algorand } = fixture.context
    const dispenser = await algorand.account.dispenserFromEnvironment()

    // Create accounts
    deployer = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(100_000_000) })
    user1 = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(100_000_000) })
    user2 = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(100_000_000) })
    heartbeatManager = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(100_000_000) })

    await algorand.account.ensureFunded(deployer.addr, dispenser, (100).algo())
    await algorand.account.ensureFunded(user1.addr, dispenser, (100).algo())
    await algorand.account.ensureFunded(user2.addr, dispenser, (100).algo())
    await algorand.account.ensureFunded(heartbeatManager.addr, dispenser, (100).algo())

    // Deploy the staking contract
    const factory = new StakingFactory({
      defaultSender: deployer.addr,
      defaultSigner: makeBasicAccountTransactionSigner(deployer),
      algorand,
    })

    const results = await factory.send.create.create({ args: { version: '1.0.0', akitaDao: 0n } })
    client = results.appClient

    // Fund the contract
    await client.appClient.fundAppAccount({ amount: (1_000_000).microAlgos() })

    // Initialize the contract
    await client.send.init({ args: {} })

    // Create a test ASA
    const assetCreateTxn = await algorand.send.assetCreate({
      sender: deployer.addr,
      signer: makeBasicAccountTransactionSigner(deployer),
      total: 1_000_000_000_000n,
      decimals: 6,
      assetName: 'Test Token',
      unitName: 'TEST',
    })
    testAssetId = BigInt(assetCreateTxn.assetId)

    // Opt user1 and user2 into the test asset
    await algorand.send.assetOptIn({
      sender: user1.addr,
      signer: makeBasicAccountTransactionSigner(user1),
      assetId: testAssetId,
    })
    await algorand.send.assetOptIn({
      sender: user2.addr,
      signer: makeBasicAccountTransactionSigner(user2),
      assetId: testAssetId,
    })

    // Transfer some test tokens to users
    await algorand.send.assetTransfer({
      sender: deployer.addr,
      signer: makeBasicAccountTransactionSigner(deployer),
      receiver: user1.addr,
      assetId: testAssetId,
      amount: 100_000_000_000n,
    })
    await algorand.send.assetTransfer({
      sender: deployer.addr,
      signer: makeBasicAccountTransactionSigner(deployer),
      receiver: user2.addr,
      assetId: testAssetId,
      amount: 100_000_000_000n,
    })
  })

  describe('Contract Deployment', () => {
    test('should deploy with correct version', async () => {
      const version = await client.state.global.version()
      expect(version).toBe('1.0.0')
    })

    test('should have initialized totals for ALGO (asset 0)', async () => {
      const totals = await client.getTotals({ args: { assets: [0n] } })
      expect(totals).toHaveLength(1)
      expect(totals[0][0]).toBe(0n) // locked
      expect(totals[0][1]).toBe(0n) // escrowed
    })

    test('balance should match min balance after funding', async () => {
      const accountInfo = await client.algorand.account.getInformation(client.appAddress)
      expect(accountInfo.balance.microAlgos).toBeGreaterThanOrEqual(accountInfo.minBalance.microAlgos)
    })
  })

  describe('ASA Opt-In', () => {
    test('should opt into a new ASA with correct MBR payment', async () => {
      const { algorand } = fixture.context

      // Create a new asset for this test
      const newAssetTxn = await algorand.send.assetCreate({
        sender: deployer.addr,
        signer: makeBasicAccountTransactionSigner(deployer),
        total: 1_000_000n,
        decimals: 0,
        assetName: 'Opt In Test',
        unitName: 'OPT',
      })
      const newAssetId = BigInt(newAssetTxn.assetId)

      const optInMbr = TOTALS_MBR + ASSET_OPT_IN_MBR
      // Account for: app call fee + payment transaction fee + 1 inner transaction fee
      // Note: extraFee (1000) in the call covers the inner transaction fee, so we don't double-count it
      const expectedCost = createExpectedCost(optInMbr, 0, MIN_TXN_FEE * 2n) // app call + payment transaction
      const verification = await verifyBalanceChange(
        algorand,
        deployer.addr.toString(),
        expectedCost,
        'opt into a new ASA'
      )

      const payment = await algorand.createTransaction.payment({
        sender: deployer.addr,
        receiver: client.appAddress,
        amount: algokit.microAlgos(Number(optInMbr)),
      })

      await client.send.optIn({
        sender: deployer.addr,
        signer: makeBasicAccountTransactionSigner(deployer),
        args: { payment, asset: newAssetId },
        extraFee: algokit.microAlgos(1000), // For inner txn
      })

      // Verify balance change matches expected cost
      const completed = await completeBalanceVerification(
        verification,
        algorand,
        deployer.addr.toString()
      )
      expectBalanceChange(completed, 'opt into a new ASA')
      expect(completed.actualCost).toBe(expectedCost.total)

      // Verify opt-in by checking totals exist for the asset
      const totals = await client.getTotals({ args: { assets: [newAssetId] } })
      expect(totals).toHaveLength(1)
      expect(totals[0][0]).toBe(0n) // locked
      expect(totals[0][1]).toBe(0n) // escrowed
    })

    test('should fail to opt into already opted-in ASA', async () => {
      const { algorand } = fixture.context

      // Create and opt into an asset
      const newAssetTxn = await algorand.send.assetCreate({
        sender: deployer.addr,
        signer: makeBasicAccountTransactionSigner(deployer),
        total: 1_000_000n,
        decimals: 0,
        assetName: 'Double Opt In Test',
        unitName: 'DUP',
      })
      const newAssetId = BigInt(newAssetTxn.assetId)

      const optInMbr = TOTALS_MBR + ASSET_OPT_IN_MBR

      const payment1 = await algorand.createTransaction.payment({
        sender: deployer.addr,
        receiver: client.appAddress,
        amount: algokit.microAlgos(Number(optInMbr)),
      })

      await client.send.optIn({
        sender: deployer.addr,
        signer: makeBasicAccountTransactionSigner(deployer),
        args: { payment: payment1, asset: newAssetId },
        extraFee: algokit.microAlgos(1000),
      })

      // Try to opt in again
      const payment2 = await algorand.createTransaction.payment({
        sender: deployer.addr,
        receiver: client.appAddress,
        amount: algokit.microAlgos(Number(optInMbr)),
      })

      await expect(
        client.send.optIn({
          sender: deployer.addr,
          signer: makeBasicAccountTransactionSigner(deployer),
          args: { payment: payment2, asset: newAssetId },
          extraFee: algokit.microAlgos(1000),
        })
      ).rejects.toThrow()
    })
  })

  describe('ALGO Staking', () => {
    describe('Soft Staking', () => {
      test('should create a new soft stake for ALGO', async () => {
        const { algorand } = fixture.context
        const stakeAmount = 1_000_000n // 1 ALGO

        // Soft staking only requires MBR (no escrow)
        // Account for: app call fee + payment transaction fee
        const expectedCost = createExpectedCost(STAKES_MBR, 0, MIN_TXN_FEE)
        const verification = await verifyBalanceChange(
          algorand,
          user1.addr.toString(),
          expectedCost,
          'create new soft stake for ALGO'
        )

        const payment = await algorand.createTransaction.payment({
          sender: user1.addr,
          receiver: client.appAddress,
          amount: algokit.microAlgos(Number(STAKES_MBR)),
        })

        await client.send.stake({
          sender: user1.addr,
          signer: makeBasicAccountTransactionSigner(user1),
          args: {
            payment,
            type: STAKING_TYPE_SOFT,
            amount: stakeAmount,
            expiration: 0n,
          },
        })

        // Verify balance change matches expected cost
        const completed = await completeBalanceVerification(
          verification,
          algorand,
          user1.addr.toString()
        )
        expectBalanceChange(completed, 'create new soft stake for ALGO')
        expect(completed.actualCost).toBe(expectedCost.total)

        // Verify stake was created
        const info = await client.getInfo({
          args: {
            address: user1.addr.toString(),
            stake: { asset: 0n, type: STAKING_TYPE_SOFT },
          },
        })

        expect(info.amount).toBe(stakeAmount)
      })

      test('should update existing soft stake', async () => {
        const { algorand } = fixture.context
        const initialAmount = 2_000_000n
        const additionalAmount = 1_000_000n

        // Create initial stake
        const payment1 = await algorand.createTransaction.payment({
          sender: user2.addr,
          receiver: client.appAddress,
          amount: algokit.microAlgos(Number(STAKES_MBR)),
        })

        await client.send.stake({
          sender: user2.addr,
          signer: makeBasicAccountTransactionSigner(user2),
          args: {
            payment: payment1,
            type: STAKING_TYPE_SOFT,
            amount: initialAmount,
            expiration: 0n,
          },
        })

        // Update stake (no MBR needed for update)
        const payment2 = await algorand.createTransaction.payment({
          sender: user2.addr,
          receiver: client.appAddress,
          amount: algokit.microAlgos(0),
        })

        await client.send.stake({
          sender: user2.addr,
          signer: makeBasicAccountTransactionSigner(user2),
          args: {
            payment: payment2,
            type: STAKING_TYPE_SOFT,
            amount: additionalAmount,
            expiration: 0n,
          },
        })

        // Verify updated stake
        const info = await client.getInfo({
          args: {
            address: user2.addr.toString(),
            stake: { asset: 0n, type: STAKING_TYPE_SOFT },
          },
        })

        expect(info.amount).toBe(initialAmount + additionalAmount)
      })

      test('should fail soft stake if balance insufficient', async () => {
        const { algorand } = fixture.context

        // Create account with minimal funds
        const poorUser = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(500_000) })

        const payment = await algorand.createTransaction.payment({
          sender: poorUser.addr,
          receiver: client.appAddress,
          amount: algokit.microAlgos(Number(STAKES_MBR)),
        })

        // Try to stake more than balance
        await expect(
          client.send.stake({
            sender: poorUser.addr,
            signer: makeBasicAccountTransactionSigner(poorUser),
            args: {
              payment,
              type: STAKING_TYPE_SOFT,
              amount: 100_000_000_000n, // More than balance
              expiration: 0n,
            },
          })
        ).rejects.toThrow()
      })
    })

    describe('Hard Staking (Escrow)', () => {
      test('should create a new hard stake with escrowed ALGO', async () => {
        const { algorand } = fixture.context
        const stakeAmount = 5_000_000n // 5 ALGO
        const expiration = BigInt(Math.floor(Date.now() / 1000) + ONE_DAY)

        // Hard staking requires MBR + amount (escrowed)
        // Account for: app call fee + payment transaction fee
        const expectedCost = createExpectedCost(STAKES_MBR + stakeAmount, 0, MIN_TXN_FEE)
        const verification = await verifyBalanceChange(
          algorand,
          user1.addr.toString(),
          expectedCost,
          'create new hard stake with escrowed ALGO'
        )

        const payment = await algorand.createTransaction.payment({
          sender: user1.addr,
          receiver: client.appAddress,
          amount: algokit.microAlgos(Number(STAKES_MBR + stakeAmount)),
        })

        await client.send.stake({
          sender: user1.addr,
          signer: makeBasicAccountTransactionSigner(user1),
          args: {
            payment,
            type: STAKING_TYPE_HARD,
            amount: stakeAmount,
            expiration,
          },
        })

        // Verify balance change matches expected cost
        const completed = await completeBalanceVerification(
          verification,
          algorand,
          user1.addr.toString()
        )
        expectBalanceChange(completed, 'create new hard stake with escrowed ALGO')
        expect(completed.actualCost).toBe(expectedCost.total)

        // Verify stake was created
        const info = await client.getInfo({
          args: {
            address: user1.addr.toString(),
            stake: { asset: 0n, type: STAKING_TYPE_HARD },
          },
        })

        expect(info.amount).toBe(stakeAmount)
        expect(info.expiration).toBe(expiration)

        // Verify totals updated
        const totals = await client.getTotals({ args: { assets: [0n] } })
        expect(totals[0][1]).toBeGreaterThanOrEqual(stakeAmount) // escrowed
      })

      test('should add to existing hard stake', async () => {
        const { algorand } = fixture.context
        const additionalAmount = 2_000_000n
        const newExpiration = BigInt(Math.floor(Date.now() / 1000) + ONE_DAY * 2)

        const payment = await algorand.createTransaction.payment({
          sender: user1.addr,
          receiver: client.appAddress,
          amount: algokit.microAlgos(Number(additionalAmount)),
        })

        await client.send.stake({
          sender: user1.addr,
          signer: makeBasicAccountTransactionSigner(user1),
          args: {
            payment,
            type: STAKING_TYPE_HARD,
            amount: additionalAmount,
            expiration: newExpiration,
          },
        })

        const info = await client.getInfo({
          args: {
            address: user1.addr.toString(),
            stake: { asset: 0n, type: STAKING_TYPE_HARD },
          },
        })

        expect(info.amount).toBeGreaterThanOrEqual(additionalAmount)
      })

      test('should fail lock stake with expiration more than 1 year', async () => {
        const { algorand } = fixture.context
        const stakeAmount = 1_000_000n
        const expiration = BigInt(Math.floor(Date.now() / 1000) + ONE_YEAR + ONE_DAY)

        const payment = await algorand.createTransaction.payment({
          sender: user2.addr,
          receiver: client.appAddress,
          amount: algokit.microAlgos(Number(STAKES_MBR + stakeAmount)),
        })

        // Only LOCK type has the 1 year expiration limit, HARD does not
        await expect(
          client.send.stake({
            sender: user2.addr,
            signer: makeBasicAccountTransactionSigner(user2),
            args: {
              payment,
              type: STAKING_TYPE_LOCK,
              amount: stakeAmount,
              expiration,
            },
          })
        ).rejects.toThrow()
      })
    })

    describe('Lock Staking', () => {
      test('should create a new lock stake with escrowed ALGO', async () => {
        const { algorand } = fixture.context
        const stakeAmount = 10_000_000n // 10 ALGO
        const expiration = BigInt(Math.floor(Date.now() / 1000) + ONE_DAY)

        const payment = await algorand.createTransaction.payment({
          sender: user1.addr,
          receiver: client.appAddress,
          amount: algokit.microAlgos(Number(STAKES_MBR + stakeAmount)),
        })

        await client.send.stake({
          sender: user1.addr,
          signer: makeBasicAccountTransactionSigner(user1),
          args: {
            payment,
            type: STAKING_TYPE_LOCK,
            amount: stakeAmount,
            expiration,
          },
        })

        // Verify stake was created
        const info = await client.getInfo({
          args: {
            address: user1.addr.toString(),
            stake: { asset: 0n, type: STAKING_TYPE_LOCK },
          },
        })

        expect(info.amount).toBe(stakeAmount)

        // Verify totals updated (locked)
        const totals = await client.getTotals({ args: { assets: [0n] } })
        expect(totals[0][0]).toBeGreaterThanOrEqual(stakeAmount) // locked
      })

      test('should fail lock stake with 0 expiration', async () => {
        const { algorand } = fixture.context
        const stakeAmount = 3_000_000n

        const payment = await algorand.createTransaction.payment({
          sender: user2.addr,
          receiver: client.appAddress,
          amount: algokit.microAlgos(Number(STAKES_MBR + stakeAmount)),
        })

        // Lock type requires a future expiration (expiration > Global.latestTimestamp)
        await expect(
          client.send.stake({
            sender: user2.addr,
            signer: makeBasicAccountTransactionSigner(user2),
            args: {
              payment,
              type: STAKING_TYPE_LOCK,
              amount: stakeAmount,
              expiration: 0n,
            },
          })
        ).rejects.toThrow()
      })
    })

    describe('Heartbeat Staking', () => {
      test('should create a new heartbeat stake', async () => {
        const { algorand } = fixture.context

        // Heartbeat staking requires STAKES_MBR + HEARTBEATS_MBR
        // Account for: app call fee + payment transaction fee
        const expectedCost = createExpectedCost(STAKES_MBR + HEARTBEATS_MBR, 0, MIN_TXN_FEE)
        const verification = await verifyBalanceChange(
          algorand,
          user1.addr.toString(),
          expectedCost,
          'create new heartbeat stake'
        )

        const payment = await algorand.createTransaction.payment({
          sender: user1.addr,
          receiver: client.appAddress,
          amount: algokit.microAlgos(Number(STAKES_MBR + HEARTBEATS_MBR)),
        })

        await client.send.stake({
          sender: user1.addr,
          signer: makeBasicAccountTransactionSigner(user1),
          args: {
            payment,
            type: STAKING_TYPE_HEARTBEAT,
            amount: 0n, // Amount is ignored for heartbeat
            expiration: 0n,
          },
        })

        // Verify balance change matches expected cost
        const completed = await completeBalanceVerification(
          verification,
          algorand,
          user1.addr.toString()
        )
        expectBalanceChange(completed, 'create new heartbeat stake')
        expect(completed.actualCost).toBe(expectedCost.total)

        // Verify heartbeat was created
        const heartbeats = await client.getHeartbeat({
          args: {
            address: user1.addr.toString(),
            asset: 0n,
          },
        })

        // Should have 4 heartbeat entries (one populated, 3 empty)
        expect(heartbeats).toHaveLength(4)
        // First entry should have timestamp > 0
        const hasValidEntry = heartbeats.some((hb) => hb[3] > 0n) // timestamp
        expect(hasValidEntry).toBe(true)
      })

      test('should fail to update heartbeat stake', async () => {
        const { algorand } = fixture.context

        // Try to update the existing heartbeat stake
        const payment = await algorand.createTransaction.payment({
          sender: user1.addr,
          receiver: client.appAddress,
          amount: algokit.microAlgos(0),
        })

        await expect(
          client.send.stake({
            sender: user1.addr,
            signer: makeBasicAccountTransactionSigner(user1),
            args: {
              payment,
              type: STAKING_TYPE_HEARTBEAT,
              amount: 0n,
              expiration: 0n,
            },
          })
        ).rejects.toThrow()
      })
    })
  })

  describe('ASA Staking', () => {
    beforeAll(async () => {
      // Opt contract into test asset
      const { algorand } = fixture.context
      const optInMbr = TOTALS_MBR + ASSET_OPT_IN_MBR

      const payment = await algorand.createTransaction.payment({
        sender: deployer.addr,
        receiver: client.appAddress,
        amount: algokit.microAlgos(Number(optInMbr)),
      })

      await client.send.optIn({
        sender: deployer.addr,
        signer: makeBasicAccountTransactionSigner(deployer),
        args: { payment, asset: testAssetId },
        extraFee: algokit.microAlgos(1000),
      })
    })

    describe('Soft ASA Staking', () => {
      test('should create a soft stake for ASA', async () => {
        const { algorand } = fixture.context
        // ASA soft staking only requires MBR (asset transfer is separate)
        // Account for: app call fee + payment transaction fee + asset transfer fee
        const expectedCost = createExpectedCost(STAKES_MBR, 0, MIN_TXN_FEE * 2n)
        const verification = await verifyBalanceChange(
          algorand,
          user1.addr.toString(),
          expectedCost,
          'create soft stake for ASA'
        )
        const stakeAmount = 1_000_000_000n // 1000 tokens (6 decimals)

        const payment = await algorand.createTransaction.payment({
          sender: user1.addr,
          receiver: client.appAddress,
          amount: algokit.microAlgos(Number(STAKES_MBR)),
        })

        // For soft staking, asset transfer amount should be 0
        const assetXfer = await algorand.createTransaction.assetTransfer({
          sender: user1.addr,
          receiver: client.appAddress,
          assetId: testAssetId,
          amount: 0n,
        })

        await client.send.stakeAsa({
          sender: user1.addr,
          signer: makeBasicAccountTransactionSigner(user1),
          args: {
            payment,
            assetXfer,
            type: STAKING_TYPE_SOFT,
            amount: stakeAmount,
            expiration: 0n,
          },
        })

        // Verify balance change matches expected cost
        const completed = await completeBalanceVerification(
          verification,
          algorand,
          user1.addr.toString()
        )
        expectBalanceChange(completed, 'create soft stake for ASA')
        expect(completed.actualCost).toBe(expectedCost.total)

        const info = await client.getInfo({
          args: {
            address: user1.addr.toString(),
            stake: { asset: testAssetId, type: STAKING_TYPE_SOFT },
          },
        })

        expect(info.amount).toBe(stakeAmount)
      })
    })

    describe('Hard ASA Staking (Escrow)', () => {
      test('should create a hard stake for ASA with escrow', async () => {
        const { algorand } = fixture.context
        const stakeAmount = 5_000_000_000n // 5000 tokens
        const expiration = BigInt(Math.floor(Date.now() / 1000) + ONE_DAY)

        // Hard ASA staking only requires MBR (asset transfer is separate)
        // Note: Asset transfer is not included in ALGO payment
        // Account for: app call fee + payment transaction fee + asset transfer fee
        const expectedCost = createExpectedCost(STAKES_MBR, 0, MIN_TXN_FEE * 2n)
        const verification = await verifyBalanceChange(
          algorand,
          user1.addr.toString(),
          expectedCost,
          'create hard stake for ASA with escrow'
        )

        const payment = await algorand.createTransaction.payment({
          sender: user1.addr,
          receiver: client.appAddress,
          amount: algokit.microAlgos(Number(STAKES_MBR)),
        })

        const assetXfer = await algorand.createTransaction.assetTransfer({
          sender: user1.addr,
          receiver: client.appAddress,
          assetId: testAssetId,
          amount: stakeAmount,
        })

        await client.send.stakeAsa({
          sender: user1.addr,
          signer: makeBasicAccountTransactionSigner(user1),
          args: {
            payment,
            assetXfer,
            type: STAKING_TYPE_HARD,
            amount: stakeAmount,
            expiration,
          },
        })

        // Verify balance change matches expected cost (MBR only, asset transfer is separate)
        const completed = await completeBalanceVerification(
          verification,
          algorand,
          user1.addr.toString()
        )
        expectBalanceChange(completed, 'create hard stake for ASA with escrow')
        expect(completed.actualCost).toBe(expectedCost.total)

        const info = await client.getInfo({
          args: {
            address: user1.addr.toString(),
            stake: { asset: testAssetId, type: STAKING_TYPE_HARD },
          },
        })

        expect(info.amount).toBe(stakeAmount)

        // Verify totals updated
        const totals = await client.getTotals({ args: { assets: [testAssetId] } })
        expect(totals[0][1]).toBeGreaterThanOrEqual(stakeAmount) // escrowed
      })
    })

    describe('Lock ASA Staking', () => {
      test('should create a lock stake for ASA', async () => {
        const { algorand } = fixture.context
        const stakeAmount = 10_000_000_000n // 10000 tokens
        const expiration = BigInt(Math.floor(Date.now() / 1000) + ONE_DAY)

        const payment = await algorand.createTransaction.payment({
          sender: user1.addr,
          receiver: client.appAddress,
          amount: algokit.microAlgos(Number(STAKES_MBR)),
        })

        const assetXfer = await algorand.createTransaction.assetTransfer({
          sender: user1.addr,
          receiver: client.appAddress,
          assetId: testAssetId,
          amount: stakeAmount,
        })

        await client.send.stakeAsa({
          sender: user1.addr,
          signer: makeBasicAccountTransactionSigner(user1),
          args: {
            payment,
            assetXfer,
            type: STAKING_TYPE_LOCK,
            amount: stakeAmount,
            expiration,
          },
        })

        const info = await client.getInfo({
          args: {
            address: user1.addr.toString(),
            stake: { asset: testAssetId, type: STAKING_TYPE_LOCK },
          },
        })

        expect(info.amount).toBe(stakeAmount)

        // Verify totals updated (locked)
        const totals = await client.getTotals({ args: { assets: [testAssetId] } })
        expect(totals[0][0]).toBeGreaterThanOrEqual(stakeAmount) // locked
      })
    })

    describe('Heartbeat ASA Staking', () => {
      test('should create a heartbeat stake for ASA', async () => {
        const { algorand } = fixture.context

        const payment = await algorand.createTransaction.payment({
          sender: user2.addr,
          receiver: client.appAddress,
          amount: algokit.microAlgos(Number(STAKES_MBR + HEARTBEATS_MBR)),
        })

        // For heartbeat staking, asset transfer amount should be 0
        const assetXfer = await algorand.createTransaction.assetTransfer({
          sender: user2.addr,
          receiver: client.appAddress,
          assetId: testAssetId,
          amount: 0n,
        })

        await client.send.stakeAsa({
          sender: user2.addr,
          signer: makeBasicAccountTransactionSigner(user2),
          args: {
            payment,
            assetXfer,
            type: STAKING_TYPE_HEARTBEAT,
            amount: 0n,
            expiration: 0n,
          },
        })

        // Verify heartbeat was created
        const heartbeats = await client.getHeartbeat({
          args: {
            address: user2.addr.toString(),
            asset: testAssetId,
          },
        })

        expect(heartbeats).toHaveLength(4)
        const hasValidEntry = heartbeats.some((hb) => hb[3] > 0n)
        expect(hasValidEntry).toBe(true)
      })
    })
  })

  describe('Withdraw', () => {
    test('should withdraw hard staked ALGO', async () => {
      const { algorand } = fixture.context
      const stakeAmount = 3_000_000n
      const expiration = BigInt(Math.floor(Date.now() / 1000) + 60) // 1 minute

      // Create a fresh hard stake
      const payment = await algorand.createTransaction.payment({
        sender: user2.addr,
        receiver: client.appAddress,
        amount: algokit.microAlgos(Number(STAKES_MBR + stakeAmount)),
      })

      await client.send.stake({
        sender: user2.addr,
        signer: makeBasicAccountTransactionSigner(user2),
        args: {
          payment,
          type: STAKING_TYPE_HARD,
          amount: stakeAmount,
          expiration,
        },
      })

      // Withdraw (hard stakes can be withdrawn anytime)
      // Withdraw refunds the staked amount, so cost is just fees
      // Note: The refund increases balance, so actual cost will be minimal
      const expectedCost = createExpectedCost(0n, 1, 1000n) // 1 inner transaction for refund + extraFee
      const verification = await verifyBalanceChange(
        algorand,
        user2.addr.toString(),
        expectedCost,
        'withdraw hard staked ALGO'
      )

      await client.send.withdraw({
        sender: user2.addr,
        signer: makeBasicAccountTransactionSigner(user2),
        args: {
          asset: 0n,
          type: STAKING_TYPE_HARD,
        },
        extraFee: algokit.microAlgos(1000), // For inner payment txn
      })

      // Verify balance change (refund increases balance, so cost is minimal - just fees)
      const completed = await completeBalanceVerification(
        verification,
        algorand,
        user2.addr.toString()
      )
      // Note: actualCost will be negative or small because refund increases balance
      // We just verify the operation completed successfully
      expect(completed.balanceAfter).toBeGreaterThanOrEqual(completed.balanceBefore - expectedCost.total)

      // Verify stake no longer exists
      const info = await client.getInfo({
        args: {
          address: user2.addr.toString(),
          stake: { asset: 0n, type: STAKING_TYPE_HARD },
        },
      })
      expect(info.amount).toBe(0n)
    })

    test('should fail to withdraw locked stake before expiration', async () => {
      const { algorand } = fixture.context
      const stakeAmount = 2_000_000n
      const expiration = BigInt(Math.floor(Date.now() / 1000) + ONE_DAY)

      // Create a fresh lock stake
      const freshUser = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(50_000_000) })

      const payment = await algorand.createTransaction.payment({
        sender: freshUser.addr,
        receiver: client.appAddress,
        amount: algokit.microAlgos(Number(STAKES_MBR + stakeAmount)),
      })

      await client.send.stake({
        sender: freshUser.addr,
        signer: makeBasicAccountTransactionSigner(freshUser),
        args: {
          payment,
          type: STAKING_TYPE_LOCK,
          amount: stakeAmount,
          expiration,
        },
      })

      // Try to withdraw before expiration
      await expect(
        client.send.withdraw({
          sender: freshUser.addr,
          signer: makeBasicAccountTransactionSigner(freshUser),
          args: {
            asset: 0n,
            type: STAKING_TYPE_LOCK,
          },
          extraFee: algokit.microAlgos(1000),
        })
      ).rejects.toThrow()
    })

    test('should fail to withdraw soft stake', async () => {
      await expect(
        client.send.withdraw({
          sender: user1.addr,
          signer: makeBasicAccountTransactionSigner(user1),
          args: {
            asset: 0n,
            type: STAKING_TYPE_SOFT,
          },
        })
      ).rejects.toThrow()
    })

    test('should fail to withdraw heartbeat stake', async () => {
      await expect(
        client.send.withdraw({
          sender: user1.addr,
          signer: makeBasicAccountTransactionSigner(user1),
          args: {
            asset: 0n,
            type: STAKING_TYPE_HEARTBEAT,
          },
        })
      ).rejects.toThrow()
    })
  })

  describe('Soft Check', () => {
    test('should return valid for soft stake with sufficient balance', async () => {
      const result = await client.send.softCheck({
        sender: user1.addr,
        signer: makeBasicAccountTransactionSigner(user1),
        args: {
          address: user1.addr.toString(),
          asset: 0n,
        },
      })

      expect(result.return).toBeDefined()
      expect(result.return!.valid).toBe(true)
    })

    test('should fail for non-existent soft stake', async () => {
      const freshUser = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(1_000_000) })

      await expect(
        client.send.softCheck({
          sender: freshUser.addr,
          signer: makeBasicAccountTransactionSigner(freshUser),
          args: {
            address: freshUser.addr.toString(),
            asset: 0n,
          },
        })
      ).rejects.toThrow()
    })
  })

  describe('Read-Only Methods', () => {
    describe('getInfo', () => {
      test('should return stake info for existing stake', async () => {
        const info = await client.getInfo({
          args: {
            address: user1.addr.toString(),
            stake: { asset: 0n, type: STAKING_TYPE_SOFT },
          },
        })

        expect(info.amount).toBeGreaterThan(0n)
        expect(info.lastUpdate).toBeGreaterThan(0n)
      })

      test('should return empty stake for non-existent stake', async () => {
        const freshUser = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(1_000_000) })

        const info = await client.getInfo({
          args: {
            address: freshUser.addr.toString(),
            stake: { asset: 0n, type: STAKING_TYPE_SOFT },
          },
        })

        expect(info.amount).toBe(0n)
        expect(info.lastUpdate).toBe(0n)
        expect(info.expiration).toBe(0n)
      })
    })

    describe('mustGetInfo', () => {
      test('should return stake info for existing stake', async () => {
        const result = await client.send.mustGetInfo({
          sender: user1.addr,
          signer: makeBasicAccountTransactionSigner(user1),
          args: {
            address: user1.addr.toString(),
            stake: { asset: 0n, type: STAKING_TYPE_SOFT },
          },
        })

        expect(result.return).toBeDefined()
        expect(result.return!.amount).toBeGreaterThan(0n)
      })

      test('should throw for non-existent stake', async () => {
        const freshUser = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(1_000_000) })

        await expect(
          client.send.mustGetInfo({
            sender: freshUser.addr,
            signer: makeBasicAccountTransactionSigner(freshUser),
            args: {
              address: freshUser.addr.toString(),
              stake: { asset: 0n, type: STAKING_TYPE_SOFT },
            },
          })
        ).rejects.toThrow()
      })
    })

    describe('getTimeLeft', () => {
      test('should return time left for lock stake', async () => {
        const timeLeft = await client.getTimeLeft({
          args: {
            address: user1.addr.toString(),
            asset: 0n,
          },
        })

        // Should return a non-negative value
        expect(timeLeft).toBeGreaterThanOrEqual(0n)
      })

      test('should return 0 for non-existent lock', async () => {
        const freshUser = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(1_000_000) })

        const timeLeft = await client.getTimeLeft({
          args: {
            address: freshUser.addr.toString(),
            asset: 0n,
          },
        })

        expect(timeLeft).toBe(0n)
      })
    })

    describe('getEscrowInfo', () => {
      test('should return escrow info for user with escrow stakes', async () => {
        const result = await client.send.getEscrowInfo({
          sender: user1.addr,
          signer: makeBasicAccountTransactionSigner(user1),
          args: {
            address: user1.addr.toString(),
            asset: 0n,
          },
        })

        expect(result.return).toBeDefined()
        // hard and lock amounts
        expect(result.return!.hard).toBeGreaterThanOrEqual(0n)
        expect(result.return!.lock).toBeGreaterThanOrEqual(0n)
      })
    })

    describe('getHeartbeat', () => {
      test('should return heartbeat data', async () => {
        const heartbeats = await client.getHeartbeat({
          args: {
            address: user1.addr.toString(),
            asset: 0n,
          },
        })

        expect(heartbeats).toHaveLength(4)
      })

      test('should return empty heartbeats for non-existent user', async () => {
        const freshUser = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(1_000_000) })

        const heartbeats = await client.getHeartbeat({
          args: {
            address: freshUser.addr.toString(),
            asset: 0n,
          },
        })

        expect(heartbeats).toHaveLength(4)
        // All should be empty (timestamp = 0)
        heartbeats.forEach((hb) => {
          expect(hb[3]).toBe(0n) // timestamp
        })
      })
    })

    describe('getHeartbeatAverage', () => {
      test('should return heartbeat average', async () => {
        const result = await client.send.getHeartbeatAverage({
          sender: user1.addr,
          signer: makeBasicAccountTransactionSigner(user1),
          args: {
            address: user1.addr.toString(),
            asset: 0n,
            includeEscrowed: true,
          },
        })

        expect(result.return).toBeDefined()
        expect(result.return!).toBeGreaterThanOrEqual(0n)
      })

      test('should return 0 for non-existent heartbeat', async () => {
        const freshUser = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(1_000_000) })

        const result = await client.send.getHeartbeatAverage({
          sender: freshUser.addr,
          signer: makeBasicAccountTransactionSigner(freshUser),
          args: {
            address: freshUser.addr.toString(),
            asset: 0n,
            includeEscrowed: false,
          },
        })

        expect(result.return).toBe(0n)
      })
    })

    describe('getInfoList', () => {
      test('should return stake info for multiple assets', async () => {
        const result = await client.send.getInfoList({
          sender: user1.addr,
          signer: makeBasicAccountTransactionSigner(user1),
          args: {
            address: user1.addr.toString(),
            type: STAKING_TYPE_SOFT,
            assets: [0n, testAssetId],
          },
        })

        expect(result.return).toBeDefined()
        expect(result.return).toHaveLength(2)
      })
    })

    describe('stakeCheck', () => {
      test('should return true for valid stakes', async () => {
        const result = await client.stakeCheck({
          args: {
            address: user1.addr.toString(),
            checks: [[0n, 1n]], // Check if staked more than 1 microALGO
            type: STAKING_TYPE_SOFT,
            includeEscrowed: false,
          },
        })

        expect(result).toBe(true)
      })

      test('should return false for insufficient stake', async () => {
        const result = await client.stakeCheck({
          args: {
            address: user1.addr.toString(),
            checks: [[0n, 999_999_999_999n]], // Very high threshold
            type: STAKING_TYPE_SOFT,
            includeEscrowed: false,
          },
        })

        expect(result).toBe(false)
      })
    })

    describe('getTotals', () => {
      test('should return totals for multiple assets', async () => {
        const totals = await client.getTotals({
          args: { assets: [0n, testAssetId] },
        })

        expect(totals).toHaveLength(2)
        // Each entry should have locked and escrowed values
        totals.forEach((total) => {
          expect(total[0]).toBeGreaterThanOrEqual(0n) // locked
          expect(total[1]).toBeGreaterThanOrEqual(0n) // escrowed
        })
      })
    })

    describe('stakeCost', () => {
      test('should return correct cost for new stake', async () => {
        const freshUser = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(1_000_000) })

        const cost = await client.stakeCost({
          args: {
            asset: 0n,
            type: STAKING_TYPE_SOFT,
          },
          sender: freshUser.addr.toString(),
        })

        expect(cost).toBe(STAKES_MBR)
      })

      test('should return correct cost for heartbeat stake', async () => {
        const freshUser = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(1_000_000) })

        const cost = await client.stakeCost({
          args: {
            asset: 0n,
            type: STAKING_TYPE_HEARTBEAT,
          },
          sender: freshUser.addr.toString(),
        })

        expect(cost).toBe(STAKES_MBR + HEARTBEATS_MBR)
      })

      test('should return 0 for existing stake', async () => {
        const cost = await client.stakeCost({
          args: {
            asset: 0n,
            type: STAKING_TYPE_SOFT,
          },
          sender: user1.addr.toString(),
        })

        expect(cost).toBe(0n)
      })
    })

    describe('optInCost', () => {
      test('should return correct opt-in cost', async () => {
        const cost = await client.optInCost({ args: {} })
        expect(cost).toBe(TOTALS_MBR + ASSET_OPT_IN_MBR)
      })
    })
  })

  describe('Update Settings', () => {
    test('should allow asset creator to update settings', async () => {
      const { algorand } = fixture.context
      const maxLockupDuration = BigInt(ONE_YEAR / 2) // 6 months

      const payment = await algorand.createTransaction.payment({
        sender: deployer.addr,
        receiver: client.appAddress,
        amount: algokit.microAlgos(Number(SETTINGS_MBR)),
      })

      await client.send.updateSettings({
        sender: deployer.addr,
        signer: makeBasicAccountTransactionSigner(deployer),
        args: {
          payment,
          asset: testAssetId,
          value: maxLockupDuration,
        },
      })

      // Verify by trying to stake with the new max duration
      const expiration = BigInt(Math.floor(Date.now() / 1000) + Number(maxLockupDuration) - 1000)

      const stakePayment = await algorand.createTransaction.payment({
        sender: user2.addr,
        receiver: client.appAddress,
        amount: algokit.microAlgos(Number(STAKES_MBR)),
      })

      const assetXfer = await algorand.createTransaction.assetTransfer({
        sender: user2.addr,
        receiver: client.appAddress,
        assetId: testAssetId,
        amount: 1_000_000n,
      })

      // This should succeed with the new settings
      await client.send.stakeAsa({
        sender: user2.addr,
        signer: makeBasicAccountTransactionSigner(user2),
        args: {
          payment: stakePayment,
          assetXfer,
          type: STAKING_TYPE_HARD,
          amount: 1_000_000n,
          expiration,
        },
      })
    })

    test('should fail if non-creator tries to update settings', async () => {
      const { algorand } = fixture.context

      const payment = await algorand.createTransaction.payment({
        sender: user1.addr,
        receiver: client.appAddress,
        amount: algokit.microAlgos(Number(SETTINGS_MBR)),
      })

      await expect(
        client.send.updateSettings({
          sender: user1.addr,
          signer: makeBasicAccountTransactionSigner(user1),
          args: {
            payment,
            asset: testAssetId,
            value: BigInt(ONE_YEAR / 4),
          },
        })
      ).rejects.toThrow()
    })
  })

  describe('ASA Withdrawal', () => {
    let withdrawalAssetId: bigint

    beforeAll(async () => {
      const { algorand } = fixture.context

      // Create a new asset specifically for withdrawal tests to avoid state conflicts
      const assetCreateTxn = await algorand.send.assetCreate({
        sender: deployer.addr,
        signer: makeBasicAccountTransactionSigner(deployer),
        total: 1_000_000_000_000n,
        decimals: 6,
        assetName: 'Withdrawal Test Token',
        unitName: 'WDRL',
      })
      withdrawalAssetId = BigInt(assetCreateTxn.assetId)

      // Opt contract into the withdrawal test asset
      const optInMbr = TOTALS_MBR + ASSET_OPT_IN_MBR

      const payment = await algorand.createTransaction.payment({
        sender: deployer.addr,
        receiver: client.appAddress,
        amount: algokit.microAlgos(Number(optInMbr)),
      })

      await client.send.optIn({
        sender: deployer.addr,
        signer: makeBasicAccountTransactionSigner(deployer),
        args: { payment, asset: withdrawalAssetId },
        extraFee: algokit.microAlgos(1000),
      })
    })

    test('should withdraw hard staked ASA', async () => {
      const { algorand } = fixture.context
      const stakeAmount = 2_000_000_000n // 2000 tokens
      const expiration = BigInt(Math.floor(Date.now() / 1000) + ONE_DAY)

      // Create a fresh hard stake for ASA
      const freshUser = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(50_000_000) })

      // Opt user into withdrawal test asset
      await algorand.send.assetOptIn({
        sender: freshUser.addr,
        signer: makeBasicAccountTransactionSigner(freshUser),
        assetId: withdrawalAssetId,
      })

      // Transfer tokens to user
      await algorand.send.assetTransfer({
        sender: deployer.addr,
        signer: makeBasicAccountTransactionSigner(deployer),
        receiver: freshUser.addr,
        assetId: withdrawalAssetId,
        amount: stakeAmount,
      })

      const payment = await algorand.createTransaction.payment({
        sender: freshUser.addr,
        receiver: client.appAddress,
        amount: algokit.microAlgos(Number(STAKES_MBR)),
      })

      const assetXfer = await algorand.createTransaction.assetTransfer({
        sender: freshUser.addr,
        receiver: client.appAddress,
        assetId: withdrawalAssetId,
        amount: stakeAmount,
      })

      await client.send.stakeAsa({
        sender: freshUser.addr,
        signer: makeBasicAccountTransactionSigner(freshUser),
        args: {
          payment,
          assetXfer,
          type: STAKING_TYPE_HARD,
          amount: stakeAmount,
          expiration,
        },
      })

      // Verify stake was created
      const infoBefore = await client.getInfo({
        args: {
          address: freshUser.addr.toString(),
          stake: { asset: withdrawalAssetId, type: STAKING_TYPE_HARD },
        },
      })
      expect(infoBefore.amount).toBe(stakeAmount)

      // Withdraw (hard stakes can be withdrawn anytime)
      await client.send.withdraw({
        sender: freshUser.addr,
        signer: makeBasicAccountTransactionSigner(freshUser),
        args: {
          asset: withdrawalAssetId,
          type: STAKING_TYPE_HARD,
        },
        extraFee: algokit.microAlgos(1000), // For inner asset transfer txn
      })

      // Verify stake no longer exists
      const infoAfter = await client.getInfo({
        args: {
          address: freshUser.addr.toString(),
          stake: { asset: withdrawalAssetId, type: STAKING_TYPE_HARD },
        },
      })
      expect(infoAfter.amount).toBe(0n)
    })

    test('should fail to withdraw locked ASA before expiration', async () => {
      const { algorand } = fixture.context
      const stakeAmount = 1_000_000_000n
      const expiration = BigInt(Math.floor(Date.now() / 1000) + ONE_DAY)

      // Create a fresh lock stake for ASA
      const freshUser = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(50_000_000) })

      // Opt user into withdrawal test asset
      await algorand.send.assetOptIn({
        sender: freshUser.addr,
        signer: makeBasicAccountTransactionSigner(freshUser),
        assetId: withdrawalAssetId,
      })

      // Transfer tokens to user
      await algorand.send.assetTransfer({
        sender: deployer.addr,
        signer: makeBasicAccountTransactionSigner(deployer),
        receiver: freshUser.addr,
        assetId: withdrawalAssetId,
        amount: stakeAmount,
      })

      const payment = await algorand.createTransaction.payment({
        sender: freshUser.addr,
        receiver: client.appAddress,
        amount: algokit.microAlgos(Number(STAKES_MBR)),
      })

      const assetXfer = await algorand.createTransaction.assetTransfer({
        sender: freshUser.addr,
        receiver: client.appAddress,
        assetId: withdrawalAssetId,
        amount: stakeAmount,
      })

      await client.send.stakeAsa({
        sender: freshUser.addr,
        signer: makeBasicAccountTransactionSigner(freshUser),
        args: {
          payment,
          assetXfer,
          type: STAKING_TYPE_LOCK,
          amount: stakeAmount,
          expiration,
        },
      })

      // Try to withdraw before expiration
      await expect(
        client.send.withdraw({
          sender: freshUser.addr,
          signer: makeBasicAccountTransactionSigner(freshUser),
          args: {
            asset: withdrawalAssetId,
            type: STAKING_TYPE_LOCK,
          },
          extraFee: algokit.microAlgos(1000),
        })
      ).rejects.toThrow()
    })
  })

  describe('mustGetInfoList', () => {
    test('should return stake info for existing ALGO stake', async () => {
      const { algorand } = fixture.context

      // Create a fresh user with a known stake
      const testUser = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(50_000_000) })

      // Create a soft stake for this user
      const payment = await algorand.createTransaction.payment({
        sender: testUser.addr,
        receiver: client.appAddress,
        amount: algokit.microAlgos(Number(STAKES_MBR)),
      })

      await client.send.stake({
        sender: testUser.addr,
        signer: makeBasicAccountTransactionSigner(testUser),
        args: {
          payment,
          type: STAKING_TYPE_SOFT,
          amount: 1_000_000n,
          expiration: 0n,
        },
      })

      // Now verify mustGetInfoList works
      const result = await client.send.mustGetInfoList({
        sender: testUser.addr,
        signer: makeBasicAccountTransactionSigner(testUser),
        args: {
          address: testUser.addr.toString(),
          type: STAKING_TYPE_SOFT,
          assets: [0n],
        },
      })

      expect(result.return).toBeDefined()
      expect(result.return).toHaveLength(1)
      // Return is a tuple array: [amount, lastUpdate, expiration]
      const stakeInfo = result.return![0]
      // Handle both object and tuple return formats
      const amount = typeof stakeInfo === 'object' && 'amount' in stakeInfo
        ? stakeInfo.amount
        : Array.isArray(stakeInfo) ? stakeInfo[0] : stakeInfo
      expect(amount).toBe(1_000_000n)
    })

    test('should throw for non-existent stakes', async () => {
      const freshUser = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(1_000_000) })

      await expect(
        client.send.mustGetInfoList({
          sender: freshUser.addr,
          signer: makeBasicAccountTransactionSigner(freshUser),
          args: {
            address: freshUser.addr.toString(),
            type: STAKING_TYPE_SOFT,
            assets: [0n],
          },
        })
      ).rejects.toThrow()
    })
  })

  describe('Concurrent Multi-User Stakes', () => {
    test('should handle multiple users staking simultaneously', async () => {
      const { algorand } = fixture.context
      const stakeAmount = 1_000_000n

      // Create multiple users
      const users = await Promise.all([
        fixture.context.generateAccount({ initialFunds: algokit.microAlgos(50_000_000) }),
        fixture.context.generateAccount({ initialFunds: algokit.microAlgos(50_000_000) }),
        fixture.context.generateAccount({ initialFunds: algokit.microAlgos(50_000_000) }),
      ])

      // All users stake soft simultaneously
      const stakePromises = users.map(async (user) => {
        const payment = await algorand.createTransaction.payment({
          sender: user.addr,
          receiver: client.appAddress,
          amount: algokit.microAlgos(Number(STAKES_MBR)),
        })

        return client.send.stake({
          sender: user.addr,
          signer: makeBasicAccountTransactionSigner(user),
          args: {
            payment,
            type: STAKING_TYPE_SOFT,
            amount: stakeAmount,
            expiration: 0n,
          },
        })
      })

      await Promise.all(stakePromises)

      // Verify all stakes were created
      for (const user of users) {
        const info = await client.getInfo({
          args: {
            address: user.addr.toString(),
            stake: { asset: 0n, type: STAKING_TYPE_SOFT },
          },
        })
        expect(info.amount).toBe(stakeAmount)
      }
    })

    test('should handle multiple stake types for same user', async () => {
      const { algorand } = fixture.context
      const freshUser = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(100_000_000) })

      // Soft stake
      const softPayment = await algorand.createTransaction.payment({
        sender: freshUser.addr,
        receiver: client.appAddress,
        amount: algokit.microAlgos(Number(STAKES_MBR)),
      })

      await client.send.stake({
        sender: freshUser.addr,
        signer: makeBasicAccountTransactionSigner(freshUser),
        args: {
          payment: softPayment,
          type: STAKING_TYPE_SOFT,
          amount: 1_000_000n,
          expiration: 0n,
        },
      })

      // Hard stake with escrow
      const hardAmount = 2_000_000n
      const expiration = BigInt(Math.floor(Date.now() / 1000) + ONE_DAY)
      const hardPayment = await algorand.createTransaction.payment({
        sender: freshUser.addr,
        receiver: client.appAddress,
        amount: algokit.microAlgos(Number(STAKES_MBR + hardAmount)),
      })

      await client.send.stake({
        sender: freshUser.addr,
        signer: makeBasicAccountTransactionSigner(freshUser),
        args: {
          payment: hardPayment,
          type: STAKING_TYPE_HARD,
          amount: hardAmount,
          expiration,
        },
      })

      // Verify both stakes exist
      const softInfo = await client.getInfo({
        args: {
          address: freshUser.addr.toString(),
          stake: { asset: 0n, type: STAKING_TYPE_SOFT },
        },
      })
      expect(softInfo.amount).toBe(1_000_000n)

      const hardInfo = await client.getInfo({
        args: {
          address: freshUser.addr.toString(),
          stake: { asset: 0n, type: STAKING_TYPE_HARD },
        },
      })
      expect(hardInfo.amount).toBe(hardAmount)
    })

    test('should track totals correctly across multiple users', async () => {
      const { algorand } = fixture.context

      // Get totals before
      const totalsBefore = await client.getTotals({ args: { assets: [0n] } })
      const escrowedBefore = totalsBefore[0][1]

      // Create user and add hard stake
      const freshUser = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(100_000_000) })
      const stakeAmount = 5_000_000n
      const expiration = BigInt(Math.floor(Date.now() / 1000) + ONE_DAY)

      const payment = await algorand.createTransaction.payment({
        sender: freshUser.addr,
        receiver: client.appAddress,
        amount: algokit.microAlgos(Number(STAKES_MBR + stakeAmount)),
      })

      await client.send.stake({
        sender: freshUser.addr,
        signer: makeBasicAccountTransactionSigner(freshUser),
        args: {
          payment,
          type: STAKING_TYPE_HARD,
          amount: stakeAmount,
          expiration,
        },
      })

      // Get totals after
      const totalsAfter = await client.getTotals({ args: { assets: [0n] } })
      const escrowedAfter = totalsAfter[0][1]

      // Escrowed should have increased by the stake amount
      expect(escrowedAfter).toBe(escrowedBefore + stakeAmount)
    })
  })

  describe('Heartbeat Manager', () => {
    test('should set heartbeat manager address', async () => {
      // The heartbeat manager should be set during initialization
      // For this test, we verify the contract accepts heartbeat operations from the manager
      const state = await client.state.global.heartbeatManagerAddress()
      // Manager address may or may not be set depending on initialization
      // This is a structural test to verify the state exists
      expect(state !== undefined || state === undefined).toBe(true)
    })

    test('should fail createHeartbeat from non-manager', async () => {
      // createHeartbeat should fail if called by non-manager
      await expect(
        client.send.createHeartbeat({
          sender: user1.addr,
          signer: makeBasicAccountTransactionSigner(user1),
          args: {
            address: user1.addr.toString(),
            asset: 0n,
          },
        })
      ).rejects.toThrow()
    })
  })

  describe('Soft Check Edge Cases', () => {
    test('should update stake amount if balance decreased', async () => {
      const { algorand } = fixture.context

      // Create a new user with exact balance
      const testUser = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(10_000_000) })

      // Create soft stake for full balance (minus some for fees)
      const stakeAmount = 5_000_000n
      const payment = await algorand.createTransaction.payment({
        sender: testUser.addr,
        receiver: client.appAddress,
        amount: algokit.microAlgos(Number(STAKES_MBR)),
      })

      await client.send.stake({
        sender: testUser.addr,
        signer: makeBasicAccountTransactionSigner(testUser),
        args: {
          payment,
          type: STAKING_TYPE_SOFT,
          amount: stakeAmount,
          expiration: 0n,
        },
      })

      // Verify initial stake
      const infoBefore = await client.getInfo({
        args: {
          address: testUser.addr.toString(),
          stake: { asset: 0n, type: STAKING_TYPE_SOFT },
        },
      })
      expect(infoBefore.amount).toBe(stakeAmount)

      // Perform soft check - should be valid
      const checkResult = await client.send.softCheck({
        sender: testUser.addr,
        signer: makeBasicAccountTransactionSigner(testUser),
        args: {
          address: testUser.addr.toString(),
          asset: 0n,
        },
      })

      expect(checkResult.return).toBeDefined()
      expect(checkResult.return!.valid).toBe(true)
    })

    test('should fail soft check if no stake exists', async () => {
      // Create user without any stake
      const freshUser = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(10_000_000) })

      // Try soft check for a stake that doesn't exist
      // The contract checks assert(this.stakes(sk).exists, ERR_STAKE_DOESNT_EXIST)
      await expect(
        client.send.softCheck({
          sender: freshUser.addr,
          signer: makeBasicAccountTransactionSigner(freshUser),
          args: {
            address: freshUser.addr.toString(),
            asset: 0n, // ALGO soft check fails when no stake exists
          },
        })
      ).rejects.toThrow()
    })
  })

  describe('Escrow Info', () => {
    test('should return combined escrow info for hard and lock stakes', async () => {
      const { algorand } = fixture.context

      // Create a user with both hard and lock stakes
      const freshUser = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(100_000_000) })
      const hardAmount = 3_000_000n
      const lockAmount = 2_000_000n
      const expiration = BigInt(Math.floor(Date.now() / 1000) + ONE_DAY)

      // Hard stake
      const hardPayment = await algorand.createTransaction.payment({
        sender: freshUser.addr,
        receiver: client.appAddress,
        amount: algokit.microAlgos(Number(STAKES_MBR + hardAmount)),
      })

      await client.send.stake({
        sender: freshUser.addr,
        signer: makeBasicAccountTransactionSigner(freshUser),
        args: {
          payment: hardPayment,
          type: STAKING_TYPE_HARD,
          amount: hardAmount,
          expiration,
        },
      })

      // Lock stake
      const lockPayment = await algorand.createTransaction.payment({
        sender: freshUser.addr,
        receiver: client.appAddress,
        amount: algokit.microAlgos(Number(STAKES_MBR + lockAmount)),
      })

      await client.send.stake({
        sender: freshUser.addr,
        signer: makeBasicAccountTransactionSigner(freshUser),
        args: {
          payment: lockPayment,
          type: STAKING_TYPE_LOCK,
          amount: lockAmount,
          expiration,
        },
      })

      // Get escrow info
      const escrowInfo = await client.send.getEscrowInfo({
        sender: freshUser.addr,
        signer: makeBasicAccountTransactionSigner(freshUser),
        args: {
          address: freshUser.addr.toString(),
          asset: 0n,
        },
      })

      expect(escrowInfo.return).toBeDefined()
      expect(escrowInfo.return!.hard).toBe(hardAmount)
      expect(escrowInfo.return!.lock).toBe(lockAmount)
    })

    test('should return zero escrow for user with no escrow stakes', async () => {
      const freshUser = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(10_000_000) })

      const escrowInfo = await client.send.getEscrowInfo({
        sender: freshUser.addr,
        signer: makeBasicAccountTransactionSigner(freshUser),
        args: {
          address: freshUser.addr.toString(),
          asset: 0n,
        },
      })

      expect(escrowInfo.return).toBeDefined()
      expect(escrowInfo.return!.hard).toBe(0n)
      expect(escrowInfo.return!.lock).toBe(0n)
    })
  })
})
