import * as algokit from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { SigningAccount, TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { beforeAll, describe, expect, test } from 'vitest'
import {
  OptInPluginSDK,
  PayPluginSDK,
  RevenueManagerPluginSDK,
  UpdateAkitaDAOPluginSDK
} from 'akita-sdk/wallet'
import algosdk, { makeBasicAccountTransactionSigner } from 'algosdk'
import { AkitaUniverse, buildAkitaUniverse } from '../../../tests/fixtures/dao'
import { deployPayPlugin } from '../../../tests/fixtures/plugins/pay'

algokit.Config.configure({ populateAppCallResources: true })

const fixture = algorandFixture()

describe('Plugin SDKs', () => {
  let deployer: algosdk.Account
  let user: algosdk.Account
  let akitaUniverse: AkitaUniverse
  let dispenser: algosdk.Address & TransactionSignerAccount & {
    account: SigningAccount;
  }
  let algorand: import('@algorandfoundation/algokit-utils').AlgorandClient

  beforeAll(async () => {
    await fixture.beforeEach()
    algorand = fixture.context.algorand
    dispenser = await algorand.account.dispenserFromEnvironment()

    const ctx = fixture.context
    deployer = await ctx.generateAccount({ initialFunds: algokit.microAlgos(2_000_000_000) })
    user = await ctx.generateAccount({ initialFunds: algokit.microAlgos(500_000_000) })

    await algorand.account.ensureFunded(deployer.addr, dispenser, (2000).algo())
    await algorand.account.ensureFunded(user.addr, dispenser, (500).algo())

    // Build the full Akita DAO universe
    akitaUniverse = await buildAkitaUniverse({
      fixture,
      sender: deployer.addr,
      signer: makeBasicAccountTransactionSigner(deployer),
      apps: {},
    })
  })

  describe('PayPluginSDK', () => {
    let payPluginSDK: PayPluginSDK

    beforeAll(async () => {
      // Deploy pay plugin
      const payPluginClient = await deployPayPlugin({
        fixture,
        sender: deployer.addr,
        signer: makeBasicAccountTransactionSigner(deployer),
      })

      payPluginSDK = new PayPluginSDK({
        algorand,
        factoryParams: {
          appId: payPluginClient.appId,
          defaultSender: user.addr,
          defaultSigner: makeBasicAccountTransactionSigner(user),
        },
      })
    })

    describe('pay()', () => {
      test('should return plugin hook when called without args', () => {
        const hook = payPluginSDK.pay()
        expect(typeof hook).toBe('function')

        const result = hook()
        expect(result.appId).toBe(payPluginSDK.client.appId)
        expect(result.selectors).toBeDefined()
        expect(result.selectors.length).toBeGreaterThan(0)
        expect(result.getTxns).toBeDefined()
      })

      test('should return plugin hook with transaction builder when called with args', () => {
        const hook = payPluginSDK.pay({
          sender: user.addr,
          signer: makeBasicAccountTransactionSigner(user),
          payments: [
            { receiver: deployer.addr.toString(), amount: 1_000_000n, asset: 0n }
          ]
        })

        const result = hook()
        expect(result.appId).toBe(payPluginSDK.client.appId)
        expect(result.selectors).toBeDefined()
        expect(typeof result.getTxns).toBe('function')
      })
    })
  })

  describe('OptInPluginSDK', () => {
    let optInPluginSDK: OptInPluginSDK

    beforeAll(() => {
      optInPluginSDK = akitaUniverse.optInPlugin
    })

    describe('optIn()', () => {
      test('should return plugin hook when called without args', () => {
        const hook = optInPluginSDK.optIn()
        expect(typeof hook).toBe('function')

        const result = hook()
        expect(result.appId).toBe(optInPluginSDK.client.appId)
        expect(result.selectors).toBeDefined()
      })

      test('should return plugin hook with transaction builder when called with args', () => {
        const hook = optInPluginSDK.optIn({
          sender: user.addr,
          signer: makeBasicAccountTransactionSigner(user),
          assets: [0n],
        })

        const result = hook()
        expect(result.appId).toBe(optInPluginSDK.client.appId)
        expect(typeof result.getTxns).toBe('function')
      })
    })
  })

  describe('RevenueManagerPluginSDK', () => {
    let revenueManagerPluginSDK: RevenueManagerPluginSDK

    beforeAll(() => {
      revenueManagerPluginSDK = akitaUniverse.revenueManagerPlugin
    })

    describe('newReceiveEscrow()', () => {
      test('should return plugin hook when called without args', () => {
        const hook = revenueManagerPluginSDK.newReceiveEscrow()
        expect(typeof hook).toBe('function')

        const result = hook()
        expect(result.appId).toBe(revenueManagerPluginSDK.client.appId)
        expect(result.selectors).toBeDefined()
      })
    })

    describe('optIn()', () => {
      test('should return plugin hook when called without args', () => {
        const hook = revenueManagerPluginSDK.optIn()
        expect(typeof hook).toBe('function')

        const result = hook()
        expect(result.appId).toBe(revenueManagerPluginSDK.client.appId)
        expect(result.selectors).toBeDefined()
      })
    })

    describe('startEscrowDisbursement()', () => {
      test('should return plugin hook when called without args', () => {
        const hook = revenueManagerPluginSDK.startEscrowDisbursement()
        expect(typeof hook).toBe('function')

        const result = hook()
        expect(result.appId).toBe(revenueManagerPluginSDK.client.appId)
        expect(result.selectors).toBeDefined()
      })
    })

    describe('processEscrowAllocation()', () => {
      test('should return plugin hook when called without args', () => {
        const hook = revenueManagerPluginSDK.processEscrowAllocation()
        expect(typeof hook).toBe('function')

        const result = hook()
        expect(result.appId).toBe(revenueManagerPluginSDK.client.appId)
        expect(result.selectors).toBeDefined()
      })
    })
  })

  describe('UpdateAkitaDAOPluginSDK', () => {
    let updatePluginSDK: UpdateAkitaDAOPluginSDK

    beforeAll(() => {
      updatePluginSDK = akitaUniverse.updatePlugin
    })

    describe('updateAkitaDao()', () => {
      test('should return plugin hook when called without args', () => {
        const hook = updatePluginSDK.updateApp()
        expect(typeof hook).toBe('function')

        const result = hook()
        expect(result.appId).toBe(updatePluginSDK.client.appId)
        expect(result.selectors).toBeDefined()
      })
    })

    describe('updateAkitaDaoEscrowForApp()', () => {
      test('should return plugin hook when called with args', () => {
        const hook = updatePluginSDK.updateAkitaDaoEscrowForApp({
          appId: 12345n,
          newEscrow: 67890n,
        })

        expect(typeof hook).toBe('function')
        const result = hook()
        expect(result.appId).toBe(updatePluginSDK.client.appId)
      })
    })
  })

  describe('Plugin SDK Pattern', () => {
    /**
     * All plugin SDKs follow a consistent pattern:
     * 1. Calling method() without args returns a hook for method restrictions
     * 2. Calling method(args) returns a hook that can build transactions
     * 3. The hook returns { appId, selectors, getTxns }
     */

    test('plugins should follow consistent hook pattern', () => {
      const payPlugin = akitaUniverse.optInPlugin

      // Without args - for method restrictions
      const restrictionHook = payPlugin.optIn()
      const restrictionResult = restrictionHook()

      expect(restrictionResult).toHaveProperty('appId')
      expect(restrictionResult).toHaveProperty('selectors')
      expect(restrictionResult).toHaveProperty('getTxns')
      expect(Array.isArray(restrictionResult.selectors)).toBe(true)
    })

    test('plugin selectors should be Uint8Array of length 4', () => {
      const plugin = akitaUniverse.optInPlugin
      const hook = plugin.optIn()
      const result = hook()

      for (const selector of result.selectors) {
        expect(selector).toBeInstanceOf(Uint8Array)
        expect(selector.length).toBe(4)
      }
    })
  })
})

describe('Plugin SDK Integration with WalletSDK', () => {
  let deployer: algosdk.Account
  let user: algosdk.Account
  let akitaUniverse: AkitaUniverse
  let dispenser: algosdk.Address & TransactionSignerAccount & {
    account: SigningAccount;
  }
  let algorand: import('@algorandfoundation/algokit-utils').AlgorandClient

  beforeAll(async () => {
    await fixture.beforeEach()
    algorand = fixture.context.algorand
    dispenser = await algorand.account.dispenserFromEnvironment()

    const ctx = fixture.context
    deployer = await ctx.generateAccount({ initialFunds: algokit.microAlgos(2_000_000_000) })
    user = await ctx.generateAccount({ initialFunds: algokit.microAlgos(500_000_000) })

    await algorand.account.ensureFunded(deployer.addr, dispenser, (2000).algo())
    await algorand.account.ensureFunded(user.addr, dispenser, (500).algo())

    // Build the full Akita DAO universe
    akitaUniverse = await buildAkitaUniverse({
      fixture,
      sender: deployer.addr,
      signer: makeBasicAccountTransactionSigner(deployer),
      apps: {},
    })
  })

  describe('Plugin usage through WalletSDK', () => {
    test('should be able to build plugin transactions through wallet', async () => {
      const wallet = akitaUniverse.dao.wallet

      // Use the 'rec_krby' escrow where optInPlugin is already installed during buildAkitaUniverse
      const escrow = 'rec_krby'

      // Create a test asset to opt into (can't opt into asset 0 which is ALGO)
      const assetCreate = await algorand.send.assetCreate({
        sender: deployer.addr,
        signer: makeBasicAccountTransactionSigner(deployer),
        total: 1_000_000n,
        decimals: 0,
        assetName: 'Test Asset',
        unitName: 'TEST',
      })
      const testAssetId = BigInt(assetCreate.confirmation.assetIndex!)

      // Build a plugin transaction using usePlugin
      const buildResult = await wallet.build.usePlugin({
        sender: deployer.addr,
        signer: makeBasicAccountTransactionSigner(deployer),
        lease: 'test_lease',
        global: true,
        escrow,
        windowSize: 2000n,
        calls: [
          akitaUniverse.optInPlugin.optIn({
            sender: deployer.addr,
            signer: makeBasicAccountTransactionSigner(deployer),
            assets: [testAssetId],
          })
        ]
      })

      // Lease is returned as a 32-byte Uint8Array, decode and check prefix
      const leaseString = new TextDecoder().decode(buildResult.lease).replace(/\0+$/, '')
      expect(leaseString).toBe('test_lease')
      expect(buildResult.ids).toBeDefined()
      expect(buildResult.atcs).toBeDefined()
      expect(buildResult.atcs.length).toBeGreaterThan(0)
    })
  })
})

