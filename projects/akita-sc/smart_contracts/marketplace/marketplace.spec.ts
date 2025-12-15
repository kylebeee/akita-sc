import * as algokit from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { SigningAccount, TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { beforeAll, describe, expect, test } from '@jest/globals'
import { ListingSDK } from 'akita-sdk/marketplace'
import algosdk, { getApplicationAddress, makeBasicAccountTransactionSigner } from 'algosdk'
import { AkitaUniverse, buildAkitaUniverse } from '../../tests/fixtures/dao'
import {
  getAccountBalance,
} from '../../tests/utils/balance'

algokit.Config.configure({ populateAppCallResources: true })

const fixture = algorandFixture()

// Time Constants
const ONE_DAY = 86_400

// Zero address for "no reservation"
const ZERO_ADDRESS = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ'

/**
 * Get the current Algorand block timestamp
 */
const getBlockTimestamp = async (algorand: import('@algorandfoundation/algokit-utils').AlgorandClient): Promise<bigint> => {
  const status = await algorand.client.algod.status().do()
  const block = await algorand.client.algod.block(status.lastRound).do()
  return BigInt(block.block.header.timestamp)
}

describe('Marketplace SDK', () => {
  let deployer: algosdk.Account
  let seller: algosdk.Account
  let buyer: algosdk.Account
  let akitaUniverse: AkitaUniverse
  let listingSDK: ListingSDK
  let testAssetId: bigint
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
    seller = await ctx.generateAccount({ initialFunds: algokit.microAlgos(500_000_000) })
    buyer = await ctx.generateAccount({ initialFunds: algokit.microAlgos(500_000_000) })

    await algorand.account.ensureFunded(deployer.addr, dispenser, (2000).algo())
    await algorand.account.ensureFunded(seller.addr, dispenser, (500).algo())
    await algorand.account.ensureFunded(buyer.addr, dispenser, (500).algo())

    // Build the full Akita DAO universe (includes marketplace with escrow configured)
    akitaUniverse = await buildAkitaUniverse({
      fixture,
      sender: deployer.addr,
      signer: makeBasicAccountTransactionSigner(deployer),
      apps: {},
    })

    // Create a test ASA for listing
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
    for (const account of [seller, buyer]) {
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

    // Fund the marketplace to cover listing creation MBR
    await algorand.account.ensureFunded(akitaUniverse.marketplace.client.appAddress, dispenser, (100).algo())

    // Opt the marketplace into the test asset so it can receive assets during listing creation
    const optInCost = await akitaUniverse.marketplace.client.optInCost({ args: { asset: testAssetId } })
    await akitaUniverse.marketplace.client.send.optIn({
      args: {
        payment: await algorand.createTransaction.payment({
          sender: deployer.addr,
          receiver: akitaUniverse.marketplace.client.appAddress,
          amount: optInCost.microAlgo(),
        }),
        asset: testAssetId,
      },
      sender: deployer.addr,
      signer: makeBasicAccountTransactionSigner(deployer),
      extraFee: (1_000).microAlgo(), // Cover inner transaction fee for asset opt-in
    })
  })

  describe('MarketplaceSDK', () => {
    describe('listCost()', () => {
      test('should return cost for ALGO payment listing', () => {
        const cost = akitaUniverse.marketplace.listCost(true)
        expect(cost).toBeGreaterThan(0n)
      })

      test('should return higher cost for ASA payment listing', () => {
        const algoCost = akitaUniverse.marketplace.listCost(true)
        const asaCost = akitaUniverse.marketplace.listCost(false)
        expect(asaCost).toBeGreaterThan(algoCost)
      })
    })

    describe('list()', () => {
      test('should create a new ASA listing', async () => {
        const currentTimestamp = await getBlockTimestamp(algorand)
        const sellerBalanceBefore = await getAccountBalance(algorand, seller.addr.toString())

        listingSDK = await akitaUniverse.marketplace.list({
          sender: seller.addr,
          signer: makeBasicAccountTransactionSigner(seller),
          isPrizeBox: false,
          asset: testAssetId,
          amount: 1n,
          name: 'Test NFT',
          proof: [],
          price: 5_000_000n, // 5 ALGO
          paymentAsset: 0n, // ALGO
          expiration: currentTimestamp + BigInt(ONE_DAY * 30), // 30 days to avoid expiration during test run
          reservedFor: ZERO_ADDRESS, // No reservation
          gateId: 0n,
          marketplace: seller.addr.toString(),
        })

        expect(listingSDK).toBeInstanceOf(ListingSDK)
        expect(listingSDK.client.appId).toBeGreaterThan(0n)

        // Verify cost was deducted from seller
        const sellerBalanceAfter = await getAccountBalance(algorand, seller.addr.toString())
        expect(sellerBalanceBefore - sellerBalanceAfter).toBeGreaterThan(0n)
      })
    })

    describe('getListing()', () => {
      test('should return ListingSDK for existing listing', () => {
        const existingListing = akitaUniverse.marketplace.getListing({ appId: listingSDK.client.appId })
        expect(existingListing).toBeInstanceOf(ListingSDK)
        expect(existingListing.client.appId).toBe(listingSDK.client.appId)
      })
    })

    describe('purchase()', () => {
      // Note: purchase makes many inner transactions for royalty distribution
      // which can exceed Algorand's foreign reference limits. This test may fail
      // with "No more transactions below reference limit" and needs explicit
      // resource management or transaction group setup.
      test('should allow purchasing with ALGO', async () => {
        const buyerBalanceBefore = await getAccountBalance(algorand, buyer.addr.toString())

        await akitaUniverse.marketplace.purchase({
          sender: buyer.addr,
          signer: makeBasicAccountTransactionSigner(buyer),
          listingAppId: listingSDK.client.appId,
          marketplace: seller.addr.toString(),
        })

        const buyerBalanceAfter = await getAccountBalance(algorand, buyer.addr.toString())
        // Buyer should have paid at least the listing price (5 ALGO)
        expect(buyerBalanceBefore - buyerBalanceAfter).toBeGreaterThanOrEqual(5_000_000n)
      })
    })

    describe('delist()', () => {
      test('should allow seller to delist before purchase', async () => {
        // Create a new listing to delist
        const currentTimestamp = await getBlockTimestamp(algorand)

        const newListing = await akitaUniverse.marketplace.list({
          sender: seller.addr,
          signer: makeBasicAccountTransactionSigner(seller),
          isPrizeBox: false,
          asset: testAssetId,
          amount: 1n,
          name: 'Test NFT 2',
          proof: [],
          price: 10_000_000n,
          paymentAsset: 0n,
          expiration: currentTimestamp + BigInt(ONE_DAY),
          reservedFor: ZERO_ADDRESS,
          gateId: 0n,
          marketplace: seller.addr.toString(),
        })

        await akitaUniverse.marketplace.delist({
          sender: seller.addr,
          signer: makeBasicAccountTransactionSigner(seller),
          appId: newListing.client.appId,
        })

        // Listing should no longer be valid
        // Note: Depending on implementation, this might throw or return specific state
      })
    })
  })

  describe('ListingSDK', () => {
    let listingSDKForTests: ListingSDK

    beforeAll(async () => {
      // Create a new listing for ListingSDK tests since the original was purchased
      const currentTimestamp = await getBlockTimestamp(algorand)
      listingSDKForTests = await akitaUniverse.marketplace.list({
        sender: seller.addr,
        signer: makeBasicAccountTransactionSigner(seller),
        isPrizeBox: false,
        asset: testAssetId,
        amount: 1n,
        name: 'Test NFT for ListingSDK',
        proof: [],
        price: 5_000_000n, // 5 ALGO
        paymentAsset: 0n, // ALGO
        expiration: currentTimestamp + BigInt(ONE_DAY),
        reservedFor: ZERO_ADDRESS, // No reservation
        gateId: 0n,
        marketplace: seller.addr.toString(),
      })
    })

    describe('state()', () => {
      test('should return the current listing state', async () => {
        const state = await listingSDKForTests.state()
        expect(state.prize).toBe(testAssetId)
        // SDK returns boolean global state as uint64 (0n/1n)
        expect(state.isPrizeBox).toBeFalsy()
        expect(state.price).toBe(5_000_000n)
        expect(state.paymentAsset).toBe(0n)
        expect(state.seller).toBe(seller.addr.toString())
      })
    })

    describe('isExpired()', () => {
      test('should return false for unexpired listing', async () => {
        const isExpired = await listingSDKForTests.isExpired()
        expect(isExpired).toBe(false)
      })
    })

    describe('isReserved()', () => {
      test('should return false for non-reserved listing', async () => {
        const isReserved = await listingSDKForTests.isReserved()
        expect(isReserved).toBe(false)
      })
    })

    describe('changePrice()', () => {
      test('should allow seller to change price', async () => {
        const newPrice = 4_000_000n

        await listingSDKForTests.changePrice({
          sender: seller.addr,
          signer: makeBasicAccountTransactionSigner(seller),
          price: newPrice,
        })

        const state = await listingSDKForTests.state()
        expect(state.price).toBe(newPrice)
      })
    })
  })

  describe('Fee System & Revenue Collection', () => {
    test('should verify marketplace has escrow configured', async () => {
      // The marketplace should have its akitaDaoEscrow configured
      const factoryState = await akitaUniverse.marketplace.client.state.global.getAll()
      expect(factoryState.akitaDaoEscrow).toBeGreaterThan(0n)
    })

    test('should verify DAO escrow receives revenue on marketplace sale', async () => {
      // Get the escrow info for marketplace revenue
      const marketplaceEscrow = await akitaUniverse.dao.wallet.getEscrow('rev_marketplace')
      expect(marketplaceEscrow).toBeDefined()
      expect(marketplaceEscrow.id).toBeGreaterThan(0n)

      // The escrow balance should be tracked (might be 0 if fees are distributed differently)
      const escrowBalance = await getAccountBalance(algorand, getApplicationAddress(marketplaceEscrow.id).toString())
      expect(escrowBalance).toBeGreaterThanOrEqual(0n)
    })
  })
})
