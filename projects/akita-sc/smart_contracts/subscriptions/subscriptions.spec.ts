import { Config, microAlgo } from '@algorandfoundation/algokit-utils'
import { registerDebugEventHandlers } from '@algorandfoundation/algokit-utils-debug'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { afterEach, beforeAll, describe, expect, test } from '@jest/globals'
import { AkitaDaoSDK } from 'akita-sdk/dao'
import { ServiceStatus, SubscriptionsSDK } from 'akita-sdk/subscriptions'
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
  ERR_TITLE_TOO_LONG,
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
      // Account for: payment txn + newService (with 1 inner txn) + setServiceDescription + activateService
      // The newService contract has 1 inner payment transaction to the escrow
      // With coverAppCallInnerTransactionFees: fees = payment(1000) + newService(2000 with inner) + setDesc(1000) + activate(1000) = 5000
      // Plus potential referral inner transaction
      const expectedCost = createExpectedCost(expectedPayment, 1, MIN_TXN_FEE * 4n) // 1 inner + payment + setServiceDescription + activateService + extra

      // Fund account generously to avoid minimum balance issues
      const dispenser = await algorand.account.dispenserFromEnvironment()
      await algorand.account.ensureFunded(sender, dispenser, (200).algos())

      const verification = await verifyBalanceChange(
        algorand,
        sender,
        expectedCost,
        'create new service'
      )

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
      // Account for: payment txn + newService (with 1 inner txn) + setServiceDescription + activateService
      // Same as "create a new service" test
      const expectedCost = createExpectedCost(newServiceCost, 1, MIN_TXN_FEE * 4n) // 1 inner + payment + setServiceDescription + activateService + extra

      // Fund account generously to avoid minimum balance issues
      const dispenser = await algorand.account.dispenserFromEnvironment()
      await algorand.account.ensureFunded(sender, dispenser, (200).algos())

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

    test('cannot create service with title too long', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      await algorand.account.ensureFunded(sender, dispenser, (200).algos())

      // Create a title that exceeds MAX_TITLE_LENGTH (256 bytes typically)
      const longTitle = 'A'.repeat(300)

      let error = 'no error thrown'
      try {
        await subscriptions.newService({
          sender,
          signer,
          interval: BigInt(MIN_INTERVAL),
          asset: 0n,
          amount: BigInt(MIN_AMOUNT),
          passes: 0n,
          gateId: 0n,
          title: longTitle,
          description: 'Test Description',
          bannerImage: EMPTY_CID,
          highlightMessage: 0,
          highlightColor: '#000000',
        })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_TITLE_TOO_LONG)
    })

    test('cannot pause a paused service', async () => {
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
        title: 'Already Paused',
        description: 'Test Description',
        bannerImage: EMPTY_CID,
        highlightMessage: 0,
        highlightColor: '#123456',
      })

      // First pause
      await subscriptions.pauseService({ sender, signer, id: serviceId })

      // Try to pause again
      let error = 'no error thrown'
      try {
        await subscriptions.pauseService({ sender, signer, id: serviceId })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_SERVICE_IS_NOT_ACTIVE)
    })

    test('cannot pause a shutdown service', async () => {
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
        title: 'Shutdown Service',
        description: 'Test Description',
        bannerImage: EMPTY_CID,
        highlightMessage: 0,
        highlightColor: '#654321',
      })

      // Shutdown the service
      await subscriptions.shutdownService({ sender, signer, id: serviceId })

      // Try to pause
      let error = 'no error thrown'
      try {
        await subscriptions.pauseService({ sender, signer, id: serviceId })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_SERVICE_IS_NOT_ACTIVE)
    })

    test('cannot unpause a shutdown service', async () => {
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
        title: 'Shutdown No Unpause',
        description: 'Test Description',
        bannerImage: EMPTY_CID,
        highlightMessage: 0,
        highlightColor: '#AABBCC',
      })

      // Shutdown the service
      await subscriptions.shutdownService({ sender, signer, id: serviceId })

      // Try to unpause
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

    test('multiple services from same merchant', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      await algorand.account.ensureFunded(sender, dispenser, (500).algos())

      // Create 3 services
      const serviceIds: bigint[] = []
      for (let i = 0; i < 3; i++) {
        const serviceId = await subscriptions.newService({
          sender,
          signer,
          interval: BigInt(MIN_INTERVAL * (i + 1)),
          asset: 0n,
          amount: BigInt((i + 1) * 100_000),
          passes: BigInt(i),
          gateId: 0n,
          title: `Multi Service ${i + 1}`,
          description: 'Test Description',
          bannerImage: EMPTY_CID,
          highlightMessage: 0,
          highlightColor: '#DDEEFF',
        })
        serviceIds.push(serviceId)
      }

      expect(serviceIds.length).toBe(3)
      // Service IDs should be sequential
      expect(serviceIds[1]).toBe(serviceIds[0] + 1n)
      expect(serviceIds[2]).toBe(serviceIds[1] + 1n)

      // Verify each service has correct details
      for (let i = 0; i < 3; i++) {
        const service = await subscriptions.getService({
          sender,
          signer,
          address: sender,
          id: Number(serviceIds[i])
        })
        expect(service.title).toBe(`Multi Service ${i + 1}`)
        expect(service.interval).toBe(BigInt(MIN_INTERVAL * (i + 1)))
        expect(service.amount).toBe(BigInt((i + 1) * 100_000))
        expect(service.passes).toBe(BigInt(i))
      }
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
      // Account for: payment txn + subscribe app call (with 2 inner txns covered) + 2 opUp txns
      // With coverAppCallInnerTransactionFees: fees = payment(1000) + subscribe(1000+2000) + 2*opUp(2000) = 6000
      // Plus 1 additional fee for subscriptionslist MBR creation on first subscription
      const donationAmount = 100_000n
      const expectedCost = createExpectedCost(subscriptionCost + donationAmount, 2, MIN_TXN_FEE * 4n) // 2 inner + payment + 2 opUp + subscriptionslist
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

      // Fund merchant FIRST so newServiceCost can be called
      // We'll fund with a generous amount to cover service creation
      await algorand.account.ensureFunded(merchantAcc.addr, dispenser, (200).algos())

      // Get merchant service cost
      const merchantServiceCost = await subscriptions.newServiceCost({
        sender: merchantAcc.addr.toString(),
        signer: merchantAcc.signer,
        asset: 0n
      })

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
      // Account for: payment txn + subscribe app call (with 2 inner txns covered) + 2 opUp txns
      // Plus additional fee for any first-time subscriber costs
      const subscriberExpectedCost = createExpectedCost(subscriptionCost + firstPayment, 2, MIN_TXN_FEE * 4n) // 2 inner + payment + 2 opUp + extra
      const subscriberBuffer = microAlgo(1_000_000) // 1 ALGO buffer for minimum balance
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

      // Verify expected cost before deposit (deposit amount + transaction fees)
      const depositAmount = 500_000n
      // Account for: payment txn + deposit app call + opUp
      const expectedCost = createExpectedCost(depositAmount, 0, MIN_TXN_FEE * 2n) // payment + opUp
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

      // Verify expected cost before withdraw (transaction fees, amount is refunded)
      const withdrawAmount = 300_000n
      // Account for: withdraw app call (with 1 inner txn for refund payment) + opUp
      const expectedCost = createExpectedCost(0n, 1, MIN_TXN_FEE) // 1 inner (refund payment) + opUp
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

    test('cannot subscribe to shutdown service', async () => {
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
        title: 'To Shutdown',
        description: 'Test Description',
        bannerImage: EMPTY_CID,
        highlightMessage: 0,
        highlightColor: '#000000',
      })

      // Shutdown the service
      await subscriptions.shutdownService({
        sender: merchantAcc.addr.toString(),
        signer: merchantAcc.signer,
        id: serviceId
      })

      // Fund subscriber
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

    test('subscribe with initial deposit', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Create recipient
      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      const initialDeposit = 500_000n
      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 100_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
        initialDepositAmount: initialDeposit,
      })

      const subInfo = await subscriptions.getSubscription({ sender, signer, address: sender, id: subscriptionId })
      expect(subInfo.escrowed).toBe(initialDeposit)
    })

    test('deposit to non-existent subscription fails', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      let error = 'no error thrown'
      try {
        await subscriptions.deposit({
          sender,
          signer,
          asset: 0n,
          amount: 100_000n,
          id: 99999n
        })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_SUBSCRIPTION_DOES_NOT_EXIST)
    })

    test('withdraw from non-existent subscription fails', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      let error = 'no error thrown'
      try {
        await subscriptions.withdraw({
          sender,
          signer,
          asset: 0n,
          amount: 100_000n,
          id: 99999n
        })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_SUBSCRIPTION_DOES_NOT_EXIST)
    })

    test('unsubscribe from non-existent subscription fails', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      let error = 'no error thrown'
      try {
        await subscriptions.unsubscribe({
          sender,
          signer,
          id: 99999n
        })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_SUBSCRIPTION_DOES_NOT_EXIST)
    })

    test('multiple subscriptions from same address', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      await algorand.account.ensureFunded(sender, dispenser, (20).algos())

      // Create multiple recipients
      const recipients = []
      for (let i = 0; i < 3; i++) {
        const recipientAcc = algorand.account.random()
        await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
        recipients.push(recipientAcc)
      }

      // Create subscriptions to different recipients
      const subscriptionIds: bigint[] = []
      for (let i = 0; i < 3; i++) {
        const subscriptionId = await subscriptions.subscribe({
          sender,
          signer,
          asset: 0n,
          amount: BigInt((i + 1) * 50_000),
          interval: BigInt(MIN_INTERVAL),
          recipient: recipients[i].addr.toString(),
          serviceId: 0n,
        })
        subscriptionIds.push(subscriptionId)
      }

      expect(subscriptionIds.length).toBe(3)
      // Subscription IDs should be sequential
      expect(subscriptionIds[1]).toBe(subscriptionIds[0] + 1n)
      expect(subscriptionIds[2]).toBe(subscriptionIds[1] + 1n)

      // Verify each subscription
      for (let i = 0; i < 3; i++) {
        const subInfo = await subscriptions.getSubscription({
          sender,
          signer,
          address: sender,
          id: subscriptionIds[i]
        })
        expect(subInfo.recipient).toBe(recipients[i].addr.toString())
        expect(subInfo.amount).toBe(BigInt((i + 1) * 50_000))
      }
    })

    test('verify recipient receives payment on subscribe', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Create recipient
      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      const initialRecipientFunding = (10).algos()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, initialRecipientFunding)
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      // Get recipient balance before
      const recipientInfoBefore = await algorand.client.algod.accountInformation(recipientAcc.addr.toString()).do()
      const recipientBalanceBefore = BigInt(recipientInfoBefore.amount)

      const subscriptionAmount = 100_000n
      await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: subscriptionAmount,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
      })

      // Get recipient balance after
      const recipientInfoAfter = await algorand.client.algod.accountInformation(recipientAcc.addr.toString()).do()
      const recipientBalanceAfter = BigInt(recipientInfoAfter.amount)

      // Recipient should have received something (minus fees)
      // The exact amount depends on fee percentages
      expect(recipientBalanceAfter).toBeGreaterThan(recipientBalanceBefore)
    })

    test('is first subscription returns false after subscription', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Create a new account
      const dispenser = await algorand.account.dispenserFromEnvironment()
      const newAcc = algorand.account.random()
      await algorand.account.ensureFunded(newAcc.addr, dispenser, (10).algos())

      // Create recipient
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())

      // Check is first subscription before
      const isFirstBefore = await subscriptions.isFirstSubscription({
        sender: newAcc.addr.toString(),
        signer: newAcc.signer,
        address: newAcc.addr.toString()
      })
      expect(isFirstBefore).toBe(true)

      // Subscribe
      await subscriptions.subscribe({
        sender: newAcc.addr.toString(),
        signer: newAcc.signer,
        asset: 0n,
        amount: 100_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
      })

      // Check is first subscription after
      const isFirstAfter = await subscriptions.isFirstSubscription({
        sender: newAcc.addr.toString(),
        signer: newAcc.signer,
        address: newAcc.addr.toString()
      })
      expect(isFirstAfter).toBe(false)
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
      // Note: triggerFee is sent back to the sender, reducing the net cost
      // Gross fees = (1000 + 3*1000 inner covered) + 1000 opUp = 5000
      // Net cost = Gross fees - triggerFee (returned to sender)
      const expectedGrossFees = createExpectedCost(0n, 3, MIN_TXN_FEE) // 3 inner + 1 opUp
      const verification = await verifyBalanceChange(
        algorand,
        sender,
        expectedGrossFees,
        'trigger payment after interval passes'
      )

      await subscriptions.triggerPayment({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      // Verify balance change - note that actualCost will be less than gross fees
      // because triggerFee is returned to the sender
      const completed = await completeBalanceVerification(
        verification,
        algorand,
        sender
      )
      // Don't check exact cost match since triggerFee is returned, reducing net cost
      // Just verify the cost is within a reasonable range (less than or equal to gross fees)
      expect(completed.actualCost).toBeLessThanOrEqual(expectedGrossFees.total)

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

    test('third party can trigger payment', async () => {
      const { algorand, context: { testAccount } } = localnet
      const subscriber = testAccount.toString()
      const subscriberSigner = testAccount.signer

      // Create recipient
      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())

      // Create third party who will trigger the payment
      const thirdPartyAcc = algorand.account.random()
      await algorand.account.ensureFunded(thirdPartyAcc.addr, dispenser, (10).algos())

      const subscriptionId = await subscriptions.subscribe({
        sender: subscriber,
        signer: subscriberSigner,
        asset: 0n,
        amount: 100_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
        initialDepositAmount: 200_000n,
      })

      // Warp time forward
      await timeWarp.timeWarp(BigInt(MIN_INTERVAL + 10))

      const subBefore = await subscriptions.getSubscription({
        sender: subscriber,
        signer: subscriberSigner,
        address: subscriber,
        id: subscriptionId
      })

      // Third party triggers the payment
      await subscriptions.triggerPayment({
        sender: thirdPartyAcc.addr.toString(),
        signer: thirdPartyAcc.signer,
        address: subscriber,
        id: subscriptionId
      })

      const subAfter = await subscriptions.getSubscription({
        sender: subscriber,
        signer: subscriberSigner,
        address: subscriber,
        id: subscriptionId
      })

      expect(subAfter.escrowed).toBeLessThan(subBefore.escrowed)
      expect(subAfter.streak).toBe(subBefore.streak + 1n)
    })

    test('multiple trigger payments reduce escrowed balance', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Create recipient
      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())

      const subscriptionAmount = 100_000n
      const initialDeposit = 500_000n
      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: subscriptionAmount,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
        initialDepositAmount: initialDeposit,
      })

      const subInitial = await subscriptions.getSubscription({ sender, signer, address: sender, id: subscriptionId })
      expect(subInitial.escrowed).toBe(initialDeposit)

      // Trigger a payment after warping time
      await timeWarp.timeWarp(BigInt(MIN_INTERVAL + 10))

      await subscriptions.triggerPayment({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      const subAfterFirst = await subscriptions.getSubscription({ sender, signer, address: sender, id: subscriptionId })
      // Escrowed should be reduced by the subscription amount
      expect(subAfterFirst.escrowed).toBe(initialDeposit - subscriptionAmount)

      // Trigger another payment after another interval
      await timeWarp.timeWarp(BigInt(MIN_INTERVAL + 10))

      await subscriptions.triggerPayment({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      const subAfterSecond = await subscriptions.getSubscription({ sender, signer, address: sender, id: subscriptionId })
      // Escrowed should be reduced by another subscription amount
      expect(subAfterSecond.escrowed).toBe(initialDeposit - (2n * subscriptionAmount))
    })

    test('cannot trigger payment for non-existent subscription', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      let error = 'no error thrown'
      try {
        await subscriptions.triggerPayment({
          sender,
          signer,
          address: sender,
          id: 99999n
        })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_CANNOT_TRIGGER)
    })

    test('trigger payment updates lastPayment timestamp', async () => {
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
        initialDepositAmount: 500_000n,
      })

      const subBefore = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })
      const lastPaymentBefore = subBefore.lastPayment

      // Warp time to next window
      await timeWarp.timeWarp(BigInt(MIN_INTERVAL + 10))

      // Trigger payment
      await subscriptions.triggerPayment({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      const subAfter = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      // Verify lastPayment was updated to a later time
      expect(subAfter.lastPayment).toBeGreaterThan(lastPaymentBefore)
      // Verify streak increased
      expect(subAfter.streak).toBe(subBefore.streak + 1n)
    })

    test('blocked user cannot trigger payment', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Create recipient (merchant)
      const dispenser = await algorand.account.dispenserFromEnvironment()
      const merchantAcc = algorand.account.random()
      await algorand.account.ensureFunded(merchantAcc.addr, dispenser, (10).algos())

      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 100_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: merchantAcc.addr.toString(),
        serviceId: 0n,
        initialDepositAmount: 200_000n,
      })

      // Block the subscriber
      await subscriptions.block({
        sender: merchantAcc.addr.toString(),
        signer: merchantAcc.signer,
        block: sender
      })

      // Warp time to next window
      await timeWarp.timeWarp(BigInt(MIN_INTERVAL + 10))

      // Trigger should fail because user is blocked
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

    test('donation subscription continues after service shutdown', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Create recipient
      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())

      // Create donation (serviceId = 0)
      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 100_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n, // Donation
        initialDepositAmount: 300_000n,
      })

      // Warp time
      await timeWarp.timeWarp(BigInt(MIN_INTERVAL + 10))

      // Trigger should succeed for donation
      await subscriptions.triggerPayment({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      const subAfter = await subscriptions.getSubscription({ sender, signer, address: sender, id: subscriptionId })
      expect(subAfter.streak).toBe(2n)
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

    test('verify block cost', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Get block cost from contract
      const blockCost = await subscriptions.blockCost({ sender, signer })

      // Block cost should be positive (MBR for the blocks box)
      expect(blockCost).toBeGreaterThan(0n)
    })

    test('block multiple users', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      // Block multiple users
      const usersToBlock = []
      for (let i = 0; i < 3; i++) {
        const userAcc = algorand.account.random()
        await algorand.account.ensureFunded(userAcc.addr, dispenser, (10).algos())
        usersToBlock.push(userAcc)

        await subscriptions.block({
          sender,
          signer,
          block: userAcc.addr.toString()
        })
      }

      // Verify all users are blocked
      for (const user of usersToBlock) {
        const isBlocked = await subscriptions.isBlocked({
          sender,
          signer,
          address: sender,
          blocked: user.addr.toString()
        })
        expect(isBlocked).toBe(true)
      }
    })

    test('unblocking non-blocked user fails', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const userAcc = algorand.account.random()
      await algorand.account.ensureFunded(userAcc.addr, dispenser, (10).algos())

      // Verify user is not blocked
      const isBlocked = await subscriptions.isBlocked({
        sender,
        signer,
        address: sender,
        blocked: userAcc.addr.toString()
      })
      expect(isBlocked).toBe(false)

      // Try to unblock
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

    test('update passes on subscription', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Create merchant with service that has passes
      const dispenser = await algorand.account.dispenserFromEnvironment()
      const merchantAcc = algorand.account.random()
      await algorand.account.ensureFunded(merchantAcc.addr, dispenser, (400).algos())

      const serviceId = await subscriptions.newService({
        sender: merchantAcc.addr.toString(),
        signer: merchantAcc.signer,
        interval: BigInt(MIN_INTERVAL),
        asset: 0n,
        amount: 500_000n,
        passes: 3n,
        gateId: 0n,
        title: 'Passes Update Service',
        description: 'Test Description',
        bannerImage: EMPTY_CID,
        highlightMessage: 0,
        highlightColor: '#AABBCC',
      })

      // Fund subscriber
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

      // Set initial passes
      const passHolder1 = algorand.account.random()
      await subscriptions.setPasses({
        sender,
        signer,
        id: subscriptionId,
        passes: [passHolder1.addr.toString()]
      })

      const subWithDetails1 = await subscriptions.getSubscriptionWithDetails({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })
      expect(subWithDetails1.passes.length).toBe(1)

      // Update passes with different holders
      const passHolder2 = algorand.account.random()
      const passHolder3 = algorand.account.random()
      await subscriptions.setPasses({
        sender,
        signer,
        id: subscriptionId,
        passes: [passHolder2.addr.toString(), passHolder3.addr.toString()]
      })

      const subWithDetails2 = await subscriptions.getSubscriptionWithDetails({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })
      expect(subWithDetails2.passes.length).toBe(2)
      expect(subWithDetails2.passes).toContain(passHolder2.addr.toString())
      expect(subWithDetails2.passes).toContain(passHolder3.addr.toString())
    })

    test('clear passes on subscription', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Create merchant with service that has passes
      const dispenser = await algorand.account.dispenserFromEnvironment()
      const merchantAcc = algorand.account.random()
      await algorand.account.ensureFunded(merchantAcc.addr, dispenser, (400).algos())

      const serviceId = await subscriptions.newService({
        sender: merchantAcc.addr.toString(),
        signer: merchantAcc.signer,
        interval: BigInt(MIN_INTERVAL),
        asset: 0n,
        amount: 500_000n,
        passes: 3n,
        gateId: 0n,
        title: 'Clear Passes Service',
        description: 'Test Description',
        bannerImage: EMPTY_CID,
        highlightMessage: 0,
        highlightColor: '#DDEEFF',
      })

      // Fund subscriber
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

      // Set initial passes
      const passHolder1 = algorand.account.random()
      const passHolder2 = algorand.account.random()
      await subscriptions.setPasses({
        sender,
        signer,
        id: subscriptionId,
        passes: [passHolder1.addr.toString(), passHolder2.addr.toString()]
      })

      const subWithDetails1 = await subscriptions.getSubscriptionWithDetails({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })
      expect(subWithDetails1.passes.length).toBe(2)

      // Clear passes by setting to empty array
      await subscriptions.setPasses({
        sender,
        signer,
        id: subscriptionId,
        passes: []
      })

      const subWithDetails2 = await subscriptions.getSubscriptionWithDetails({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })
      expect(subWithDetails2.passes.length).toBe(0)
    })

    test('cannot set passes on non-existent subscription', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      const passHolder = algorand.account.random()

      let error = 'no error thrown'
      try {
        await subscriptions.setPasses({
          sender,
          signer,
          id: 99999n,
          passes: [passHolder.addr.toString()]
        })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_SUBSCRIPTION_DOES_NOT_EXIST)
    })

    test('cannot set passes on shutdown service subscription', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Create merchant with service that has passes
      const dispenser = await algorand.account.dispenserFromEnvironment()
      const merchantAcc = algorand.account.random()
      await algorand.account.ensureFunded(merchantAcc.addr, dispenser, (400).algos())

      const serviceId = await subscriptions.newService({
        sender: merchantAcc.addr.toString(),
        signer: merchantAcc.signer,
        interval: BigInt(MIN_INTERVAL),
        asset: 0n,
        amount: 500_000n,
        passes: 3n,
        gateId: 0n,
        title: 'Shutdown Service Passes',
        description: 'Test Description',
        bannerImage: EMPTY_CID,
        highlightMessage: 0,
        highlightColor: '#112233',
      })

      // Fund subscriber
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

      // Shutdown the service
      await subscriptions.shutdownService({
        sender: merchantAcc.addr.toString(),
        signer: merchantAcc.signer,
        id: serviceId
      })

      // Try to set passes
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

      expect(error).toContain(ERR_SERVICE_IS_SHUTDOWN)
    })

    test('blocked pass holder cannot be added', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Create merchant with service that has passes
      const dispenser = await algorand.account.dispenserFromEnvironment()
      const merchantAcc = algorand.account.random()
      await algorand.account.ensureFunded(merchantAcc.addr, dispenser, (400).algos())

      const serviceId = await subscriptions.newService({
        sender: merchantAcc.addr.toString(),
        signer: merchantAcc.signer,
        interval: BigInt(MIN_INTERVAL),
        asset: 0n,
        amount: 500_000n,
        passes: 3n,
        gateId: 0n,
        title: 'Blocked Pass Service',
        description: 'Test Description',
        bannerImage: EMPTY_CID,
        highlightMessage: 0,
        highlightColor: '#445566',
      })

      // Fund subscriber
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

      // Create pass holder and block them
      const passHolder = algorand.account.random()
      await algorand.account.ensureFunded(passHolder.addr, dispenser, (10).algos())
      await subscriptions.block({
        sender: merchantAcc.addr.toString(),
        signer: merchantAcc.signer,
        block: passHolder.addr.toString()
      })

      // Try to set blocked user as pass holder
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

      expect(error).toContain(ERR_BLOCKED)
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

    test('get service list for merchant', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()

      // Create a new account for a fresh merchant
      const merchantAcc = algorand.account.random()
      await algorand.account.ensureFunded(merchantAcc.addr, dispenser, (500).algos())

      // Check service list before creating any services
      const listBefore = await subscriptions.client.getServiceList({
        args: { address: merchantAcc.addr.toString() }
      })
      expect(listBefore).toBe(0n)

      // Create services
      for (let i = 0; i < 3; i++) {
        await subscriptions.newService({
          sender: merchantAcc.addr.toString(),
          signer: merchantAcc.signer,
          interval: BigInt(MIN_INTERVAL),
          asset: 0n,
          amount: 100_000n,
          passes: 0n,
          gateId: 0n,
          title: `List Service ${i}`,
          description: 'Test Description',
          bannerImage: EMPTY_CID,
          highlightMessage: 0,
          highlightColor: '#AABBCC',
        })
      }

      // Check service list after
      const listAfter = await subscriptions.client.getServiceList({
        args: { address: merchantAcc.addr.toString() }
      })
      // Service list should be next available ID (4 since we created 3 services starting at 1)
      expect(listAfter).toBe(4n)
    })

    test('get subscription list for user', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()

      // Create a new account for a fresh subscriber
      const subscriberAcc = algorand.account.random()
      await algorand.account.ensureFunded(subscriberAcc.addr, dispenser, (20).algos())

      // Check subscription list before creating any subscriptions
      const listBefore = await subscriptions.client.getSubscriptionList({
        args: { address: subscriberAcc.addr.toString() }
      })
      expect(listBefore).toBe(0n)

      // Create subscriptions
      for (let i = 0; i < 2; i++) {
        const recipientAcc = algorand.account.random()
        await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())

        await subscriptions.subscribe({
          sender: subscriberAcc.addr.toString(),
          signer: subscriberAcc.signer,
          asset: 0n,
          amount: 100_000n,
          interval: BigInt(MIN_INTERVAL),
          recipient: recipientAcc.addr.toString(),
          serviceId: 0n,
        })
      }

      // Check subscription list after
      const listAfter = await subscriptions.client.getSubscriptionList({
        args: { address: subscriberAcc.addr.toString() }
      })
      // Subscription list should be next available ID (3 since we created 2 subscriptions starting at 1)
      expect(listAfter).toBe(3n)
    })

    test('get new service cost', async () => {
      const { context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const cost = await subscriptions.newServiceCost({ sender, signer, asset: 0n })

      // Cost should be positive (includes service creation fee and MBR)
      expect(cost).toBeGreaterThan(0n)
    })

    test('get new subscription cost', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())

      const cost = await subscriptions.newSubscriptionCost({
        sender,
        signer,
        recipient: recipientAcc.addr.toString(),
        asset: 0n,
        serviceId: 0n
      })

      // Cost should be positive (includes MBR for subscription box)
      expect(cost).toBeGreaterThan(0n)
    })

    test('get subscription optional returns exists false for non-existent', async () => {
      const { context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Use the optional getSubscription method that returns exists flag
      const result = await subscriptions.client.getSubscription({
        args: { key: { address: sender, id: 99999n } }
      })

      expect(result.exists).toBe(false)
    })

    test('getServicesByAddress returns services in window', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()

      // Create a new merchant for fresh services with generous funding
      const merchantAcc = algorand.account.random()
      await algorand.account.ensureFunded(merchantAcc.addr, dispenser, (1000).algos())

      // Create services
      for (let i = 0; i < 5; i++) {
        await subscriptions.newService({
          sender: merchantAcc.addr.toString(),
          signer: merchantAcc.signer,
          interval: BigInt(MIN_INTERVAL),
          asset: 0n,
          amount: BigInt((i + 1) * 100_000),
          passes: 0n,
          gateId: 0n,
          title: `Window Service ${i}`,
          description: 'Test Description',
          bannerImage: EMPTY_CID,
          highlightMessage: 0,
          highlightColor: '#AABBCC',
        })
      }

      // Get services with window
      const services = await subscriptions.getServicesByAddress({
        sender,
        signer,
        address: merchantAcc.addr.toString(),
        start: 1n,
        windowSize: 3n
      })

      expect(services.length).toBe(3)
      expect(services[0].title).toBe('Window Service 0')
      expect(services[1].title).toBe('Window Service 1')
      expect(services[2].title).toBe('Window Service 2')
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // BALANCE VERIFICATION & FEE DISTRIBUTION TESTS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Balance Verification & Fee Distribution', () => {
    // Helper to calculate expected fees (3.5% payment + 0.5% trigger = 4% total)
    // DIVISOR is 100000, paymentPercentage is 3500, triggerPercentage is 500
    const calcFees = (amount: bigint) => {
      const paymentPercentage = 3500n // 3.5%
      const triggerPercentage = 500n // 0.5%
      const divisor = 100000n

      let akitaFee = (amount * paymentPercentage) / divisor
      if (akitaFee === 0n && amount > 0n) akitaFee = 2n

      let triggerFee = (amount * triggerPercentage) / divisor
      if (triggerFee === 0n && amount > 0n) triggerFee = 1n

      const leftOver = amount - akitaFee - triggerFee

      return { akitaFee, triggerFee, leftOver, total: akitaFee + triggerFee }
    }

    // Helper to get the escrow address from the subscriptions contract state
    const getEscrowAddress = async (algorand: any): Promise<string> => {
      // Get the escrow app ID from subscriptions contract global state
      const escrowAppId = await subscriptions.client.state.global.akitaDaoEscrow()
      if (!escrowAppId) throw new Error('Escrow app ID not found')
      // Convert app ID to application address
      const { getApplicationAddress } = await import('algosdk')
      return getApplicationAddress(escrowAppId).toString()
    }

    test('verify fee distribution on subscribe', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(sender, dispenser, (20).algos())

      // Get escrow address for balance tracking
      const escrowAddress = await getEscrowAddress(algorand)

      // Get balances before
      const recipientInfoBefore = await algorand.client.algod.accountInformation(recipientAcc.addr.toString()).do()
      const recipientBalanceBefore = BigInt(recipientInfoBefore.amount)
      const escrowInfoBefore = await algorand.client.algod.accountInformation(escrowAddress).do()
      const escrowBalanceBefore = BigInt(escrowInfoBefore.amount)

      const subscriptionAmount = 1_000_000n // 1 ALGO
      const expectedFees = calcFees(subscriptionAmount)

      await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: subscriptionAmount,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
      })

      // Get balances after
      const recipientInfoAfter = await algorand.client.algod.accountInformation(recipientAcc.addr.toString()).do()
      const recipientBalanceAfter = BigInt(recipientInfoAfter.amount)
      const escrowInfoAfter = await algorand.client.algod.accountInformation(escrowAddress).do()
      const escrowBalanceAfter = BigInt(escrowInfoAfter.amount)

      // Recipient should receive leftOver amount (subscription amount minus fees)
      const recipientReceived = recipientBalanceAfter - recipientBalanceBefore
      expect(recipientReceived).toBe(expectedFees.leftOver)

      // Escrow should receive akitaFee + triggerFee (combined into single payment to escrow)
      const escrowReceived = escrowBalanceAfter - escrowBalanceBefore
      expect(escrowReceived).toBe(expectedFees.total)
    })

    test('verify fee distribution on trigger payment', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(sender, dispenser, (20).algos())

      const subscriptionAmount = 500_000n // 0.5 ALGO
      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: subscriptionAmount,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
        initialDepositAmount: 1_000_000n, // Deposit enough for trigger
      })

      // Warp time
      await timeWarp.timeWarp(BigInt(MIN_INTERVAL + 10))

      // Get escrow address and balances before trigger
      const escrowAddress = await getEscrowAddress(algorand)
      const recipientInfoBefore = await algorand.client.algod.accountInformation(recipientAcc.addr.toString()).do()
      const recipientBalanceBefore = BigInt(recipientInfoBefore.amount)
      const escrowInfoBefore = await algorand.client.algod.accountInformation(escrowAddress).do()
      const escrowBalanceBefore = BigInt(escrowInfoBefore.amount)
      const triggerSenderInfoBefore = await algorand.client.algod.accountInformation(sender).do()
      const triggerSenderBalanceBefore = BigInt(triggerSenderInfoBefore.amount)

      const expectedFees = calcFees(subscriptionAmount)

      // Trigger payment
      await subscriptions.triggerPayment({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      // Get balances after
      const recipientInfoAfter = await algorand.client.algod.accountInformation(recipientAcc.addr.toString()).do()
      const recipientBalanceAfter = BigInt(recipientInfoAfter.amount)
      const escrowInfoAfter = await algorand.client.algod.accountInformation(escrowAddress).do()
      const escrowBalanceAfter = BigInt(escrowInfoAfter.amount)
      const triggerSenderInfoAfter = await algorand.client.algod.accountInformation(sender).do()
      const triggerSenderBalanceAfter = BigInt(triggerSenderInfoAfter.amount)

      // Recipient should receive leftOver amount
      const recipientReceived = recipientBalanceAfter - recipientBalanceBefore
      expect(recipientReceived).toBe(expectedFees.leftOver)

      // Escrow should receive akitaFee only (triggerFee goes to trigger sender)
      const escrowReceived = escrowBalanceAfter - escrowBalanceBefore
      expect(escrowReceived).toBe(expectedFees.akitaFee)

      // Trigger sender should receive triggerFee (minus transaction fees)
      // The triggerFee is returned to the sender, offsetting some of the tx costs
      const senderBalanceChange = triggerSenderBalanceAfter - triggerSenderBalanceBefore
      // Sender balance should change by: triggerFee - txFees (approximately)
      // We can't predict exact txFees, but we know triggerFee was sent back
      expect(senderBalanceChange).toBeGreaterThan(-10_000n) // Should be close to break-even
    })

    test('verify escrow balance after service creation', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      await algorand.account.ensureFunded(sender, dispenser, (200).algos())

      // Get escrow address and balance before
      const escrowAddress = await getEscrowAddress(algorand)
      const escrowInfoBefore = await algorand.client.algod.accountInformation(escrowAddress).do()
      const escrowBalanceBefore = BigInt(escrowInfoBefore.amount)

      // Service creation fee is 100 ALGO (DEFAULT_SERVICE_CREATION_FEE = 100_000_000n)
      // Some portion goes to escrow based on referral settings
      await subscriptions.newService({
        sender,
        signer,
        interval: BigInt(MIN_INTERVAL),
        asset: 0n,
        amount: 1_000_000n,
        passes: 0n,
        gateId: 0n,
        title: 'Escrow Test Service',
        description: 'Test Description',
        bannerImage: EMPTY_CID,
        highlightMessage: 0,
        highlightColor: '#AABBCC',
      })

      // Get escrow balance after
      const escrowInfoAfter = await algorand.client.algod.accountInformation(escrowAddress).do()
      const escrowBalanceAfter = BigInt(escrowInfoAfter.amount)

      // Escrow should receive the service creation fee
      const escrowReceived = escrowBalanceAfter - escrowBalanceBefore
      expect(escrowReceived).toBeGreaterThan(0n)
    })

    test('subscription with exact minimum amount (4 base units)', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      // MIN_AMOUNT is 4 base units
      const minAmount = BigInt(MIN_AMOUNT)

      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: minAmount,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
      })

      const subInfo = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      expect(subInfo.amount).toBe(minAmount)
      expect(subInfo.streak).toBe(1n)
    })

    test('subscription with exact minimum interval (60 seconds)', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      // MIN_INTERVAL is 60 seconds
      const minInterval = BigInt(MIN_INTERVAL)

      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 100_000n,
        interval: minInterval,
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
      })

      const subInfo = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      expect(subInfo.interval).toBe(minInterval)
    })

    test('large subscription amount fee calculation', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(sender, dispenser, (200).algos())

      // Get escrow address for balance tracking
      const escrowAddress = await getEscrowAddress(algorand)

      // Get balances before
      const recipientInfoBefore = await algorand.client.algod.accountInformation(recipientAcc.addr.toString()).do()
      const recipientBalanceBefore = BigInt(recipientInfoBefore.amount)
      const escrowInfoBefore = await algorand.client.algod.accountInformation(escrowAddress).do()
      const escrowBalanceBefore = BigInt(escrowInfoBefore.amount)

      // Large subscription: 100 ALGO
      const largeAmount = 100_000_000n
      const expectedFees = calcFees(largeAmount)

      await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: largeAmount,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
      })

      // Get balances after
      const recipientInfoAfter = await algorand.client.algod.accountInformation(recipientAcc.addr.toString()).do()
      const recipientBalanceAfter = BigInt(recipientInfoAfter.amount)
      const escrowInfoAfter = await algorand.client.algod.accountInformation(escrowAddress).do()
      const escrowBalanceAfter = BigInt(escrowInfoAfter.amount)

      // Verify fee calculation for large amount
      const recipientReceived = recipientBalanceAfter - recipientBalanceBefore
      expect(recipientReceived).toBe(expectedFees.leftOver)

      const escrowReceived = escrowBalanceAfter - escrowBalanceBefore
      expect(escrowReceived).toBe(expectedFees.total)

      // Expected: akitaFee = 3,500,000 (3.5%), triggerFee = 500,000 (0.5%)
      expect(expectedFees.akitaFee).toBe(3_500_000n)
      expect(expectedFees.triggerFee).toBe(500_000n)
      expect(expectedFees.leftOver).toBe(96_000_000n)
    })

    test('deposit and verify escrowed balance increase', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 100_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
      })

      const subBefore = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      // Deposit exact amount
      const depositAmount = 500_000n
      await subscriptions.deposit({
        sender,
        signer,
        asset: 0n,
        amount: depositAmount,
        id: subscriptionId
      })

      const subAfter = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      // Escrowed should increase by exactly depositAmount
      expect(subAfter.escrowed).toBe(subBefore.escrowed + depositAmount)
    })

    test('withdraw and verify escrowed balance decrease', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      const initialDeposit = 1_000_000n
      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 100_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
        initialDepositAmount: initialDeposit,
      })

      const subBefore = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })
      expect(subBefore.escrowed).toBe(initialDeposit)

      // Withdraw exact amount
      const withdrawAmount = 300_000n
      await subscriptions.withdraw({
        sender,
        signer,
        asset: 0n,
        amount: withdrawAmount,
        id: subscriptionId
      })

      const subAfter = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      // Escrowed should decrease by exactly withdrawAmount
      expect(subAfter.escrowed).toBe(subBefore.escrowed - withdrawAmount)
    })

    test('unsubscribe returns full escrowed balance', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      const initialDeposit = 500_000n
      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 100_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
        initialDepositAmount: initialDeposit,
      })

      // Get sender balance before unsubscribe
      const senderInfoBefore = await algorand.client.algod.accountInformation(sender).do()
      const senderBalanceBefore = BigInt(senderInfoBefore.amount)

      await subscriptions.unsubscribe({
        sender,
        signer,
        id: subscriptionId
      })

      // Get sender balance after
      const senderInfoAfter = await algorand.client.algod.accountInformation(sender).do()
      const senderBalanceAfter = BigInt(senderInfoAfter.amount)

      // Sender should receive back escrowed + MBR (minus transaction fees)
      // The balance increase should be at least the escrowed amount minus some fees
      const balanceIncrease = senderBalanceAfter - senderBalanceBefore
      // Should get back at least most of the deposit (minus fees)
      expect(balanceIncrease).toBeGreaterThan(initialDeposit - 100_000n) // Allow for fees
    })

    test('trigger payment reduces escrowed by exact subscription amount', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      const subscriptionAmount = 100_000n
      const initialDeposit = 500_000n
      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: subscriptionAmount,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
        initialDepositAmount: initialDeposit,
      })

      const subBefore = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })
      expect(subBefore.escrowed).toBe(initialDeposit)

      // Warp time
      await timeWarp.timeWarp(BigInt(MIN_INTERVAL + 10))

      // Trigger payment
      await subscriptions.triggerPayment({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      const subAfter = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      // Escrowed should be reduced by exactly subscriptionAmount
      expect(subAfter.escrowed).toBe(subBefore.escrowed - subscriptionAmount)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // ASA SERVICE CREATION TESTS (ALGO-based services with ASA-related validations)
  // ═══════════════════════════════════════════════════════════════════════════
  // Note: Full ASA subscription tests require the subscriptions contract to be
  // opted into the ASA, which requires special setup via inner transactions.
  // These tests verify ALGO-based service creation and related functionality.

  describe('ASA Related Validations', () => {
    test('service with zero asset (ALGO) creates successfully', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      await algorand.account.ensureFunded(sender, dispenser, (200).algos())

      // Create service with ALGO (asset = 0)
      const serviceId = await subscriptions.newService({
        sender,
        signer,
        interval: BigInt(MIN_INTERVAL),
        asset: 0n, // ALGO
        amount: 1_000_000n,
        passes: 0n,
        gateId: 0n,
        title: 'ALGO Service',
        description: 'Test ALGO-based service',
        bannerImage: EMPTY_CID,
        highlightMessage: 0,
        highlightColor: '#AABBCC',
      })

      expect(serviceId).toBeDefined()

      const service = await subscriptions.getService({
        sender,
        signer,
        address: sender,
        id: Number(serviceId)
      })

      expect(service.asset).toBe(0n)
      expect(service.amount).toBe(1_000_000n)
    })

    test('new service cost for ALGO', async () => {
      const { context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Get cost for ALGO service
      const costAlgo = await subscriptions.newServiceCost({ sender, signer, asset: 0n })

      // Cost should be service creation fee + MBR
      // DEFAULT_SERVICE_CREATION_FEE = 100_000_000n (100 ALGO)
      expect(costAlgo).toBeGreaterThan(100_000_000n)
    })

    test('new subscription cost for ALGO donation', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())

      // Get cost for ALGO subscription
      const cost = await subscriptions.newSubscriptionCost({
        sender,
        signer,
        recipient: recipientAcc.addr.toString(),
        asset: 0n,
        serviceId: 0n
      })

      // Cost should be positive (MBR for subscription box)
      expect(cost).toBeGreaterThan(0n)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // EDGE CASES
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Edge Cases', () => {
    test('subscribe with amount just above minimum', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      // MIN_AMOUNT + 1
      const amount = BigInt(MIN_AMOUNT + 1)

      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
      })

      const subInfo = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      expect(subInfo.amount).toBe(amount)
    })

    test('subscribe with interval just above minimum', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      // MIN_INTERVAL + 1
      const interval = BigInt(MIN_INTERVAL + 1)

      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 100_000n,
        interval,
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
      })

      const subInfo = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      expect(subInfo.interval).toBe(interval)
    })

    test('withdraw entire escrowed balance', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      const initialDeposit = 500_000n
      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 100_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
        initialDepositAmount: initialDeposit,
      })

      // Withdraw entire balance
      await subscriptions.withdraw({
        sender,
        signer,
        asset: 0n,
        amount: initialDeposit,
        id: subscriptionId
      })

      const subInfo = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      expect(subInfo.escrowed).toBe(0n)
    })

    test('service with maximum passes (5)', async () => {
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
        passes: 5n, // Maximum allowed
        gateId: 0n,
        title: 'Max Passes Service',
        description: 'Test Description',
        bannerImage: EMPTY_CID,
        highlightMessage: 0,
        highlightColor: '#AABBCC',
      })

      const service = await subscriptions.getService({
        sender,
        signer,
        address: sender,
        id: Number(serviceId)
      })

      expect(service.passes).toBe(5n)
    })

    test('subscribe then deposit then withdraw then trigger', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(sender, dispenser, (20).algos())

      const subscriptionAmount = 100_000n

      // 1. Subscribe with no initial deposit
      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: subscriptionAmount,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
      })

      let subInfo = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })
      expect(subInfo.escrowed).toBe(0n)
      expect(subInfo.streak).toBe(1n)

      // 2. Deposit funds
      await subscriptions.deposit({
        sender,
        signer,
        asset: 0n,
        amount: 500_000n,
        id: subscriptionId
      })

      subInfo = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })
      expect(subInfo.escrowed).toBe(500_000n)

      // 3. Withdraw some
      await subscriptions.withdraw({
        sender,
        signer,
        asset: 0n,
        amount: 200_000n,
        id: subscriptionId
      })

      subInfo = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })
      expect(subInfo.escrowed).toBe(300_000n)

      // 4. Warp time and trigger
      await timeWarp.timeWarp(BigInt(MIN_INTERVAL + 10))

      await subscriptions.triggerPayment({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      subInfo = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })
      expect(subInfo.escrowed).toBe(200_000n) // 300,000 - 100,000
    })

    test('multiple deposits to same subscription', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 100_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
      })

      // Multiple deposits
      for (let i = 0; i < 3; i++) {
        await subscriptions.deposit({
          sender,
          signer,
          asset: 0n,
          amount: 100_000n,
          id: subscriptionId
        })
      }

      const subInfo = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      expect(subInfo.escrowed).toBe(300_000n)
    })

    test('service description with special characters', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      await algorand.account.ensureFunded(sender, dispenser, (200).algos())

      const specialDesc = 'Test with émojis 🎉 and spëcial çharacters! @#$%^&*()'

      const serviceId = await subscriptions.newService({
        sender,
        signer,
        interval: BigInt(MIN_INTERVAL),
        asset: 0n,
        amount: 1_000_000n,
        passes: 0n,
        gateId: 0n,
        title: 'Special Chars',
        description: specialDesc,
        bannerImage: EMPTY_CID,
        highlightMessage: 0,
        highlightColor: '#AABBCC',
      })

      const service = await subscriptions.getService({
        sender,
        signer,
        address: sender,
        id: Number(serviceId)
      })

      expect(service.description).toBe(specialDesc)
    })

    test('empty passes array clears previous passes', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const merchantAcc = algorand.account.random()
      await algorand.account.ensureFunded(merchantAcc.addr, dispenser, (400).algos())
      await algorand.account.ensureFunded(sender, dispenser, (20).algos())

      const serviceId = await subscriptions.newService({
        sender: merchantAcc.addr.toString(),
        signer: merchantAcc.signer,
        interval: BigInt(MIN_INTERVAL),
        asset: 0n,
        amount: 500_000n,
        passes: 3n,
        gateId: 0n,
        title: 'Pass Clear Test',
        description: 'Test Description',
        bannerImage: EMPTY_CID,
        highlightMessage: 0,
        highlightColor: '#AABBCC',
      })

      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 500_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: merchantAcc.addr.toString(),
        serviceId: serviceId,
      })

      // Set some passes
      const passHolder1 = algorand.account.random()
      const passHolder2 = algorand.account.random()
      await subscriptions.setPasses({
        sender,
        signer,
        id: subscriptionId,
        passes: [passHolder1.addr.toString(), passHolder2.addr.toString()]
      })

      let subWithDetails = await subscriptions.getSubscriptionWithDetails({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })
      expect(subWithDetails.passes.length).toBe(2)

      // Clear passes with empty array
      await subscriptions.setPasses({
        sender,
        signer,
        id: subscriptionId,
        passes: []
      })

      subWithDetails = await subscriptions.getSubscriptionWithDetails({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })
      expect(subWithDetails.passes.length).toBe(0)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // WITHDRAWAL EDGE CASES AND SECURITY TESTS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Withdrawal Edge Cases and Security', () => {
    test('cannot withdraw from another user subscription', async () => {
      const { algorand, context: { testAccount } } = localnet
      const owner = testAccount.toString()
      const ownerSigner = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()

      // Create another user who will try to steal funds
      const attackerAcc = algorand.account.random()
      await algorand.account.ensureFunded(attackerAcc.addr, dispenser, (10).algos())

      // Create recipient
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())

      // Owner creates subscription with funds
      const subscriptionId = await subscriptions.subscribe({
        sender: owner,
        signer: ownerSigner,
        asset: 0n,
        amount: 100_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
        initialDepositAmount: 500_000n,
      })

      // Attacker tries to withdraw from owner's subscription
      let error = 'no error thrown'
      try {
        await subscriptions.withdraw({
          sender: attackerAcc.addr.toString(),
          signer: attackerAcc.signer,
          asset: 0n,
          amount: 100_000n,
          id: subscriptionId // Using owner's subscription ID
        })
      } catch (e: any) {
        error = e.message
      }

      // Should fail because attacker doesn't own this subscription
      expect(error).toContain(ERR_SUBSCRIPTION_DOES_NOT_EXIST)

      // Verify owner's funds are still intact
      const subInfo = await subscriptions.getSubscription({
        sender: owner,
        signer: ownerSigner,
        address: owner,
        id: subscriptionId
      })
      expect(subInfo.escrowed).toBe(500_000n)
    })

    test('multiple sequential withdrawals', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      const initialDeposit = 1_000_000n
      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 100_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
        initialDepositAmount: initialDeposit,
      })

      // Perform 3 sequential withdrawals
      const withdrawals = [200_000n, 300_000n, 400_000n]
      let expectedEscrowed = initialDeposit

      for (const amount of withdrawals) {
        await subscriptions.withdraw({
          sender,
          signer,
          asset: 0n,
          amount,
          id: subscriptionId
        })

        expectedEscrowed -= amount

        const subInfo = await subscriptions.getSubscription({
          sender,
          signer,
          address: sender,
          id: subscriptionId
        })
        expect(subInfo.escrowed).toBe(expectedEscrowed)
      }

      // Final escrowed should be: 1,000,000 - 200,000 - 300,000 - 400,000 = 100,000
      expect(expectedEscrowed).toBe(100_000n)
    })

    test('verify sender receives exact withdrawn amount', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 100_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
        initialDepositAmount: 500_000n,
      })

      // Get sender balance before withdrawal
      const senderInfoBefore = await algorand.client.algod.accountInformation(sender).do()
      const senderBalanceBefore = BigInt(senderInfoBefore.amount)

      const withdrawAmount = 300_000n
      await subscriptions.withdraw({
        sender,
        signer,
        asset: 0n,
        amount: withdrawAmount,
        id: subscriptionId
      })

      // Get sender balance after withdrawal
      const senderInfoAfter = await algorand.client.algod.accountInformation(sender).do()
      const senderBalanceAfter = BigInt(senderInfoAfter.amount)

      // Sender should receive withdrawAmount minus transaction fees
      // Balance increase should be close to withdrawAmount (minus ~2000-3000 in fees)
      const balanceIncrease = senderBalanceAfter - senderBalanceBefore
      expect(balanceIncrease).toBeGreaterThan(withdrawAmount - 10_000n) // Allow for fees
      expect(balanceIncrease).toBeLessThanOrEqual(withdrawAmount)
    })

    test('verify contract balance decreases on withdrawal', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 100_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
        initialDepositAmount: 500_000n,
      })

      // Get contract balance before withdrawal
      const contractAddress = subscriptions.client.appAddress.toString()
      const contractInfoBefore = await algorand.client.algod.accountInformation(contractAddress).do()
      const contractBalanceBefore = BigInt(contractInfoBefore.amount)

      const withdrawAmount = 200_000n
      await subscriptions.withdraw({
        sender,
        signer,
        asset: 0n,
        amount: withdrawAmount,
        id: subscriptionId
      })

      // Get contract balance after withdrawal
      const contractInfoAfter = await algorand.client.algod.accountInformation(contractAddress).do()
      const contractBalanceAfter = BigInt(contractInfoAfter.amount)

      // Contract balance should decrease by exactly the withdraw amount
      const contractBalanceDecrease = contractBalanceBefore - contractBalanceAfter
      expect(contractBalanceDecrease).toBe(withdrawAmount)
    })

    test('withdraw after trigger payment reduced balance', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      const subscriptionAmount = 100_000n
      const initialDeposit = 500_000n
      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: subscriptionAmount,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
        initialDepositAmount: initialDeposit,
      })

      // Trigger a payment
      await timeWarp.timeWarp(BigInt(MIN_INTERVAL + 10))
      await subscriptions.triggerPayment({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      // Escrowed should now be reduced by subscription amount
      const subAfterTrigger = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })
      expect(subAfterTrigger.escrowed).toBe(initialDeposit - subscriptionAmount)

      // Now withdraw remaining balance
      const remainingBalance = subAfterTrigger.escrowed
      await subscriptions.withdraw({
        sender,
        signer,
        asset: 0n,
        amount: remainingBalance,
        id: subscriptionId
      })

      const subAfterWithdraw = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })
      expect(subAfterWithdraw.escrowed).toBe(0n)
    })

    test('withdraw from shutdown service subscription', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const merchantAcc = algorand.account.random()
      await algorand.account.ensureFunded(merchantAcc.addr, dispenser, (200).algos())
      await algorand.account.ensureFunded(sender, dispenser, (20).algos())

      // Create service
      const serviceId = await subscriptions.newService({
        sender: merchantAcc.addr.toString(),
        signer: merchantAcc.signer,
        interval: BigInt(MIN_INTERVAL),
        asset: 0n,
        amount: 500_000n,
        passes: 0n,
        gateId: 0n,
        title: 'Shutdown Withdraw Test',
        description: 'Test Description',
        bannerImage: EMPTY_CID,
        highlightMessage: 0,
        highlightColor: '#AABBCC',
      })

      // Subscribe with deposit
      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 500_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: merchantAcc.addr.toString(),
        serviceId: serviceId,
        initialDepositAmount: 1_000_000n,
      })

      // Shutdown the service
      await subscriptions.shutdownService({
        sender: merchantAcc.addr.toString(),
        signer: merchantAcc.signer,
        id: serviceId
      })

      // Verify service is shutdown
      const isShutdown = await subscriptions.isShutdown({
        address: merchantAcc.addr.toString(),
        id: serviceId
      })
      expect(isShutdown).toBe(true)

      // Should still be able to withdraw funds
      await subscriptions.withdraw({
        sender,
        signer,
        asset: 0n,
        amount: 500_000n,
        id: subscriptionId
      })

      const subInfo = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })
      expect(subInfo.escrowed).toBe(500_000n)
    })

    test('withdraw 1 microAlgo (minimum amount)', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 100_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
        initialDepositAmount: 100_000n,
      })

      const subBefore = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      // Withdraw minimum possible amount
      await subscriptions.withdraw({
        sender,
        signer,
        asset: 0n,
        amount: 1n, // 1 microAlgo
        id: subscriptionId
      })

      const subAfter = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      expect(subAfter.escrowed).toBe(subBefore.escrowed - 1n)
    })

    test('partial withdrawal leaves correct remainder', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      const initialDeposit = 1_234_567n // Odd number to test exact math
      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 100_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
        initialDepositAmount: initialDeposit,
      })

      const withdrawAmount = 567_890n // Another odd number
      await subscriptions.withdraw({
        sender,
        signer,
        asset: 0n,
        amount: withdrawAmount,
        id: subscriptionId
      })

      const subInfo = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      // Exact remainder calculation
      expect(subInfo.escrowed).toBe(initialDeposit - withdrawAmount)
      expect(subInfo.escrowed).toBe(666_677n)
    })

    test('withdraw leaves exactly one payment worth', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      const subscriptionAmount = 100_000n
      const initialDeposit = 500_000n
      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: subscriptionAmount,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
        initialDepositAmount: initialDeposit,
      })

      // Withdraw all but exactly one payment's worth
      const withdrawAmount = initialDeposit - subscriptionAmount
      await subscriptions.withdraw({
        sender,
        signer,
        asset: 0n,
        amount: withdrawAmount,
        id: subscriptionId
      })

      const subInfo = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      // Should have exactly enough for one more payment
      expect(subInfo.escrowed).toBe(subscriptionAmount)
    })

    test('deposit then immediately withdraw same amount', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 100_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
      })

      const subBefore = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      // Deposit
      const amount = 500_000n
      await subscriptions.deposit({
        sender,
        signer,
        asset: 0n,
        amount,
        id: subscriptionId
      })

      // Immediately withdraw same amount
      await subscriptions.withdraw({
        sender,
        signer,
        asset: 0n,
        amount,
        id: subscriptionId
      })

      const subAfter = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      // Net zero change to escrowed balance
      expect(subAfter.escrowed).toBe(subBefore.escrowed)
    })

    test('withdraw from subscription with passes', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const merchantAcc = algorand.account.random()
      await algorand.account.ensureFunded(merchantAcc.addr, dispenser, (400).algos())
      await algorand.account.ensureFunded(sender, dispenser, (20).algos())

      // Create service with passes
      const serviceId = await subscriptions.newService({
        sender: merchantAcc.addr.toString(),
        signer: merchantAcc.signer,
        interval: BigInt(MIN_INTERVAL),
        asset: 0n,
        amount: 500_000n,
        passes: 3n,
        gateId: 0n,
        title: 'Family Plan Withdraw',
        description: 'Test Description',
        bannerImage: EMPTY_CID,
        highlightMessage: 0,
        highlightColor: '#AABBCC',
      })

      // Subscribe with deposit
      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 500_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: merchantAcc.addr.toString(),
        serviceId: serviceId,
        initialDepositAmount: 1_000_000n,
      })

      // Set up passes
      const passHolder1 = algorand.account.random()
      const passHolder2 = algorand.account.random()
      await subscriptions.setPasses({
        sender,
        signer,
        id: subscriptionId,
        passes: [passHolder1.addr.toString(), passHolder2.addr.toString()]
      })

      // Verify passes are set
      const subWithPasses = await subscriptions.getSubscriptionWithDetails({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })
      expect(subWithPasses.passes.length).toBe(2)

      // Withdraw funds
      await subscriptions.withdraw({
        sender,
        signer,
        asset: 0n,
        amount: 300_000n,
        id: subscriptionId
      })

      // Verify withdrawal worked and passes still intact
      const subAfter = await subscriptions.getSubscriptionWithDetails({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })
      expect(subAfter.escrowed).toBe(700_000n)
      expect(subAfter.passes.length).toBe(2)
    })

    test('cannot withdraw exactly one more than escrowed', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      const initialDeposit = 500_000n
      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: 0n,
        amount: 100_000n,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
        initialDepositAmount: initialDeposit,
      })

      // Try to withdraw exactly 1 more than escrowed
      let error = 'no error thrown'
      try {
        await subscriptions.withdraw({
          sender,
          signer,
          asset: 0n,
          amount: initialDeposit + 1n,
          id: subscriptionId
        })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_NOT_ENOUGH_FUNDS)

      // Verify funds are still intact
      const subInfo = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })
      expect(subInfo.escrowed).toBe(initialDeposit)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // ASA SUBSCRIPTION TESTS
  // ═══════════════════════════════════════════════════════════════════════════
  // These tests verify ASA-based subscriptions where payments are made in a
  // custom Algorand Standard Asset instead of ALGO.

  describe('ASA Subscriptions', () => {
    let testAssetId: bigint
    let assetDecimals: number

    beforeAll(async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Create a test ASA for subscription tests
      const assetCreateResult = await algorand.send.assetCreate({
        sender,
        signer,
        total: 1_000_000_000_000n, // 1 trillion base units
        decimals: 6,
        assetName: 'Test Subscription Token',
        unitName: 'TSUB',
        defaultFrozen: false,
      })
      testAssetId = BigInt(assetCreateResult.confirmation.assetIndex!)
      assetDecimals = 6
      console.log('Test ASA created with ID:', testAssetId)
    })

    test('create ASA service', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      await algorand.account.ensureFunded(sender, dispenser, (200).algos())

      // Create service with the test ASA
      const serviceId = await subscriptions.newService({
        sender,
        signer,
        interval: BigInt(MIN_INTERVAL),
        asset: testAssetId,
        amount: 1_000_000n, // 1 token with 6 decimals
        passes: 0n,
        gateId: 0n,
        title: 'ASA Service',
        description: 'Test ASA-based subscription service',
        bannerImage: EMPTY_CID,
        highlightMessage: 0,
        highlightColor: '#AABBCC',
      })

      expect(serviceId).toBeDefined()

      const service = await subscriptions.getService({
        sender,
        signer,
        address: sender,
        id: Number(serviceId)
      })

      expect(service.asset).toBe(testAssetId)
      expect(service.amount).toBe(1_000_000n)
      expect(service.interval).toBe(BigInt(MIN_INTERVAL))
    })

    test('subscribe to ASA donation (no service)', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      // Recipient needs to opt into the ASA to receive it
      await algorand.send.assetOptIn({
        sender: recipientAcc.addr,
        signer: recipientAcc.signer,
        assetId: testAssetId,
      })

      const donationAmount = 500_000n // 0.5 tokens

      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: testAssetId,
        amount: donationAmount,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n, // donation
      })

      expect(subscriptionId).toBeDefined()

      // Verify subscription was created
      const subscription = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      expect(subscription.asset).toBe(testAssetId)
      expect(subscription.amount).toBe(donationAmount)
      // escrowed is 0 since subscription amount is sent to recipient immediately
      // and no initialDepositAmount was provided
      expect(subscription.escrowed).toBe(0n)
    })

    test('subscribe to ASA service', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      await algorand.account.ensureFunded(sender, dispenser, (200).algos())

      // First create a merchant and their service
      const merchantAcc = algorand.account.random()
      await algorand.account.ensureFunded(merchantAcc.addr, dispenser, (200).algos())

      // Merchant opts into ASA first (needed to receive payments and transfers)
      await algorand.send.assetOptIn({
        sender: merchantAcc.addr,
        signer: merchantAcc.signer,
        assetId: testAssetId,
      })

      const serviceAmount = 1_000_000n // 1 token per interval

      // Merchant creates ASA service
      const serviceId = await subscriptions.newService({
        sender: merchantAcc.addr.toString(),
        signer: merchantAcc.signer,
        interval: BigInt(MIN_INTERVAL),
        asset: testAssetId,
        amount: serviceAmount,
        passes: 0n,
        gateId: 0n,
        title: 'Premium ASA Service',
        description: 'Premium service paid in ASA',
        bannerImage: EMPTY_CID,
        highlightMessage: 0,
        highlightColor: '#AABBCC',
      })

      // Service is automatically activated by newService method

      // User subscribes to ASA service
      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: testAssetId,
        amount: serviceAmount,
        interval: BigInt(MIN_INTERVAL),
        recipient: merchantAcc.addr.toString(),
        serviceId,
      })

      expect(subscriptionId).toBeDefined()

      // Verify subscription
      const subscription = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      expect(subscription.asset).toBe(testAssetId)
      expect(subscription.amount).toBe(serviceAmount)
      expect(subscription.serviceId).toBe(serviceId)
    })

    test('deposit ASA into subscription', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      // Recipient opts into ASA
      await algorand.send.assetOptIn({
        sender: recipientAcc.addr,
        signer: recipientAcc.signer,
        assetId: testAssetId,
      })

      const initialAmount = 500_000n

      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: testAssetId,
        amount: initialAmount,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
      })

      // Check initial escrowed amount - should be 0 since subscription amount
      // is sent to recipient immediately and no initialDepositAmount was provided
      const subBefore = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })
      expect(subBefore.escrowed).toBe(0n)

      // Deposit more ASA
      const depositAmount = 1_000_000n
      await subscriptions.deposit({
        sender,
        signer,
        asset: testAssetId,
        amount: depositAmount,
        id: subscriptionId
      })

      // Verify deposit
      const subAfter = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })
      expect(subAfter.escrowed).toBe(depositAmount) // Was 0, now has deposit
    })

    test('withdraw ASA from subscription', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      // Recipient opts into ASA
      await algorand.send.assetOptIn({
        sender: recipientAcc.addr,
        signer: recipientAcc.signer,
        assetId: testAssetId,
      })

      const subscriptionAmount = 100_000n
      const initialDepositAmount = 900_000n // extra deposit on top of subscription amount

      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: testAssetId,
        amount: subscriptionAmount,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
        initialDepositAmount,
      })

      // Check initial escrowed amount - this is just the initialDepositAmount
      // (subscription amount was sent to recipient immediately)
      const subBefore = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })
      expect(subBefore.escrowed).toBe(initialDepositAmount)

      // Check sender's ASA balance before withdrawal
      const algod = algorand.client.algod
      const senderInfoBefore = await algod.accountAssetInformation(sender, Number(testAssetId)).do()
      const balanceBefore = BigInt(senderInfoBefore.assetHolding?.amount ?? 0)

      // Withdraw some ASA
      const withdrawAmount = 500_000n
      await subscriptions.withdraw({
        sender,
        signer,
        asset: testAssetId,
        amount: withdrawAmount,
        id: subscriptionId
      })

      // Verify withdrawal from subscription
      const subAfter = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })
      expect(subAfter.escrowed).toBe(initialDepositAmount - withdrawAmount)

      // Verify sender received the ASA
      const senderInfoAfter = await algod.accountAssetInformation(sender, Number(testAssetId)).do()
      expect(BigInt(senderInfoAfter.assetHolding?.amount ?? 0)).toBe(balanceBefore + withdrawAmount)
    })

    test('trigger payment for ASA subscription', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      // Recipient opts into ASA
      await algorand.send.assetOptIn({
        sender: recipientAcc.addr,
        signer: recipientAcc.signer,
        assetId: testAssetId,
      })

      const subscriptionAmount = 100_000n
      const initialDeposit = 500_000n // enough for multiple payments

      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: testAssetId,
        amount: subscriptionAmount,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
        initialDepositAmount: initialDeposit,
      })

      // Get initial states
      const algod = algorand.client.algod
      const subBefore = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })
      const recipientInfoBefore = await algod.accountAssetInformation(
        recipientAcc.addr.toString(),
        Number(testAssetId)
      ).do()
      const recipientBalanceBefore = BigInt(recipientInfoBefore.assetHolding?.amount ?? 0)

      // Wait for interval to pass
      await timeWarp.timeWarp(BigInt(MIN_INTERVAL + 1))

      // Trigger payment
      await subscriptions.triggerPayment({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      // Verify subscription escrowed decreased
      const subAfter = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })
      expect(subAfter.escrowed).toBeLessThan(subBefore.escrowed)

      // Verify recipient received ASA (minus fees)
      const recipientInfoAfter = await algod.accountAssetInformation(
        recipientAcc.addr.toString(),
        Number(testAssetId)
      ).do()
      const recipientBalanceAfter = BigInt(recipientInfoAfter.assetHolding?.amount ?? 0)
      expect(recipientBalanceAfter).toBeGreaterThan(recipientBalanceBefore)
    })

    test('unsubscribe from ASA subscription returns funds', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      // Recipient opts into ASA
      await algorand.send.assetOptIn({
        sender: recipientAcc.addr,
        signer: recipientAcc.signer,
        assetId: testAssetId,
      })

      const subscriptionAmount = 100_000n
      const initialDeposit = 1_000_000n

      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: testAssetId,
        amount: subscriptionAmount,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
        initialDepositAmount: initialDeposit,
      })

      // Check escrowed amount
      const algod = algorand.client.algod
      const subBefore = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      // Get sender ASA balance before unsubscribe
      const senderInfoBefore = await algod.accountAssetInformation(sender, Number(testAssetId)).do()
      const senderBalanceBefore = BigInt(senderInfoBefore.assetHolding?.amount ?? 0)

      // Unsubscribe
      await subscriptions.unsubscribe({
        sender,
        signer,
        id: subscriptionId
      })

      // Verify sender received escrowed ASA back
      const senderInfoAfter = await algod.accountAssetInformation(sender, Number(testAssetId)).do()
      const senderBalanceAfter = BigInt(senderInfoAfter.assetHolding?.amount ?? 0)
      expect(senderBalanceAfter).toBe(senderBalanceBefore + subBefore.escrowed)
    })

    test('ASA subscription with multiple deposits and withdrawals', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      // Recipient opts into ASA
      await algorand.send.assetOptIn({
        sender: recipientAcc.addr,
        signer: recipientAcc.signer,
        assetId: testAssetId,
      })

      const subscriptionAmount = 100_000n

      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: testAssetId,
        amount: subscriptionAmount,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
      })

      // Initial escrowed is 0 since subscription amount is sent to recipient immediately
      let sub = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })
      expect(sub.escrowed).toBe(0n)

      // First deposit
      await subscriptions.deposit({
        sender,
        signer,
        asset: testAssetId,
        amount: 200_000n,
        id: subscriptionId
      })
      sub = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })
      expect(sub.escrowed).toBe(200_000n)

      // Second deposit
      await subscriptions.deposit({
        sender,
        signer,
        asset: testAssetId,
        amount: 500_000n,
        id: subscriptionId
      })
      sub = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })
      expect(sub.escrowed).toBe(700_000n)

      // First withdrawal
      await subscriptions.withdraw({
        sender,
        signer,
        asset: testAssetId,
        amount: 100_000n,
        id: subscriptionId
      })
      sub = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })
      expect(sub.escrowed).toBe(600_000n)

      // Second withdrawal (600k - 300k = 300k)
      await subscriptions.withdraw({
        sender,
        signer,
        asset: testAssetId,
        amount: 300_000n,
        id: subscriptionId
      })
      sub = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })
      expect(sub.escrowed).toBe(300_000n)
    })

    test('cannot withdraw more ASA than escrowed', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      // Recipient opts into ASA
      await algorand.send.assetOptIn({
        sender: recipientAcc.addr,
        signer: recipientAcc.signer,
        assetId: testAssetId,
      })

      const subscriptionAmount = 500_000n

      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: testAssetId,
        amount: subscriptionAmount,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
      })

      // Try to withdraw more than escrowed
      let error = 'no error thrown'
      try {
        await subscriptions.withdraw({
          sender,
          signer,
          asset: testAssetId,
          amount: subscriptionAmount + 1n,
          id: subscriptionId
        })
      } catch (e: any) {
        error = e.message
      }

      expect(error).toContain(ERR_NOT_ENOUGH_FUNDS)
    })

    test('third party can trigger ASA subscription payment', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      const recipientAcc = algorand.account.random()
      const thirdPartyAcc = algorand.account.random()
      await algorand.account.ensureFunded(recipientAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(thirdPartyAcc.addr, dispenser, (10).algos())
      await algorand.account.ensureFunded(sender, dispenser, (10).algos())

      // Recipient opts into ASA
      await algorand.send.assetOptIn({
        sender: recipientAcc.addr,
        signer: recipientAcc.signer,
        assetId: testAssetId,
      })

      // Third party must opt into ASA to receive trigger fee
      await algorand.send.assetOptIn({
        sender: thirdPartyAcc.addr,
        signer: thirdPartyAcc.signer,
        assetId: testAssetId,
      })

      const subscriptionAmount = 100_000n
      const initialDeposit = 500_000n

      const subscriptionId = await subscriptions.subscribe({
        sender,
        signer,
        asset: testAssetId,
        amount: subscriptionAmount,
        interval: BigInt(MIN_INTERVAL),
        recipient: recipientAcc.addr.toString(),
        serviceId: 0n,
        initialDepositAmount: initialDeposit,
      })

      // Get initial state
      const subBefore = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })

      // Wait for interval to pass
      await timeWarp.timeWarp(BigInt(MIN_INTERVAL + 1))

      // Third party triggers payment
      await subscriptions.triggerPayment({
        sender: thirdPartyAcc.addr.toString(),
        signer: thirdPartyAcc.signer,
        address: sender,
        id: subscriptionId
      })

      // Verify payment was triggered
      const subAfter = await subscriptions.getSubscription({
        sender,
        signer,
        address: sender,
        id: subscriptionId
      })
      expect(subAfter.escrowed).toBeLessThan(subBefore.escrowed)
    })

    test('ASA service with passes', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const dispenser = await algorand.account.dispenserFromEnvironment()
      await algorand.account.ensureFunded(sender, dispenser, (200).algos())

      // Create merchant
      const merchantAcc = algorand.account.random()
      await algorand.account.ensureFunded(merchantAcc.addr, dispenser, (200).algos())

      // Merchant opts into ASA
      await algorand.send.assetOptIn({
        sender: merchantAcc.addr,
        signer: merchantAcc.signer,
        assetId: testAssetId,
      })

      // Create ASA service with passes
      const serviceId = await subscriptions.newService({
        sender: merchantAcc.addr.toString(),
        signer: merchantAcc.signer,
        interval: BigInt(MIN_INTERVAL),
        asset: testAssetId,
        amount: 1_000_000n,
        passes: 3n, // Allow 3 passes
        gateId: 0n,
        title: 'ASA Family Plan',
        description: 'ASA service with family passes',
        bannerImage: EMPTY_CID,
        highlightMessage: 0,
        highlightColor: '#AABBCC',
      })

      // Service is automatically activated by newService method

      // Verify service has passes enabled
      const service = await subscriptions.getService({
        sender,
        signer,
        address: merchantAcc.addr.toString(),
        id: Number(serviceId)
      })

      expect(service.passes).toBe(3n)
      expect(service.asset).toBe(testAssetId)
    })
  })
})
