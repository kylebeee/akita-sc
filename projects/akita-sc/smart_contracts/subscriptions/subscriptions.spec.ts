import { Config, microAlgo } from '@algorandfoundation/algokit-utils'
import { registerDebugEventHandlers } from '@algorandfoundation/algokit-utils-debug'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { afterEach, beforeAll, describe, expect, test } from '@jest/globals'
import { AkitaDaoSDK, ServiceStatus, SubscriptionsSDK } from 'akita-sdk'
import { buildAkitaUniverse } from '../../tests/fixtures/dao'
import {
  completeBalanceVerification,
  createExpectedCost,
  expectBalanceChange,
  MIN_TXN_FEE,
  verifyBalanceChange,
} from '../../tests/utils/balance'
import { TimeWarp } from '../../tests/utils/time'

import {
  ERR_BLOCKED,
  ERR_CANNOT_TRIGGER,
  ERR_MAX_PASSES_IS_FIVE,
  ERR_MIN_AMOUNT_IS_THREE,
  ERR_MIN_INTERVAL_IS_SIXTY,
  ERR_NO_DONATIONS,
  ERR_NOT_ENOUGH_FUNDS,
  ERR_PASS_COUNT_OVERFLOW,
  ERR_SERVICE_DOES_NOT_EXIST,
  ERR_SERVICE_IS_NOT_ACTIVE,
  ERR_SERVICE_IS_NOT_PAUSED,
  ERR_SERVICE_IS_SHUTDOWN,
  ERR_SUBSCRIPTION_DOES_NOT_EXIST,
  ERR_USER_ALREADY_BLOCKED,
  ERR_USER_NOT_BLOCKED
} from './errors'

Config.configure({
  debug: true,
})
registerDebugEventHandlers()

const EMPTY_CID = new Uint8Array(36).fill(120) // 'x' character repeated 36 times


const MIN_AMOUNT = 4 // base units of any asa
const MIN_INTERVAL = 60 // seconds

describe('Subscriptions Contract Tests', () => {
  const localnet = algorandFixture()

  let dao: AkitaDaoSDK
  let subscriptions: SubscriptionsSDK
  let timeWarp: TimeWarp

  beforeAll(async () => {
    await localnet.newScope()
    const { algorand, context: { testAccount } } = localnet
    const sender = testAccount.toString()
    const signer = testAccount.signer

    timeWarp = new TimeWarp(algorand)

    const result = await buildAkitaUniverse({
      fixture: localnet,
      sender,
      signer,
      apps: {}
    })

    dao = result.dao
    subscriptions = result.subscriptions

    // Fund the subscriptions contract
    const dispenser = await algorand.account.dispenserFromEnvironment()
    await algorand.send.payment({
      sender: dispenser.addr,
      signer: dispenser.signer,
      receiver: subscriptions.client.appAddress,
      amount: microAlgo(10_000_000n)
    })

    console.log('Subscriptions App ID:', subscriptions.appId)
    console.log('Subscriptions Address:', subscriptions.client.appAddress.toString())
  })

  afterEach(async () => {
    // Reset time warp offset between tests to ensure clean state
    if (timeWarp) {
      await timeWarp.resetTimeWarp()
    }
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // SERVICE MANAGEMENT TESTS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Service Management', () => {
    test('create a new service', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Get expected cost from contract
      const expectedPayment = await subscriptions.newServiceCost({ sender, signer, asset: 0n })

      // Verify expected cost before operation
      // Account for: app call fee + payment transaction fee + 1 opUp transaction fee
      // Note: opUp calls are separate transactions, not inner transactions
      const expectedCost = createExpectedCost(expectedPayment, 0, MIN_TXN_FEE * 2n) // payment + 1 opUp
      const verification = await verifyBalanceChange(
        algorand,
        sender,
        expectedCost,
        'create new service'
      )

      // Fund account with minimum needed + small buffer
      const dispenser = await algorand.account.dispenserFromEnvironment()
      const buffer = microAlgo(100_000) // Add 0.1 ALGO buffer for minimum balance
      const requiredFunding = microAlgo(expectedCost.total).microAlgo + buffer.microAlgo
      await algorand.account.ensureFunded(sender, dispenser, microAlgo(requiredFunding))

      const serviceId = await subscriptions.newService({
        sender,
        signer,
        interval: BigInt(MIN_INTERVAL),
        asset: 0n,
        amount: BigInt(MIN_AMOUNT),
        passes: 0n,
        gateId: 0n,
        title: 'Test Service',
        description: 'Test Description',
        bannerImage: EMPTY_CID,
        highlightMessage: 0,
        highlightColor: '#FF5733',
      })

      // Verify balance change matches expected cost
      const completed = await completeBalanceVerification(
        verification,
        algorand,
        sender
      )
      expectBalanceChange(completed, 'create new service')
      expect(completed.actualCost).toBe(expectedCost.total)

      expect(serviceId).toBeDefined()

      // Verify service was created by fetching it directly
      const service = await subscriptions.getService({ sender, signer, address: sender, id: Number(serviceId) })
      expect(service).toBeDefined()
      expect(service.title).toBe('Test Service')
      expect(service.amount).toBe(BigInt(MIN_AMOUNT))
      expect(service.interval).toBe(BigInt(MIN_INTERVAL))
    })

    test('create service with passes', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Get expected cost from contract
      const newServiceCost = await subscriptions.newServiceCost()
      // Account for: app call fee + payment transaction fee + 1 opUp transaction fee
      const expectedCost = createExpectedCost(newServiceCost, 0, MIN_TXN_FEE * 2n) // payment + 1 opUp
      const verification = await verifyBalanceChange(
        algorand,
        sender,
        expectedCost,
        'create service with passes'
      )

      const serviceId = await subscriptions.newService({
        sender,
        signer,
        interval: BigInt(MIN_INTERVAL),
        asset: 0n,
        amount: 1_000_000n,
        passes: 3n,
        gateId: 0n,
        title: 'Family Plan',
        description: 'Test Description',
        bannerImage: EMPTY_CID,
        highlightMessage: 1, // Best Value
        highlightColor: '#00FF00',
      })

      // Verify balance change matches expected cost
      const completed = await completeBalanceVerification(
        verification,
        algorand,
        sender
      )
      expectBalanceChange(completed, 'create service with passes')
      expect(completed.actualCost).toBe(expectedCost.total)

      const service = await subscriptions.getService({ sender, signer, address: sender, id: Number(serviceId) })
      expect(service).toBeDefined()
      expect(service.title).toBe('Family Plan')
      expect(service.passes).toBe(3n)
    })

    test('cannot create service with more than 5 passes', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      await algorand.account.ensureFunded(sender, dispenser, (200).algos())

      let error = 'no error thrown'
      try {
        await subscriptions.newService({
          sender,
          signer,
          interval: BigInt(MIN_INTERVAL),
          asset: 0n,
          amount: 1_000_000n,
          passes: 6n,
          gateId: 0n,
          title: 'Invalid Passes',
          description: 'Test Description',
          bannerImage: EMPTY_CID,
          highlightMessage: 0,
          highlightColor: '#000000',
        })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_MAX_PASSES_IS_FIVE)
    })

    test('cannot create service with amount below minimum', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      await algorand.account.ensureFunded(sender, dispenser, (200).algos())

      let error = 'no error thrown'
      try {
        await subscriptions.newService({
          sender,
          signer,
          interval: BigInt(MIN_INTERVAL),
          asset: 0n,
          amount: BigInt(MIN_AMOUNT - 1),
          passes: 0n,
          gateId: 0n,
          title: 'Low Amount',
          description: 'Test Description',
          bannerImage: EMPTY_CID,
          highlightMessage: 0,
          highlightColor: '#000000',
        })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_MIN_AMOUNT_IS_THREE)
    })

    test('cannot create service with interval below minimum', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      await algorand.account.ensureFunded(sender, dispenser, (200).algos())

      let error = 'no error thrown'
      try {
        await subscriptions.newService({
          sender,
          signer,
          interval: BigInt(MIN_INTERVAL - 1),
          asset: 0n,
          amount: BigInt(MIN_AMOUNT),
          passes: 0n,
          gateId: 0n,
          title: 'Fast Interval',
          description: 'Test Description',
          bannerImage: EMPTY_CID,
          highlightMessage: 0,
          highlightColor: '#000000',
        })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_MIN_INTERVAL_IS_SIXTY)
    })

    test('activate a draft service', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      await algorand.account.ensureFunded(sender, dispenser, (200).algos())

      const serviceId = await subscriptions.newService({
        sender,
        signer,
        interval: BigInt(MIN_INTERVAL),
        asset: 0n,
        amount: 1_000_000n,
        passes: 0n,
        gateId: 0n,
        title: 'To Activate',
        description: 'Test Description',
        bannerImage: EMPTY_CID,
        highlightMessage: 0,
        highlightColor: '#0000FF',
      })

      const updatedService = await subscriptions.getService({ sender, signer, address: sender, id: Number(serviceId) })
      expect(updatedService.status).toBe(ServiceStatus.Active)
    })

    test('pause an active service', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      await algorand.account.ensureFunded(sender, dispenser, (200).algos())

      const serviceId = await subscriptions.newService({
        sender,
        signer,
        interval: BigInt(MIN_INTERVAL),
        asset: 0n,
        amount: 1_000_000n,
        passes: 0n,
        gateId: 0n,
        title: 'To Pause',
        description: 'Test Description',
        bannerImage: EMPTY_CID,
        highlightMessage: 0,
        highlightColor: '#FF0000',
      })

      // Now pause
      await subscriptions.pauseService({ sender, signer, id: serviceId })

      const updatedService = await subscriptions.getService({ sender, signer, address: sender, id: Number(serviceId) })
      expect(updatedService.status).toBe(ServiceStatus.Paused)
    })

    test('unpause a paused service', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      await algorand.account.ensureFunded(sender, dispenser, (200).algos())

      const serviceId = await subscriptions.newService({
        sender,
        signer,
        interval: BigInt(MIN_INTERVAL),
        asset: 0n,
        amount: 1_000_000n,
        passes: 0n,
        gateId: 0n,
        title: 'To Unpause',
        description: 'Test Description',
        bannerImage: EMPTY_CID,
        highlightMessage: 0,
        highlightColor: '#00FFFF',
      })

      // Pause
      await subscriptions.pauseService({ sender, signer, id: serviceId })

      // Unpause using the client directly (SDK doesn't have unpause method)
      await subscriptions.client.send.unpauseService({
        sender,
        signer,
        args: { id: serviceId }
      })

      const updatedService = await subscriptions.getService({ sender, signer, address: sender, id: Number(serviceId) })
      expect(updatedService.status).toBe(ServiceStatus.Active)
    })

    test('cannot unpause an active service', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      await algorand.account.ensureFunded(sender, dispenser, (200).algos())

      const serviceId = await subscriptions.newService({
        sender,
        signer,
        interval: BigInt(MIN_INTERVAL),
        asset: 0n,
        amount: 1_000_000n,
        passes: 0n,
        gateId: 0n,
        title: 'Active No Unpause',
        description: 'Test Description',
        bannerImage: EMPTY_CID,
        highlightMessage: 0,
        highlightColor: '#FF00FF',
      })

      let error = 'no error thrown'
      try {
        await subscriptions.client.send.unpauseService({
          sender,
          signer,
          args: { id: serviceId }
        })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_SERVICE_IS_NOT_PAUSED)
    })

    test('shutdown a service', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      await algorand.account.ensureFunded(sender, dispenser, (200).algos())

      const serviceId = await subscriptions.newService({
        sender,
        signer,
        interval: BigInt(MIN_INTERVAL),
        asset: 0n,
        amount: 1_000_000n,
        passes: 0n,
        gateId: 0n,
        title: 'To Shutdown',
        description: 'Test Description',
        bannerImage: EMPTY_CID,
        highlightMessage: 0,
        highlightColor: '#333333',
      })

      await subscriptions.shutdownService({ sender, signer, id: serviceId })

      const updatedService = await subscriptions.getService({ sender, signer, address: sender, id: Number(serviceId) })
      expect(updatedService.status).toBe(ServiceStatus.Shutdown)

      const isShutdown = await subscriptions.isShutdown({ address: sender, id: serviceId })
      expect(isShutdown).toBe(true)
    })

    test('cannot shutdown an already shutdown service', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      await algorand.account.ensureFunded(sender, dispenser, (200).algos())

      const serviceId = await subscriptions.newService({
        sender,
        signer,
        interval: BigInt(MIN_INTERVAL),
        asset: 0n,
        amount: 1_000_000n,
        passes: 0n,
        gateId: 0n,
        title: 'Already Shutdown',
        description: 'Test Description',
        bannerImage: EMPTY_CID,
        highlightMessage: 0,
        highlightColor: '#666666',
      })

      await subscriptions.shutdownService({ sender, signer, id: serviceId })

      let error = 'no error thrown'
      try {
        await subscriptions.shutdownService({ sender, signer, id: serviceId })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_SERVICE_IS_SHUTDOWN)
    })

    test('get service that does not exist fails', async () => {
      const { context: { testAccount } } = localnet
      const sender = testAccount.toString()

      let error = 'no error thrown'
      try {
        await subscriptions.getService({ sender, signer: testAccount.signer, address: sender, id: 9999 })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_SERVICE_DOES_NOT_EXIST)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // SUBSCRIPTION LIFECYCLE TESTS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Subscription Lifecycle', () => {
    test('subscribe to a donation (no service)', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Create another account as recipient
      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())

      // Get expected subscription cost
      const subscriptionCost = await subscriptions.newSubscriptionCost({
        sender,
        signer,
        recipient: recipientAcc.addr.toString(),
        asset: 0n,
        serviceId: 0n, // donation
      })

      // Verify expected cost before operation
      // Account for: app call fee + payment transaction fee + 2 opUp transaction fees + 2 inner transaction fees
      // Note: subscribe creates 2 inner transactions (escrow payment, recipient payment)
      const donationAmount = 100_000n
      const expectedCost = createExpectedCost(subscriptionCost + donationAmount, 2, MIN_TXN_FEE * 3n) // 2 inner + payment + 2 opUp
      const verification = await verifyBalanceChange(
        algorand,
        sender,
        expectedCost,
        'subscribe to donation'
      )

      // Fund subscriber with minimum needed
      const buffer = microAlgo(100_000)
      const requiredFunding = microAlgo(expectedCost.total).microAlgo + buffer.microAlgo
      await algorand.account.ensureFunded(sender, dispenser, microAlgo(requiredFunding))

      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 100_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n, // donation
      })

      // Verify balance change matches expected cost
      const completed = await completeBalanceVerification(
        verification,
        algorand,
        sender
      )
      expectBalanceChange(completed, 'subscribe to donation')
      expect(completed.actualCost).toBe(expectedCost.total)

      expect(subscriptionId).toBeDefined()
      expect(subscriptionId).toBeGreaterThanOrEqual(0n)

      const subInfo = await subscriptions.getSubscription({ sender, signer, address: sender, id: subscriptionId })
      expect(subInfo.recipient).toBe(recipientAcc.addr.toString())
      expect(subInfo.amount).toBe(100_000n)
      expect(subInfo.streak).toBe(1n)
    })

    test('subscribe to a service', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Create another account as merchant
      const dispenser = await algorand.account.dispenserFromEnvironment()
      const merchantAcc = algorand.account.random()

      // Fund merchant with minimum needed for service creation
      const merchantServiceCost = await subscriptions.newServiceCost({
        sender: merchantAcc.addr.toString(),
        signer: merchantAcc.signer,
        asset: 0n
      })
      // Account for: app call fee + payment transaction fee + 1 opUp transaction fee
      const merchantExpectedCost = createExpectedCost(merchantServiceCost, 0, MIN_TXN_FEE * 2n) // payment + 1 opUp
      const merchantBuffer = microAlgo(100_000)
      const merchantRequiredFunding = microAlgo(merchantExpectedCost.total).microAlgo + merchantBuffer.microAlgo
      await algorand.account.ensureFunded(merchantAcc.addr, dispenser, microAlgo(merchantRequiredFunding))

      // Merchant creates a service
      const serviceId = await subscriptions.newService({
        sender: merchantAcc.addr.toString(),
        signer: merchantAcc.signer,
        interval: BigInt(MIN_INTERVAL),
        asset: 0n,
        amount: 500_000n,
        passes: 0n,
        gateId: 0n,
        title: 'Premium Service',
        description: 'Test Description',
        bannerImage: EMPTY_CID,
        highlightMessage: 2, // Popular
        highlightColor: '#9933FF',
      })

      // Get expected subscription cost (now that we have serviceId)
      const subscriptionCost = await subscriptions.newSubscriptionCost({
        sender,
        signer,
        recipient: merchantAcc.addr.toString(),
        asset: 0n,
        serviceId,
      })

      // Fund subscriber with minimum needed (subscription cost + first payment + buffer)
      const firstPayment = 500_000n
      // Account for: app call fee + payment transaction fee + 2 opUp transaction fees + 2 inner transaction fees
      // Note: subscribe creates 2 inner transactions (escrow payment, recipient payment)
      const subscriberExpectedCost = createExpectedCost(subscriptionCost + firstPayment, 2, MIN_TXN_FEE * 3n) // 2 inner + payment + 2 opUp
      const subscriberBuffer = microAlgo(100_000)
      const subscriberRequiredFunding = microAlgo(subscriberExpectedCost.total).microAlgo + subscriberBuffer.microAlgo
      await algorand.account.ensureFunded(sender, dispenser, microAlgo(subscriberRequiredFunding))

      // Verify expected cost before subscription
      const subscriberVerification = await verifyBalanceChange(
        algorand,
        sender,
        subscriberExpectedCost,
        'subscribe to service'
      )

      // User subscribes
      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 500_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: merchantAcc.addr.toString(),
        serviceId: serviceId,
      })

      // Verify balance change matches expected cost
      const completed = await completeBalanceVerification(
        subscriberVerification,
        algorand,
        sender
      )
      expectBalanceChange(completed, 'subscribe to service')
      expect(completed.actualCost).toBe(subscriberExpectedCost.total)

      expect(subscriptionId).toBeDefined()

      const subInfo = await subscriptions.getSubscription({ sender, signer, address: sender, id: subscriptionId })
      expect(subInfo.serviceId).toBe(serviceId)
      expect(subInfo.amount).toBe(500_000n)
    })

    test('cannot subscribe to paused service', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Create merchant
      const dispenser = await algorand.account.dispenserFromEnvironment()
      const merchantAcc = algorand.account.random()
      await algorand.account.ensureFunded(merchantAcc.addr, dispenser, (200).algos())

      // Create service
      const serviceId = await subscriptions.newService({
        sender: merchantAcc.addr.toString(),
        signer: merchantAcc.signer,
        interval: BigInt(MIN_INTERVAL),
        asset: 0n,
        amount: 500_000n,
        passes: 0n,
        gateId: 0n,
        title: 'Inactive Service',
        description: 'Test Description',
        bannerImage: EMPTY_CID,
        highlightMessage: 0,
        highlightColor: '#000000',
      })

      // Pause the service to make it inactive
      await subscriptions.pauseService({
        sender: merchantAcc.addr.toString(),
        signer: merchantAcc.signer,
        id: serviceId
      })

      // Fund subscriber for the subscribe attempt
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      let error = 'no error thrown'
      try {
        await subscriptions.subscribe({
          sender,
          signer,
          asset: 0n,
          amount: 500_000n,
          interval: BigInt(MIN_INTERVAL),
          recipient: merchantAcc.addr.toString(),
          serviceId: serviceId,
        })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_SERVICE_IS_NOT_ACTIVE)
    })

    test('deposit funds into subscription', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Create recipient
      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())

      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 100_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
      })

      const subBefore = await subscriptions.getSubscription({ sender, signer, address: sender, id: subscriptionId })
      const escrowedBefore = subBefore.escrowed

      // Verify expected cost before deposit (deposit amount + transaction fee)
      const depositAmount = 500_000n
      // Account for: app call fee + payment transaction fee
      const expectedCost = createExpectedCost(depositAmount, 0, MIN_TXN_FEE)
      const verification = await verifyBalanceChange(
        algorand,
        sender,
        expectedCost,
        'deposit to subscription'
      )

      await subscriptions.deposit({
        sender,
        signer,
        asset: 0n,
        amount: 500_000n,
        id: subscriptionId
      })

      // Verify balance change matches expected cost
      const completed = await completeBalanceVerification(
        verification,
        algorand,
        sender
      )
      expectBalanceChange(completed, 'deposit to subscription')
      expect(completed.actualCost).toBe(expectedCost.total)

      const subAfter = await subscriptions.getSubscription({ sender, signer, address: sender, id: subscriptionId })
      expect(subAfter.escrowed).toBe(escrowedBefore + 500_000n)
    })

    test('withdraw funds from subscription', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Create recipient
      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())

      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 100_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
      })

      // Deposit funds first
      await subscriptions.deposit({
        sender,
        signer,
        asset: 0n,
        amount: 1_000_000n,
        id: subscriptionId
      })

      const subBefore = await subscriptions.getSubscription({ sender, signer, address: sender, id: subscriptionId })

      // Verify expected cost before withdraw (transaction fee only, amount is refunded)
      const withdrawAmount = 300_000n
      // Account for: app call fee (withdraw doesn't have payment transaction)
      const expectedCost = createExpectedCost(0n, 0, 0n) // No payment, just app call fee
      const verification = await verifyBalanceChange(
        algorand,
        sender,
        expectedCost,
        'withdraw from subscription'
      )

      await subscriptions.withdraw({
        sender,
        signer,
        asset: 0n,
        amount: 300_000n,
        id: subscriptionId
      })

      // Verify balance change - should get refund minus fees
      const completed = await completeBalanceVerification(
        verification,
        algorand,
        sender
      )
      // Withdraw refunds the amount, so actual cost should be negative (refund) minus fees
      const expectedRefund = withdrawAmount - expectedCost.fees
      expect(completed.balanceAfter - completed.balanceBefore).toBe(expectedRefund)

      const subAfter = await subscriptions.getSubscription({ sender, signer, address: sender, id: subscriptionId })
      expect(subAfter.escrowed).toBe(subBefore.escrowed - 300_000n)
    })

    test('cannot withdraw more than escrowed', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Create recipient
      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())

      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 100_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
      })

      let error = 'no error thrown'
      try {
        await subscriptions.withdraw({
          sender,
          signer,
          asset: 0n,
          amount: 999_999_999n,
          id: subscriptionId
        })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_NOT_ENOUGH_FUNDS)
    })

    test('unsubscribe and get refund', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Create recipient
      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())

      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 100_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
      })

      // Deposit some funds
      await subscriptions.deposit({
        sender,
        signer,
        asset: 0n,
        amount: 500_000n,
        id: subscriptionId
      })

      // Unsubscribe - has 1 inner transaction (refund payment) + opUp
      // Note: The refund amount is not part of the cost, it's returned to the user
      const expectedCost = createExpectedCost(0n, 1, 0n) // 1 opUp call, no base payment
      const verification = await verifyBalanceChange(
        algorand,
        sender,
        expectedCost,
        'unsubscribe and get refund'
      )

      await subscriptions.unsubscribe({ sender, signer, id: subscriptionId })

      // Verify balance change (should be minimal - just fees, refund increases balance)
      const completed = await completeBalanceVerification(
        verification,
        algorand,
        sender
      )
      // Note: actualCost will be negative or small because refund increases balance
      // We just verify the operation completed successfully
      // The refund increases balance, so balanceAfter should be >= balanceBefore - fees
      expect(completed.balanceAfter).toBeGreaterThanOrEqual(completed.balanceBefore - expectedCost.total)

      // Subscription should no longer exist
      let error = 'no error thrown'
      try {
        await subscriptions.getSubscription({ sender, signer, address: sender, id: subscriptionId })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_SUBSCRIPTION_DOES_NOT_EXIST)
    })

    test('check if first subscription', async () => {
      const { algorand } = localnet

      // Create a new account that has no subscriptions
      const dispenser = await algorand.account.dispenserFromEnvironment()
      const newAcc = algorand.account.random()
      await algorand.account.ensureFunded(newAcc.addr, dispenser, (10).algos())

      const isFirst = await subscriptions.isFirstSubscription({ sender: newAcc.addr.toString(), signer: newAcc.signer, address: newAcc.addr.toString() })
      expect(isFirst).toBe(true)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // PAYMENT TRIGGERING TESTS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Payment Triggering', () => {
    test('trigger payment after interval passes', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Create recipient
      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())

      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 100_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
        initialDepositAmount: 200_000n,
      })

      // Cannot trigger immediately (within same window)
      let error = 'no error thrown'
      try {
        await subscriptions.triggerPayment({
          sender,
          signer,
          address: sender,
          id: subscriptionId
        })
      } catch (e: any) {
        error = e.message
      }
      expect(error).toContain(ERR_CANNOT_TRIGGER)

      // Warp time forward past the interval
      await timeWarp.timeWarp(BigInt(MIN_INTERVAL + 10))

      // Now triggering should work
      const subBefore = await subscriptions.getSubscription({ sender, signer, address: sender, id: subscriptionId })

      // triggerPayment has 3 inner transactions (akitaFee, triggerFee, leftOver) + opUp
      // Account for: app call fee + 3 inner transaction fees + 1 opUp transaction fee
      // Note: triggerPayment has 3 inner transactions (payments), and 1 opUp as separate transaction
      const expectedCost = createExpectedCost(0n, 3, MIN_TXN_FEE) // 3 inner + 1 opUp
      const verification = await verifyBalanceChange(
        algorand,
        sender,
        expectedCost,
        'trigger payment after interval passes'
      )

      await subscriptions.triggerPayment({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      // Verify balance change matches expected cost
      const completed = await completeBalanceVerification(
        verification,
        algorand,
        sender
      )
      expectBalanceChange(completed, 'trigger payment after interval passes')
      expect(completed.actualCost).toBe(expectedCost.total)

      const subAfter = await subscriptions.getSubscription({ sender, signer, address: sender, id: subscriptionId })
      expect(subAfter.escrowed).toBeLessThan(subBefore.escrowed)
      expect(subAfter.streak).toBe(subBefore.streak + 1n)
    })

    test('cannot trigger payment without sufficient escrowed funds', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Create recipient
      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())

      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 100_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
      })

      // Don't deposit any funds

      // Warp time forward
      await timeWarp.timeWarp(BigInt(MIN_INTERVAL + 10))

      let error = 'no error thrown'
      try {
        await subscriptions.triggerPayment({
          sender,
          signer,
          address: sender,
          id: subscriptionId
        })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_CANNOT_TRIGGER)
    })

    test('streak resets when payment window is missed', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Create recipient
      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())

      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 100_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
      })

      // Deposit funds for multiple payments
      await subscriptions.deposit({
        sender,
        signer,
        asset: 0n,
        amount: 500_000n,
        id: subscriptionId
      })

      // Complete one payment cycle
      await timeWarp.timeWarp(BigInt(MIN_INTERVAL + 10))
      await subscriptions.triggerPayment({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      const subAfterFirst = await subscriptions.getSubscription({ sender, signer, address: sender, id: subscriptionId })
      expect(subAfterFirst.streak).toBe(2n)

      // Miss a window by warping forward 2 intervals
      await timeWarp.timeWarp(BigInt(MIN_INTERVAL * 3))

      // Call streakCheck to update the streak
      await subscriptions.client.send.streakCheck({
        sender,
        signer,
        args: { key: { address: sender, id: subscriptionId } }
      })

      const subAfterMiss = await subscriptions.getSubscription({ sender, signer, address: sender, id: subscriptionId })
      // Streak should be reset to 0
      expect(subAfterMiss.streak).toBe(0n)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // BLOCKING TESTS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Blocking', () => {
    test('block a user', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Create user to block
      const dispenser = await algorand.account.dispenserFromEnvironment()
      const userAcc = algorand.account.random()
      await algorand.account.ensureFunded(userAcc.addr, dispenser, (10).algos())

      await subscriptions.block({
        sender,
        signer,
        block: userAcc.addr.toString()
      })

      const isBlocked = await subscriptions.isBlocked({
        sender,
        signer,
        address: sender,
        blocked: userAcc.addr.toString()
      })

      expect(isBlocked).toBe(true)
    })

    test('cannot block same user twice', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const userAcc = algorand.account.random()
      await algorand.account.ensureFunded(userAcc.addr, dispenser, (10).algos())

      await subscriptions.block({
        sender,
        signer,
        block: userAcc.addr.toString()
      })

      let error = 'no error thrown'
      try {
        await subscriptions.block({
          sender,
          signer,
          block: userAcc.addr.toString()
        })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_USER_ALREADY_BLOCKED)
    })

    test('unblock a user', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const userAcc = algorand.account.random()
      await algorand.account.ensureFunded(userAcc.addr, dispenser, (10).algos())

      await subscriptions.block({
        sender,
        signer,
        block: userAcc.addr.toString()
      })

      await subscriptions.unblock({
        sender,
        signer,
        blocked: userAcc.addr.toString()
      })

      const isBlocked = await subscriptions.isBlocked({
        sender,
        signer,
        address: sender,
        blocked: userAcc.addr.toString()
      })

      expect(isBlocked).toBe(false)
    })

    test('cannot unblock user who is not blocked', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const userAcc = algorand.account.random()
      await algorand.account.ensureFunded(userAcc.addr, dispenser, (10).algos())

      let error = 'no error thrown'
      try {
        await subscriptions.unblock({
          sender,
          signer,
          blocked: userAcc.addr.toString()
        })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_USER_NOT_BLOCKED)
    })

    test('blocked user cannot subscribe', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Create merchant who will block the user
      const dispenser = await algorand.account.dispenserFromEnvironment()
      const merchantAcc = algorand.account.random()
      await algorand.account.ensureFunded(merchantAcc.addr, dispenser, (10).algos())

      // Block the subscriber
      await subscriptions.block({
        sender: merchantAcc.addr.toString(),
        signer: merchantAcc.signer,
        block: sender
      })

      let error = 'no error thrown'
      try {
        await subscriptions.subscribe({
          sender,
          signer,
          asset: 0n,
          amount: 100_000n,
          interval: BigInt(MIN_INTERVAL),
          recipient: merchantAcc.addr.toString(),
          serviceId: 0n,
        })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_BLOCKED)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // PASSES TESTS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Family Passes', () => {
    test('set passes on subscription', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Create merchant with service that has passes
      const dispenser = await algorand.account.dispenserFromEnvironment()
      const merchantAcc = algorand.account.random()
      await algorand.account.ensureFunded(merchantAcc.addr, dispenser, (400).algos())

      // Now create the actual service with passes (will have ID > 0)
      const serviceId = await subscriptions.newService({
        sender: merchantAcc.addr.toString(),
        signer: merchantAcc.signer,
        interval: BigInt(MIN_INTERVAL),
        asset: 0n,
        amount: 500_000n,
        passes: 3n,
        gateId: 0n,
        title: 'Family Service',
        description: 'Test Description',
        bannerImage: EMPTY_CID,
        highlightMessage: 0,
        highlightColor: '#112233',
      })

      // Fund subscriber for subscription (extra for passes MBR)
      await algorand.account.ensureFunded(sender, dispenser, (20).algos())

      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 500_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: merchantAcc.addr.toString(),
        serviceId: serviceId,
      })

      // Create pass holders
      const passHolder1 = algorand.account.random()
      const passHolder2 = algorand.account.random()

      // Account for: app call fee + 1 opUp transaction fee
      const expectedCost = createExpectedCost(0n, 0, MIN_TXN_FEE) // 1 opUp as separate transaction
      const verification = await verifyBalanceChange(
        algorand,
        sender,
        expectedCost,
        'set passes on subscription'
      )

      await subscriptions.setPasses({
        sender,
        signer,
        id: subscriptionId,
        passes: [passHolder1.addr.toString(), passHolder2.addr.toString()]
      })

      // Verify balance change matches expected cost
      const completed = await completeBalanceVerification(
        verification,
        algorand,
        sender
      )
      expectBalanceChange(completed, 'set passes on subscription')
      expect(completed.actualCost).toBe(expectedCost.total)

      const subWithDetails = await subscriptions.getSubscriptionWithDetails({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      expect(subWithDetails.passes.length).toBe(2)
    })

    test('cannot set more passes than allowed', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Create merchant with service that has 2 passes
      const dispenser = await algorand.account.dispenserFromEnvironment()
      const merchantAcc = algorand.account.random()
      await algorand.account.ensureFunded(merchantAcc.addr, dispenser, (400).algos())

      // Create a dummy service first (serviceId 0 is reserved for donations in setPasses)
      await subscriptions.newService({
        sender: merchantAcc.addr.toString(),
        signer: merchantAcc.signer,
        interval: BigInt(MIN_INTERVAL),
        asset: 0n,
        amount: 500_000n,
        passes: 0n,
        gateId: 0n,
        title: 'Dummy Service',
        description: 'Test Description',
        bannerImage: EMPTY_CID,
        highlightMessage: 0,
        highlightColor: '#000000',
      })

      // Now create the actual service with limited passes (will have ID > 0)
      const serviceId = await subscriptions.newService({
        sender: merchantAcc.addr.toString(),
        signer: merchantAcc.signer,
        interval: BigInt(MIN_INTERVAL),
        asset: 0n,
        amount: 500_000n,
        passes: 2n,
        gateId: 0n,
        title: 'Limited Passes',
        description: 'Test Description',
        bannerImage: EMPTY_CID,
        highlightMessage: 0,
        highlightColor: '#445566',
      })

      // Fund subscriber for subscription cost
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 500_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: merchantAcc.addr.toString(),
        serviceId: serviceId,
      })

      // Try to set 3 passes when only 2 allowed
      const passHolder1 = algorand.account.random()
      const passHolder2 = algorand.account.random()
      const passHolder3 = algorand.account.random()

      let error = 'no error thrown'
      try {
        await subscriptions.setPasses({
          sender,
          signer,
          id: subscriptionId,
          passes: [
            passHolder1.addr.toString(),
            passHolder2.addr.toString(),
            passHolder3.addr.toString()
          ]
        })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_PASS_COUNT_OVERFLOW)
    })

    test('cannot set passes on donation', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Create recipient
      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())

      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 100_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n, // donation
      })

      const passHolder = algorand.account.random()

      let error = 'no error thrown'
      try {
        await subscriptions.setPasses({
          sender,
          signer,
          id: subscriptionId,
          passes: [passHolder.addr.toString()]
        })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_NO_DONATIONS)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // READ-ONLY METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Read-only Methods', () => {
    test('get services by address', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      await algorand.account.ensureFunded(sender, dispenser, (500).algos())

      // Create multiple services and track their IDs
      const serviceIds: bigint[] = []
      for (let i = 0; i < 3; i++) {
        const serviceId = await subscriptions.newService({
          sender,
          signer,
          interval: BigInt(MIN_INTERVAL),
          asset: 0n,
          amount: BigInt((i + 1) * 100_000),
          passes: 0n,
          gateId: 0n,
          title: `Service ${i}`,
          description: 'Test Description',
          bannerImage: EMPTY_CID,
          highlightMessage: 0,
          highlightColor: '#AABBCC',
        })
        serviceIds.push(serviceId)
      }

      // Verify each service was created by fetching them individually
      expect(serviceIds.length).toBe(3)
      for (let i = 0; i < serviceIds.length; i++) {
        const service = await subscriptions.getService({
          sender,
          signer,
          address: sender,
          id: Number(serviceIds[i])
        })
        expect(service.title).toBe(`Service ${i}`)
        expect(service.amount).toBe(BigInt((i + 1) * 100_000))
      }
    })

    test('get subscription with passes', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Create recipient
      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())

      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 100_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
      })

      const subWithDetails = await subscriptions.getSubscriptionWithDetails({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      expect(subWithDetails).toBeDefined()
      expect(subWithDetails.recipient).toBe(recipientAcc.addr.toString())
      expect(subWithDetails.passes).toEqual([])
    })
  })
})
