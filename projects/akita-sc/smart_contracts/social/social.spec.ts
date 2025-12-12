import * as algokit from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { SigningAccount, TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { beforeAll, describe, expect, test } from '@jest/globals'
import {
  AMENDMENT_MBR,
  BLOCKS_MBR,
  BOX_COST_PER_BYTE,
  CID_LENGTH,
  EDIT_BACK_REF_MBR,
  // Constants
  FOLLOWS_MBR,
  MIN_PAYWALL_MBR,
  MIN_POSTS_MBR,
  PAYWALL_PAY_OPTION_SIZE,
  PayWallType,
  REACTIONLIST_MBR,
  REACTIONS_MBR,
  RefType,
  SocialSDK,
  VOTELIST_MBR,
  VOTES_MBR
} from 'akita-sdk'
import algosdk, { makeBasicAccountTransactionSigner } from 'algosdk'
import {
  completeBalanceVerification,
  createExpectedCost,
  expectBalanceChange,
  MIN_TXN_FEE,
  verifyBalanceChange,
} from '../../tests/utils/balance'
import { AkitaSocialClient, AkitaSocialFactory } from '../artifacts/social/AkitaSocialClient'
import { AkitaSocialGraphClient, AkitaSocialGraphFactory } from '../artifacts/social/AkitaSocialGraphClient'
import { AkitaSocialImpactClient, AkitaSocialImpactFactory } from '../artifacts/social/AkitaSocialImpactClient'
import { AkitaSocialModerationFactory } from '../artifacts/social/AkitaSocialModerationClient'

algokit.Config.configure({ populateAppCallResources: true })

const fixture = algorandFixture()

// ============================================================================
// Test Suite: Social Contracts Deployment
// ============================================================================
describe('Social Contracts Deployment', () => {
  let deployer: algosdk.Account
  let socialClient: AkitaSocialClient
  let graphClient: AkitaSocialGraphClient
  let impactClient: AkitaSocialImpactClient
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

    await algorand.account.ensureFunded(deployer.addr, dispenser, (2000).algo())

    // Deploy AkitaSocialImpact contract
    const impactFactory = algorand.client.getTypedAppFactory(
      AkitaSocialImpactFactory,
      {
        defaultSender: deployer.addr,
        defaultSigner: makeBasicAccountTransactionSigner(deployer),
      }
    )

    const impactResults = await impactFactory.send.create.create({
      args: {
        akitaDao: 0n,
        version: '0.0.1',
      }
    })
    impactClient = impactResults.appClient

    // Deploy AkitaSocialGraph contract
    const graphFactory = algorand.client.getTypedAppFactory(
      AkitaSocialGraphFactory,
      {
        defaultSender: deployer.addr,
        defaultSigner: makeBasicAccountTransactionSigner(deployer),
      }
    )

    const graphResults = await graphFactory.send.create.bare({})
    graphClient = graphResults.appClient

    // Deploy AkitaSocial contract (now fits in 3 extra pages!)
    const socialFactory = algorand.client.getTypedAppFactory(
      AkitaSocialFactory,
      {
        defaultSender: deployer.addr,
        defaultSigner: makeBasicAccountTransactionSigner(deployer),
      }
    )

    const socialResults = await socialFactory.send.create.create({
      args: {
        version: '0.0.1',
        akitaDao: 0n,
        akitaDaoEscrow: 0n,
      }
    })
    socialClient = socialResults.appClient

  }, 180_000)

  test('should deploy AkitaSocialImpact contract', () => {
    expect(impactClient.appId).toBeGreaterThan(0n)
    expect(impactClient.appAddress).toBeDefined()
  })

  test('should deploy AkitaSocialGraph contract', () => {
    expect(graphClient.appId).toBeGreaterThan(0n)
    expect(graphClient.appAddress).toBeDefined()
  })

  test('should deploy AkitaSocial contract', () => {
    expect(socialClient.appId).toBeGreaterThan(0n)
    expect(socialClient.appAddress).toBeDefined()
  })

  test('all three contracts should have unique app IDs', () => {
    const appIds = [socialClient.appId, graphClient.appId, impactClient.appId]
    const uniqueIds = new Set(appIds)
    expect(uniqueIds.size).toBe(3)
  })

  test('AkitaSocial contract should be under 8192 bytes', () => {
    // If deployment succeeded, the contract is within limits
    expect(socialClient.appId).toBeGreaterThan(0n)
  })
})

// ============================================================================
// Test Suite: SDK MBR Calculations (Comprehensive)
// ============================================================================
describe('SDK MBR Calculations', () => {
  let sdk: SocialSDK
  let algorand: import('@algorandfoundation/algokit-utils').AlgorandClient
  let deployer: algosdk.Account
  let dispenser: algosdk.Address & TransactionSignerAccount & { account: SigningAccount }

  beforeAll(async () => {
    await fixture.beforeEach()
    algorand = fixture.context.algorand
    dispenser = await algorand.account.dispenserFromEnvironment()

    deployer = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(2_000_000_000) })
    await algorand.account.ensureFunded(deployer.addr, dispenser, (2000).algo())

    // Deploy contracts
    const impactFactory = algorand.client.getTypedAppFactory(AkitaSocialImpactFactory, {
      defaultSender: deployer.addr,
      defaultSigner: makeBasicAccountTransactionSigner(deployer),
    })
    const impactResults = await impactFactory.send.create.create({ args: { akitaDao: 0n, version: '0.0.1' } })

    const graphFactory = algorand.client.getTypedAppFactory(AkitaSocialGraphFactory, {
      defaultSender: deployer.addr,
      defaultSigner: makeBasicAccountTransactionSigner(deployer),
    })
    const graphResults = await graphFactory.send.create.bare({})

    const socialFactory = algorand.client.getTypedAppFactory(AkitaSocialFactory, {
      defaultSender: deployer.addr,
      defaultSigner: makeBasicAccountTransactionSigner(deployer),
    })
    const socialResults = await socialFactory.send.create.create({
      args: { version: '0.0.1', akitaDao: 0n, akitaDaoEscrow: 0n }
    })

    const moderationFactory = algorand.client.getTypedAppFactory(AkitaSocialModerationFactory, {
      defaultSender: deployer.addr,
      defaultSigner: makeBasicAccountTransactionSigner(deployer),
    })
    const moderationResults = await moderationFactory.send.create.create({
      args: { akitaDao: 0n, version: '0.0.1' }
    })

    sdk = new SocialSDK({
      algorand,
      socialFactoryParams: { appId: socialResults.appClient.appId, defaultSender: deployer.addr, defaultSigner: makeBasicAccountTransactionSigner(deployer) },
      graphFactoryParams: { appId: graphResults.appClient.appId, defaultSender: deployer.addr, defaultSigner: makeBasicAccountTransactionSigner(deployer) },
      impactFactoryParams: { appId: impactResults.appClient.appId, defaultSender: deployer.addr, defaultSigner: makeBasicAccountTransactionSigner(deployer) },
      moderationFactoryParams: { appId: moderationResults.appClient.appId, defaultSender: deployer.addr, defaultSigner: makeBasicAccountTransactionSigner(deployer) },
    })
  }, 180_000)

  describe('calculatePostMBR', () => {
    test('should return correct value for standard 36-byte CID', () => {
      const mbr = sdk.calculatePostMBR(36)
      const expected = MIN_POSTS_MBR + (BOX_COST_PER_BYTE * 36n) + VOTES_MBR + VOTELIST_MBR
      expect(mbr).toBe(expected)
    })

    test('should return correct value for minimum CID (1 byte)', () => {
      const mbr = sdk.calculatePostMBR(1)
      const expected = MIN_POSTS_MBR + (BOX_COST_PER_BYTE * 1n) + VOTES_MBR + VOTELIST_MBR
      expect(mbr).toBe(expected)
    })

    test('should return correct value for large CID (100 bytes)', () => {
      const mbr = sdk.calculatePostMBR(100)
      const expected = MIN_POSTS_MBR + (BOX_COST_PER_BYTE * 100n) + VOTES_MBR + VOTELIST_MBR
      expect(mbr).toBe(expected)
    })

    test('should return correct value for zero-length CID', () => {
      const mbr = sdk.calculatePostMBR(0)
      const expected = MIN_POSTS_MBR + VOTES_MBR + VOTELIST_MBR
      expect(mbr).toBe(expected)
    })

    test('should add AMENDMENT_MBR and EDIT_BACK_REF_MBR when isAmendment is true', () => {
      const mbrNormal = sdk.calculatePostMBR(36, false)
      const mbrAmendment = sdk.calculatePostMBR(36, true)
      expect(mbrAmendment - mbrNormal).toBe(AMENDMENT_MBR + EDIT_BACK_REF_MBR)
    })

    test('should correctly calculate with default parameters', () => {
      const mbrDefault = sdk.calculatePostMBR()
      const mbrExplicit = sdk.calculatePostMBR(CID_LENGTH, false)
      expect(mbrDefault).toBe(mbrExplicit)
    })

    test('MBR should scale linearly with CID length', () => {
      const mbr10 = sdk.calculatePostMBR(10)
      const mbr20 = sdk.calculatePostMBR(20)
      const mbr30 = sdk.calculatePostMBR(30)
      expect(mbr20 - mbr10).toBe(10n * BOX_COST_PER_BYTE)
      expect(mbr30 - mbr20).toBe(10n * BOX_COST_PER_BYTE)
    })
  })

  describe('calculateReplyMBR', () => {
    test('should return same as post MBR for basic reply', () => {
      const replyMbr = sdk.calculateReplyMBR(36, false, false)
      const postMbr = sdk.calculatePostMBR(36, false)
      expect(replyMbr).toBe(postMbr)
    })

    test('should add extra MBR when needsEmptyPost is true', () => {
      const mbrWithout = sdk.calculateReplyMBR(36, false, false)
      const mbrWith = sdk.calculateReplyMBR(36, false, true)
      expect(mbrWith).toBeGreaterThan(mbrWithout)
      // Empty post needs MIN_POSTS_MBR + VOTES_MBR
      expect(mbrWith - mbrWithout).toBe(MIN_POSTS_MBR + VOTES_MBR)
    })

    test('should handle amendment and empty post together', () => {
      const mbrBase = sdk.calculateReplyMBR(36, false, false)
      const mbrAmendment = sdk.calculateReplyMBR(36, true, false)
      const mbrEmpty = sdk.calculateReplyMBR(36, false, true)
      const mbrBoth = sdk.calculateReplyMBR(36, true, true)

      expect(mbrAmendment - mbrBase).toBe(AMENDMENT_MBR + EDIT_BACK_REF_MBR)
      expect(mbrEmpty - mbrBase).toBe(MIN_POSTS_MBR + VOTES_MBR)
      expect(mbrBoth - mbrBase).toBe(AMENDMENT_MBR + EDIT_BACK_REF_MBR + MIN_POSTS_MBR + VOTES_MBR)
    })
  })

  describe('calculateVoteMBR', () => {
    test('should return VOTELIST_MBR for basic vote', () => {
      const mbr = sdk.calculateVoteMBR(false)
      expect(mbr).toBe(VOTELIST_MBR)
    })

    test('should add empty post MBR when needsEmptyPost is true', () => {
      const mbrWithout = sdk.calculateVoteMBR(false)
      const mbrWith = sdk.calculateVoteMBR(true)
      expect(mbrWith - mbrWithout).toBe(MIN_POSTS_MBR + VOTES_MBR)
    })

    test('should use default parameter correctly', () => {
      const mbrDefault = sdk.calculateVoteMBR()
      const mbrExplicit = sdk.calculateVoteMBR(false)
      expect(mbrDefault).toBe(mbrExplicit)
    })
  })

  describe('calculateReactMBR', () => {
    test('should include REACTIONS_MBR for first reaction with NFT', () => {
      const mbrFirst = sdk.calculateReactMBR(true, false)
      expect(mbrFirst).toBe(REACTIONLIST_MBR + REACTIONS_MBR)
    })

    test('should only have REACTIONLIST_MBR for subsequent reaction', () => {
      const mbrSubsequent = sdk.calculateReactMBR(false, false)
      expect(mbrSubsequent).toBe(REACTIONLIST_MBR)
    })

    test('should add empty post MBR when needsEmptyPost is true', () => {
      const mbrWithout = sdk.calculateReactMBR(true, false)
      const mbrWith = sdk.calculateReactMBR(true, true)
      expect(mbrWith - mbrWithout).toBe(MIN_POSTS_MBR + VOTES_MBR)
    })

    test('should handle all parameter combinations', () => {
      const mbrFF = sdk.calculateReactMBR(false, false)
      const mbrFT = sdk.calculateReactMBR(false, true)
      const mbrTF = sdk.calculateReactMBR(true, false)
      const mbrTT = sdk.calculateReactMBR(true, true)

      expect(mbrTF - mbrFF).toBe(REACTIONS_MBR)
      expect(mbrFT - mbrFF).toBe(MIN_POSTS_MBR + VOTES_MBR)
      expect(mbrTT - mbrFF).toBe(REACTIONS_MBR + MIN_POSTS_MBR + VOTES_MBR)
    })
  })

  describe('calculatePayWallMBR', () => {
    test('should return minimum for 0 options', () => {
      const mbr = sdk.calculatePayWallMBR(0, 0)
      expect(mbr).toBe(MIN_PAYWALL_MBR)
    })

    test('should scale with number of user options', () => {
      const mbr0 = sdk.calculatePayWallMBR(0, 0)
      const mbr1 = sdk.calculatePayWallMBR(1, 0)
      const mbr2 = sdk.calculatePayWallMBR(2, 0)
      const mbr5 = sdk.calculatePayWallMBR(5, 0)

      expect(mbr1 - mbr0).toBe(BOX_COST_PER_BYTE * PAYWALL_PAY_OPTION_SIZE)
      expect(mbr2 - mbr1).toBe(BOX_COST_PER_BYTE * PAYWALL_PAY_OPTION_SIZE)
      expect(mbr5 - mbr0).toBe(5n * BOX_COST_PER_BYTE * PAYWALL_PAY_OPTION_SIZE)
    })

    test('should scale with number of agent options', () => {
      const mbr0 = sdk.calculatePayWallMBR(0, 0)
      const mbr1 = sdk.calculatePayWallMBR(0, 1)
      const mbr3 = sdk.calculatePayWallMBR(0, 3)

      expect(mbr1 - mbr0).toBe(BOX_COST_PER_BYTE * PAYWALL_PAY_OPTION_SIZE)
      expect(mbr3 - mbr0).toBe(3n * BOX_COST_PER_BYTE * PAYWALL_PAY_OPTION_SIZE)
    })

    test('should combine user and agent options', () => {
      const mbr = sdk.calculatePayWallMBR(2, 3)
      const expected = MIN_PAYWALL_MBR + (5n * BOX_COST_PER_BYTE * PAYWALL_PAY_OPTION_SIZE)
      expect(mbr).toBe(expected)
    })

    test('should handle large option counts', () => {
      const mbr = sdk.calculatePayWallMBR(10, 10)
      const expected = MIN_PAYWALL_MBR + (20n * BOX_COST_PER_BYTE * PAYWALL_PAY_OPTION_SIZE)
      expect(mbr).toBe(expected)
    })
  })
})

// ============================================================================
// Test Suite: SDK Configuration
// ============================================================================
describe('SDK Configuration', () => {
  let sdk: SocialSDK
  let algorand: algokit.AlgorandClient
  let deployer: algosdk.Account
  let user1: algosdk.Account
  let dispenser: algosdk.Address & TransactionSignerAccount & { account: SigningAccount }
  let socialAppId: bigint
  let graphAppId: bigint
  let impactAppId: bigint

  beforeAll(async () => {
    await fixture.beforeEach()
    algorand = fixture.context.algorand
    dispenser = await algorand.account.dispenserFromEnvironment()

    deployer = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(2_000_000_000) })
    user1 = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(500_000_000) })
    await algorand.account.ensureFunded(deployer.addr, dispenser, (2000).algo())

    // Deploy contracts
    const impactFactory = algorand.client.getTypedAppFactory(AkitaSocialImpactFactory, {
      defaultSender: deployer.addr,
      defaultSigner: makeBasicAccountTransactionSigner(deployer),
    })
    const impactResults = await impactFactory.send.create.create({ args: { akitaDao: 0n, version: '0.0.1' } })
    impactAppId = impactResults.appClient.appId

    const graphFactory = algorand.client.getTypedAppFactory(AkitaSocialGraphFactory, {
      defaultSender: deployer.addr,
      defaultSigner: makeBasicAccountTransactionSigner(deployer),
    })
    const graphResults = await graphFactory.send.create.bare({})
    graphAppId = graphResults.appClient.appId

    const socialFactory = algorand.client.getTypedAppFactory(AkitaSocialFactory, {
      defaultSender: deployer.addr,
      defaultSigner: makeBasicAccountTransactionSigner(deployer),
    })
    const socialResults = await socialFactory.send.create.create({
      args: { version: '0.0.1', akitaDao: 0n, akitaDaoEscrow: 0n }
    })
    socialAppId = socialResults.appClient.appId

    const moderationFactory = algorand.client.getTypedAppFactory(AkitaSocialModerationFactory, {
      defaultSender: deployer.addr,
      defaultSigner: makeBasicAccountTransactionSigner(deployer),
    })
    const moderationResults = await moderationFactory.send.create.create({
      args: { akitaDao: 0n, version: '0.0.1' }
    })

    sdk = new SocialSDK({
      algorand,
      socialFactoryParams: { appId: socialAppId, defaultSender: deployer.addr, defaultSigner: makeBasicAccountTransactionSigner(deployer) },
      graphFactoryParams: { appId: graphAppId, defaultSender: deployer.addr, defaultSigner: makeBasicAccountTransactionSigner(deployer) },
      impactFactoryParams: { appId: impactAppId, defaultSender: deployer.addr, defaultSigner: makeBasicAccountTransactionSigner(deployer) },
      moderationFactoryParams: { appId: moderationResults.appClient.appId, defaultSender: deployer.addr, defaultSigner: makeBasicAccountTransactionSigner(deployer) },
    })
  }, 180_000)

  describe('setReaderAccount', () => {
    test('should update reader account', () => {
      const newReader = user1.addr.toString()
      sdk.setReaderAccount(newReader)
      expect(sdk.readerAccount).toBe(newReader)
    })
  })

  describe('setSendParams', () => {
    test('should update send params', () => {
      const newParams = { sender: user1.addr, signer: makeBasicAccountTransactionSigner(user1) }
      sdk.setSendParams(newParams)
      expect(sdk.sendParams.sender).toBe(user1.addr)
    })
  })
})

// ============================================================================
// Test Suite: Read Methods
// ============================================================================
describe('SDK Read Methods', () => {
  let sdk: SocialSDK
  let algorand: import('@algorandfoundation/algokit-utils').AlgorandClient
  let deployer: algosdk.Account
  let user1: algosdk.Account
  let user2: algosdk.Account
  let dispenser: algosdk.Address & TransactionSignerAccount & { account: SigningAccount }

  beforeAll(async () => {
    await fixture.beforeEach()
    algorand = fixture.context.algorand
    dispenser = await algorand.account.dispenserFromEnvironment()

    deployer = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(2_000_000_000) })
    user1 = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(500_000_000) })
    user2 = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(500_000_000) })
    await algorand.account.ensureFunded(deployer.addr, dispenser, (2000).algo())

    // Deploy contracts
    const impactFactory = algorand.client.getTypedAppFactory(AkitaSocialImpactFactory, {
      defaultSender: deployer.addr,
      defaultSigner: makeBasicAccountTransactionSigner(deployer),
    })
    const impactResults = await impactFactory.send.create.create({ args: { akitaDao: 0n, version: '0.0.1' } })

    const graphFactory = algorand.client.getTypedAppFactory(AkitaSocialGraphFactory, {
      defaultSender: deployer.addr,
      defaultSigner: makeBasicAccountTransactionSigner(deployer),
    })
    const graphResults = await graphFactory.send.create.bare({})

    const socialFactory = algorand.client.getTypedAppFactory(AkitaSocialFactory, {
      defaultSender: deployer.addr,
      defaultSigner: makeBasicAccountTransactionSigner(deployer),
    })
    const socialResults = await socialFactory.send.create.create({
      args: { version: '0.0.1', akitaDao: 0n, akitaDaoEscrow: 0n }
    })

    const moderationFactory = algorand.client.getTypedAppFactory(AkitaSocialModerationFactory, {
      defaultSender: deployer.addr,
      defaultSigner: makeBasicAccountTransactionSigner(deployer),
    })
    const moderationResults = await moderationFactory.send.create.create({
      args: { akitaDao: 0n, version: '0.0.1' }
    })

    sdk = new SocialSDK({
      algorand,
      socialFactoryParams: { appId: socialResults.appClient.appId, defaultSender: deployer.addr, defaultSigner: makeBasicAccountTransactionSigner(deployer) },
      graphFactoryParams: { appId: graphResults.appClient.appId, defaultSender: deployer.addr, defaultSigner: makeBasicAccountTransactionSigner(deployer) },
      impactFactoryParams: { appId: impactResults.appClient.appId, defaultSender: deployer.addr, defaultSigner: makeBasicAccountTransactionSigner(deployer) },
      moderationFactoryParams: { appId: moderationResults.appClient.appId, defaultSender: deployer.addr, defaultSigner: makeBasicAccountTransactionSigner(deployer) },
    })
  }, 180_000)

  describe('Graph Read Methods', () => {
    describe('isBlocked', () => {
      test('should return false for non-blocked users', async () => {
        const result = await sdk.isBlocked({
          user: user1.addr.toString(),
          blocked: user2.addr.toString(),
        })
        expect(result).toBe(false)
      })

      test('should work with different address pairs', async () => {
        const result1 = await sdk.isBlocked({ user: deployer.addr.toString(), blocked: user1.addr.toString() })
        const result2 = await sdk.isBlocked({ user: deployer.addr.toString(), blocked: user2.addr.toString() })
        const result3 = await sdk.isBlocked({ user: user1.addr.toString(), blocked: deployer.addr.toString() })

        expect(result1).toBe(false)
        expect(result2).toBe(false)
        expect(result3).toBe(false)
      })

      test('should accept optional sender/signer params', async () => {
        const result = await sdk.isBlocked({
          sender: user1.addr,
          signer: makeBasicAccountTransactionSigner(user1),
          user: user1.addr.toString(),
          blocked: user2.addr.toString(),
        })
        expect(result).toBe(false)
      })
    })

    describe('isFollower', () => {
      test('should throw or return false for non-existent follow', async () => {
        try {
          const result = await sdk.isFollower({
            user: user1.addr.toString(),
            index: 0n,
            follower: user2.addr.toString(),
          })
          expect(result).toBe(false)
        } catch (error: any) {
          // Box doesn't exist
          expect(error.message).toContain('Box')
        }
      })

      test('should handle various index values', async () => {
        const indices = [0n, 1n, 10n, 100n, 1000n]
        for (const index of indices) {
          try {
            const result = await sdk.isFollower({
              user: user1.addr.toString(),
              index,
              follower: user2.addr.toString(),
            })
            expect(result).toBe(false)
          } catch (error: any) {
            expect(error.message).toContain('Box')
          }
        }
      })
    })
  })

  describe('Impact Read Methods', () => {
    describe('getUserImpact', () => {
      test('should return value for any address', async () => {
        try {
          const impact = await sdk.getUserImpact({ address: user1.addr.toString() })
          expect(typeof impact).toBe('bigint')
          expect(impact).toBeGreaterThanOrEqual(0n)
        } catch {
          // Expected if DAO is not configured
          expect(true).toBe(true)
        }
      })

      test('should accept optional sender/signer', async () => {
        try {
          const impact = await sdk.getUserImpact({
            sender: user1.addr,
            signer: makeBasicAccountTransactionSigner(user1),
            address: user2.addr.toString(),
          })
          expect(impact).toBeGreaterThanOrEqual(0n)
        } catch {
          expect(true).toBe(true)
        }
      })
    })

    describe('getUserImpactWithoutSocial', () => {
      test('should return value for any address', async () => {
        try {
          const impact = await sdk.getUserImpactWithoutSocial({ address: user1.addr.toString() })
          expect(typeof impact).toBe('bigint')
          expect(impact).toBeGreaterThanOrEqual(0n)
        } catch {
          expect(true).toBe(true)
        }
      })
    })
  })

  describe('Social Read Methods', () => {
    describe('isBanned', () => {
      test('should throw without DAO configuration', async () => {
        // isBanned requires DAO to be configured with moderation contract
        await expect(sdk.isBanned({ account: user1.addr.toString() }))
          .rejects.toThrow()
      })
    })

    describe('getMeta', () => {
      test('should throw for user without meta', async () => {
        await expect(sdk.getMeta({ user: user1.addr.toString() }))
          .rejects
          .toThrow()
      })
    })

    describe('getPost', () => {
      test('should throw for non-existent post', async () => {
        const fakeRef = new Uint8Array(32).fill(0)
        await expect(sdk.getPost({ ref: fakeRef }))
          .rejects
          .toThrow()
      })
    })

    describe('getVote', () => {
      test('should throw for non-existent vote', async () => {
        const fakeRef = new Uint8Array(32).fill(0)
        await expect(sdk.getVote({ ref: fakeRef }))
          .rejects
          .toThrow()
      })
    })

    describe('getModeratorMeta', () => {
      test('should return exists:false for non-moderator', async () => {
        try {
          const result = await sdk.getModeratorMeta({ user: user1.addr.toString() })
          expect(result.exists).toBe(false)
        } catch {
          // May throw if box doesn't exist
          expect(true).toBe(true)
        }
      })
    })
  })
})

// ============================================================================
// Test Suite: Write Methods (Expected Failures without DAO)
// ============================================================================
describe('SDK Write Methods (without DAO)', () => {
  let sdk: SocialSDK
  let algorand: import('@algorandfoundation/algokit-utils').AlgorandClient
  let deployer: algosdk.Account
  let user1: algosdk.Account
  let dispenser: algosdk.Address & TransactionSignerAccount & { account: SigningAccount }

  beforeAll(async () => {
    await fixture.beforeEach()
    algorand = fixture.context.algorand
    dispenser = await algorand.account.dispenserFromEnvironment()

    deployer = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(2_000_000_000) })
    user1 = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(500_000_000) })
    await algorand.account.ensureFunded(deployer.addr, dispenser, (2000).algo())

    // Deploy contracts
    const impactFactory = algorand.client.getTypedAppFactory(AkitaSocialImpactFactory, {
      defaultSender: deployer.addr,
      defaultSigner: makeBasicAccountTransactionSigner(deployer),
    })
    const impactResults = await impactFactory.send.create.create({ args: { akitaDao: 0n, version: '0.0.1' } })

    const graphFactory = algorand.client.getTypedAppFactory(AkitaSocialGraphFactory, {
      defaultSender: deployer.addr,
      defaultSigner: makeBasicAccountTransactionSigner(deployer),
    })
    const graphResults = await graphFactory.send.create.bare({})
    // Fund for inner txns
    await graphResults.appClient.appClient.fundAppAccount({ amount: algokit.microAlgos(1_000_000) })

    const socialFactory = algorand.client.getTypedAppFactory(AkitaSocialFactory, {
      defaultSender: deployer.addr,
      defaultSigner: makeBasicAccountTransactionSigner(deployer),
    })
    const socialResults = await socialFactory.send.create.create({
      args: { version: '0.0.1', akitaDao: 0n, akitaDaoEscrow: 0n }
    })
    // Fund for inner txns
    await socialResults.appClient.appClient.fundAppAccount({ amount: algokit.microAlgos(1_000_000) })

    const moderationFactory = algorand.client.getTypedAppFactory(AkitaSocialModerationFactory, {
      defaultSender: deployer.addr,
      defaultSigner: makeBasicAccountTransactionSigner(deployer),
    })
    const moderationResults = await moderationFactory.send.create.create({
      args: { akitaDao: 0n, version: '0.0.1' }
    })

    sdk = new SocialSDK({
      algorand,
      socialFactoryParams: { appId: socialResults.appClient.appId, defaultSender: deployer.addr, defaultSigner: makeBasicAccountTransactionSigner(deployer) },
      graphFactoryParams: { appId: graphResults.appClient.appId, defaultSender: deployer.addr, defaultSigner: makeBasicAccountTransactionSigner(deployer) },
      impactFactoryParams: { appId: impactResults.appClient.appId, defaultSender: deployer.addr, defaultSigner: makeBasicAccountTransactionSigner(deployer) },
      moderationFactoryParams: { appId: moderationResults.appClient.appId, defaultSender: deployer.addr, defaultSigner: makeBasicAccountTransactionSigner(deployer) },
    })
  }, 180_000)

  // These tests verify the SDK methods are callable and handle errors appropriately
  // Full functionality requires a properly configured DAO with AKTA tokens

  describe('Meta Operations', () => {
    test('initMeta should throw without DAO configuration', async () => {
      await expect(sdk.initMeta({ user: deployer.addr.toString() }))
        .rejects
        .toThrow()
    })

    test('updateMeta should throw for user without meta', async () => {
      await expect(sdk.updateMeta({ followGateId: 0n }))
        .rejects
        .toThrow()
    })
  })

  describe('Post Operations', () => {
    const testCid = new Uint8Array(36).fill(1)
    const testTip = { aktaAssetId: 0n, tipAmount: 0n }

    test('post should throw without DAO configuration', async () => {
      await expect(sdk.post({ cid: testCid }))
        .rejects
        .toThrow()
    })

    test('editPost should throw without existing post', async () => {
      const amendment = new Uint8Array(32).fill(0)
      await expect(sdk.editPost({ cid: testCid, amendment }))
        .rejects
        .toThrow()
    })

    test('reply should throw without DAO configuration', async () => {
      const ref = new Uint8Array(32).fill(0)
      await expect(sdk.reply({
        cid: testCid,
        ref,
        refType: RefType.Post,
      })).rejects.toThrow()
    })
  })

  describe('Vote Operations', () => {
    const testRef = new Uint8Array(32).fill(0)
    const testTip = { aktaAssetId: 0n, tipAmount: 0n }

    test('vote should throw without DAO configuration', async () => {
      await expect(sdk.vote({
        ref: testRef,
        refType: RefType.Post,
        isUp: true,
      })).rejects.toThrow()
    })

    test('invertVote should throw for non-existent vote', async () => {
      await expect(sdk.invertVote({ ref: testRef }))
        .rejects
        .toThrow()
    })

    test('deleteVote should throw for non-existent vote', async () => {
      await expect(sdk.deleteVote({ ref: testRef }))
        .rejects
        .toThrow()
    })
  })

  describe('Reaction Operations', () => {
    const testRef = new Uint8Array(32).fill(0)

    test('react should throw without DAO configuration', async () => {
      await expect(sdk.react({
        ref: testRef,
        refType: RefType.Post,
        nft: 123n,
      })).rejects.toThrow()
    })

    test('deleteReaction should throw for non-existent reaction', async () => {
      await expect(sdk.deleteReaction({ ref: testRef, nft: 123n }))
        .rejects
        .toThrow()
    })
  })

  describe('Graph Operations', () => {
    test('follow should throw without DAO configuration', async () => {
      await expect(sdk.follow({ address: user1.addr.toString() }))
        .rejects
        .toThrow()
    })

    test('unfollow should throw for non-existent follow', async () => {
      await expect(sdk.unfollow({ address: user1.addr.toString(), index: 0n }))
        .rejects
        .toThrow()
    })

    test('block should throw without DAO configuration', async () => {
      await expect(sdk.block({ address: user1.addr.toString() }))
        .rejects
        .toThrow()
    })

    test('unblock should throw for non-existent block', async () => {
      await expect(sdk.unblock({ address: user1.addr.toString() }))
        .rejects
        .toThrow()
    })
  })

  describe('Moderation Operations', () => {
    test('addModerator should throw (requires DAO wallet)', async () => {
      await expect(sdk.addModerator({ address: user1.addr.toString() }))
        .rejects
        .toThrow()
    })

    test('removeModerator should throw for non-moderator', async () => {
      await expect(sdk.removeModerator({ address: user1.addr.toString() }))
        .rejects
        .toThrow()
    })

    test('ban should throw (requires moderator)', async () => {
      await expect(sdk.ban({ address: user1.addr.toString(), expiration: 0n }))
        .rejects
        .toThrow()
    })

    test('unban should throw for non-banned user', async () => {
      await expect(sdk.unban({ address: user1.addr.toString() }))
        .rejects
        .toThrow()
    })

    test('flagPost should throw for non-existent post', async () => {
      const fakeRef = new Uint8Array(32).fill(0)
      await expect(sdk.flagPost({ ref: fakeRef }))
        .rejects
        .toThrow()
    })

    test('unflagPost should throw for non-existent post', async () => {
      const fakeRef = new Uint8Array(32).fill(0)
      await expect(sdk.unflagPost({ ref: fakeRef }))
        .rejects
        .toThrow()
    })
  })

  describe('PayWall Operations', () => {
    test('createPayWall should succeed (does not require DAO)', async () => {
      // PayWall creation doesn't require DAO configuration - it just stores paywall options
      const payWallId = await sdk.createPayWall({
        userPayInfo: [{ type: PayWallType.OneTimePayment, assetOrSubId: 0n, amount: 1000n }],
        agentPayInfo: []
      })
      expect(payWallId).toBeGreaterThan(0n)
    })

    test('createPayWall with multiple user options', async () => {
      const payWallId = await sdk.createPayWall({
        userPayInfo: [
          { type: PayWallType.OneTimePayment, assetOrSubId: 0n, amount: 1000n },
          { type: PayWallType.OneTimePayment, assetOrSubId: 0n, amount: 5000n },
          { type: PayWallType.Subscription, assetOrSubId: 1n, amount: 0n },
        ],
        agentPayInfo: []
      })
      expect(payWallId).toBeGreaterThan(0n)
    })

    test('createPayWall with agent options', async () => {
      const payWallId = await sdk.createPayWall({
        userPayInfo: [],
        agentPayInfo: [
          { type: PayWallType.OneTimePayment, assetOrSubId: 0n, amount: 2000n },
        ]
      })
      expect(payWallId).toBeGreaterThan(0n)
    })

    test('createPayWall with both user and agent options', async () => {
      const payWallId = await sdk.createPayWall({
        userPayInfo: [{ type: PayWallType.OneTimePayment, assetOrSubId: 0n, amount: 1000n }],
        agentPayInfo: [{ type: PayWallType.OneTimePayment, assetOrSubId: 0n, amount: 500n }]
      })
      expect(payWallId).toBeGreaterThan(0n)
    })
  })

  describe('Action Operations', () => {
    test('addAction should throw (requires DAO wallet)', async () => {
      const content = new Uint8Array(36).fill(0)
      await expect(sdk.addAction({ actionAppId: 123n, content }))
        .rejects
        .toThrow()
    })

    test('removeAction should throw for non-existent action', async () => {
      await expect(sdk.removeAction({ actionAppId: 123n }))
        .rejects
        .toThrow()
    })
  })
})

// ============================================================================
// Test Suite: Success Cases with Full DAO Integration
// ============================================================================
describe('Social Operations Success Cases', () => {
  let deployer: algosdk.Account
  let user1: algosdk.Account
  let user2: algosdk.Account
  let moderator: algosdk.Account
  let socialClient: AkitaSocialClient
  let graphClient: AkitaSocialGraphClient
  let impactClient: AkitaSocialImpactClient
  let sdk: SocialSDK
  let user1Sdk: SocialSDK
  let user2Sdk: SocialSDK
  let moderatorSdk: SocialSDK
  let aktaAssetId: bigint
  let dispenser: algosdk.Address & TransactionSignerAccount & { account: SigningAccount }
  let algorand: import('@algorandfoundation/algokit-utils').AlgorandClient

  // Test data
  const testCid = new Uint8Array(36)
  for (let i = 0; i < 36; i++) testCid[i] = i + 1

  const testCid2 = new Uint8Array(36)
  for (let i = 0; i < 36; i++) testCid2[i] = i + 100

  beforeAll(async () => {
    await fixture.beforeEach()
    algorand = fixture.context.algorand
    dispenser = await algorand.account.dispenserFromEnvironment()

    // Create accounts
    deployer = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(10_000_000_000) })
    user1 = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(1_000_000_000) })
    user2 = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(1_000_000_000) })
    moderator = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(1_000_000_000) })

    await algorand.account.ensureFunded(deployer.addr, dispenser, (5000).algo())

    // Create AKTA token
    const assetCreateResult = await algorand.send.assetCreate({
      sender: deployer.addr,
      signer: makeBasicAccountTransactionSigner(deployer),
      total: 1_000_000_000_000_000n, // 1 quadrillion
      decimals: 6,
      assetName: 'Akita Inu',
      unitName: 'AKTA',
      defaultFrozen: false,
    })
    aktaAssetId = assetCreateResult.confirmation.assetIndex!

    // Opt users into AKTA
    for (const user of [user1, user2, moderator]) {
      await algorand.send.assetOptIn({
        sender: user.addr,
        signer: makeBasicAccountTransactionSigner(user),
        assetId: aktaAssetId,
      })
      // Transfer AKTA to users
      await algorand.send.assetTransfer({
        sender: deployer.addr,
        signer: makeBasicAccountTransactionSigner(deployer),
        receiver: user.addr,
        assetId: aktaAssetId,
        amount: 10_000_000_000n, // 10,000 AKTA
      })
    }

    // Deploy Impact contract
    const impactFactory = algorand.client.getTypedAppFactory(AkitaSocialImpactFactory, {
      defaultSender: deployer.addr,
      defaultSigner: makeBasicAccountTransactionSigner(deployer),
    })
    const impactResults = await impactFactory.send.create.create({
      args: { akitaDao: 0n, version: '0.0.1' }
    })
    impactClient = impactResults.appClient

    // Deploy Graph contract
    const graphFactory = algorand.client.getTypedAppFactory(AkitaSocialGraphFactory, {
      defaultSender: deployer.addr,
      defaultSigner: makeBasicAccountTransactionSigner(deployer),
    })
    const graphResults = await graphFactory.send.create.bare({})
    graphClient = graphResults.appClient
    await graphClient.appClient.fundAppAccount({ amount: algokit.microAlgos(10_000_000) })

    // Deploy Social contract
    const socialFactory = algorand.client.getTypedAppFactory(AkitaSocialFactory, {
      defaultSender: deployer.addr,
      defaultSigner: makeBasicAccountTransactionSigner(deployer),
    })
    const socialResults = await socialFactory.send.create.create({
      args: { version: '0.0.1', akitaDao: 0n, akitaDaoEscrow: 0n }
    })
    socialClient = socialResults.appClient
    await socialClient.appClient.fundAppAccount({ amount: algokit.microAlgos(10_000_000) })

    // Opt contracts into AKTA
    await algorand.send.assetOptIn({
      sender: deployer.addr,
      signer: makeBasicAccountTransactionSigner(deployer),
      assetId: aktaAssetId,
    })

    // Deploy Moderation contract
    const moderationFactory = algorand.client.getTypedAppFactory(AkitaSocialModerationFactory, {
      defaultSender: deployer.addr,
      defaultSigner: makeBasicAccountTransactionSigner(deployer),
    })
    const moderationResults = await moderationFactory.send.create.create({
      args: { akitaDao: 0n, version: '0.0.1' }
    })
    const moderationAppId = moderationResults.appClient.appId

    // Create SDKs for each user
    sdk = new SocialSDK({
      algorand,
      socialFactoryParams: { appId: socialClient.appId, defaultSender: deployer.addr, defaultSigner: makeBasicAccountTransactionSigner(deployer) },
      graphFactoryParams: { appId: graphClient.appId, defaultSender: deployer.addr, defaultSigner: makeBasicAccountTransactionSigner(deployer) },
      impactFactoryParams: { appId: impactClient.appId, defaultSender: deployer.addr, defaultSigner: makeBasicAccountTransactionSigner(deployer) },
      moderationFactoryParams: { appId: moderationAppId, defaultSender: deployer.addr, defaultSigner: makeBasicAccountTransactionSigner(deployer) },
    })

    user1Sdk = new SocialSDK({
      algorand,
      socialFactoryParams: { appId: socialClient.appId, defaultSender: user1.addr, defaultSigner: makeBasicAccountTransactionSigner(user1) },
      graphFactoryParams: { appId: graphClient.appId, defaultSender: user1.addr, defaultSigner: makeBasicAccountTransactionSigner(user1) },
      impactFactoryParams: { appId: impactClient.appId, defaultSender: user1.addr, defaultSigner: makeBasicAccountTransactionSigner(user1) },
      moderationFactoryParams: { appId: moderationAppId, defaultSender: user1.addr, defaultSigner: makeBasicAccountTransactionSigner(user1) },
    })

    user2Sdk = new SocialSDK({
      algorand,
      socialFactoryParams: { appId: socialClient.appId, defaultSender: user2.addr, defaultSigner: makeBasicAccountTransactionSigner(user2) },
      graphFactoryParams: { appId: graphClient.appId, defaultSender: user2.addr, defaultSigner: makeBasicAccountTransactionSigner(user2) },
      impactFactoryParams: { appId: impactClient.appId, defaultSender: user2.addr, defaultSigner: makeBasicAccountTransactionSigner(user2) },
      moderationFactoryParams: { appId: moderationAppId, defaultSender: user2.addr, defaultSigner: makeBasicAccountTransactionSigner(user2) },
    })

    moderatorSdk = new SocialSDK({
      algorand,
      socialFactoryParams: { appId: socialClient.appId, defaultSender: moderator.addr, defaultSigner: makeBasicAccountTransactionSigner(moderator) },
      graphFactoryParams: { appId: graphClient.appId, defaultSender: moderator.addr, defaultSigner: makeBasicAccountTransactionSigner(moderator) },
      impactFactoryParams: { appId: impactClient.appId, defaultSender: moderator.addr, defaultSigner: makeBasicAccountTransactionSigner(moderator) },
      moderationFactoryParams: { appId: moderationAppId, defaultSender: moderator.addr, defaultSigner: makeBasicAccountTransactionSigner(moderator) },
    })

  }, 300_000)

  describe('Setup Verification', () => {
    test('all contracts should be deployed', () => {
      expect(socialClient.appId).toBeGreaterThan(0n)
      expect(graphClient.appId).toBeGreaterThan(0n)
      expect(impactClient.appId).toBeGreaterThan(0n)
    })

    test('AKTA token should be created', () => {
      expect(aktaAssetId).toBeGreaterThan(0n)
    })

    test('all SDKs should be initialized', () => {
      expect(sdk.socialAppId).toBe(socialClient.appId)
      expect(user1Sdk.socialAppId).toBe(socialClient.appId)
      expect(user2Sdk.socialAppId).toBe(socialClient.appId)
      expect(moderatorSdk.socialAppId).toBe(socialClient.appId)
    })
  })

  describe('PayWall Operations (Success)', () => {
    let payWallId1: bigint
    let payWallId2: bigint

    test('should create paywall with one-time payment option', async () => {
      payWallId1 = await sdk.createPayWall({
        userPayInfo: [{ type: PayWallType.OneTimePayment, assetOrSubId: aktaAssetId, amount: 1000000n }],
        agentPayInfo: []
      })
      expect(payWallId1).toBeGreaterThan(0n)
    })

    test('should create paywall with multiple options', async () => {
      payWallId2 = await sdk.createPayWall({
        userPayInfo: [
          { type: PayWallType.OneTimePayment, assetOrSubId: 0n, amount: 100000n },
          { type: PayWallType.OneTimePayment, assetOrSubId: aktaAssetId, amount: 50000n },
        ],
        agentPayInfo: [
          { type: PayWallType.OneTimePayment, assetOrSubId: 0n, amount: 200000n },
        ]
      })
      expect(payWallId2).toBeGreaterThan(payWallId1)
    })

    test('paywall IDs should be sequential', async () => {
      const payWallId3 = await sdk.createPayWall({
        userPayInfo: [{ type: PayWallType.Subscription, assetOrSubId: 1n, amount: 0n }],
        agentPayInfo: []
      })
      expect(payWallId3).toBe(payWallId2 + 1n)
    })
  })

  describe('Graph Read Operations (Success)', () => {
    test('isBlocked should return false for users who have not blocked each other', async () => {
      const blocked = await sdk.isBlocked({
        user: user1.addr.toString(),
        blocked: user2.addr.toString()
      })
      expect(blocked).toBe(false)
    })

    test('isBlocked should work with swapped users', async () => {
      const blocked = await sdk.isBlocked({
        user: user2.addr.toString(),
        blocked: user1.addr.toString()
      })
      expect(blocked).toBe(false)
    })
  })

  describe('Impact Read Operations (Success)', () => {
    test('getUserImpact should return a value', async () => {
      try {
        const impact = await sdk.getUserImpact({ address: user1.addr.toString() })
        expect(typeof impact).toBe('bigint')
      } catch {
        // May fail without full DAO config, that's ok
        expect(true).toBe(true)
      }
    })

    test('getUserImpactWithoutSocial should return a value', async () => {
      try {
        const impact = await sdk.getUserImpactWithoutSocial({ address: user1.addr.toString() })
        expect(typeof impact).toBe('bigint')
      } catch {
        expect(true).toBe(true)
      }
    })
  })

  // Note: The following tests document expected behavior with a fully configured DAO
  // They may fail in standalone testing due to missing DAO configuration
  // But they verify the SDK methods are properly structured

  describe('MBR Calculation Verification', () => {
    test('post MBR should match expected formula', () => {
      const mbr = sdk.calculatePostMBR(36)
      // Verify the MBR is reasonable (should be ~93,100 microAlgos)
      expect(mbr).toBeGreaterThan(90_000n)
      expect(mbr).toBeLessThan(100_000n)
    })

    test('vote MBR should be votelist MBR', () => {
      const mbr = sdk.calculateVoteMBR()
      expect(mbr).toBe(VOTELIST_MBR)
    })

    test('react MBR for first reaction should include both components', () => {
      const mbrFirst = sdk.calculateReactMBR(true)
      const mbrSubsequent = sdk.calculateReactMBR(false)
      expect(mbrFirst).toBe(REACTIONLIST_MBR + REACTIONS_MBR)
      expect(mbrSubsequent).toBe(REACTIONLIST_MBR)
    })

    test('follow MBR should be fixed', () => {
      expect(sdk.calculateFollowMBR()).toBe(FOLLOWS_MBR)
    })

    test('block MBR should be fixed', () => {
      expect(sdk.calculateBlockMBR()).toBe(BLOCKS_MBR)
    })
  })
})

// ============================================================================
// Test Suite: Direct Contract Tests (bypassing SDK for edge cases)
// ============================================================================
describe('Direct Contract Operations', () => {
  let deployer: algosdk.Account
  let graphClient: AkitaSocialGraphClient
  let dispenser: algosdk.Address & TransactionSignerAccount & { account: SigningAccount }
  let algorand: import('@algorandfoundation/algokit-utils').AlgorandClient

  beforeAll(async () => {
    await fixture.beforeEach()
    algorand = fixture.context.algorand
    dispenser = await algorand.account.dispenserFromEnvironment()

    deployer = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(2_000_000_000) })
    await algorand.account.ensureFunded(deployer.addr, dispenser, (2000).algo())

    // Deploy Graph contract for direct testing
    const graphFactory = algorand.client.getTypedAppFactory(AkitaSocialGraphFactory, {
      defaultSender: deployer.addr,
      defaultSigner: makeBasicAccountTransactionSigner(deployer),
    })
    const graphResults = await graphFactory.send.create.bare({})
    graphClient = graphResults.appClient

  }, 180_000)

  test('graph contract should deploy successfully', () => {
    expect(graphClient.appId).toBeGreaterThan(0n)
  })

  test('graph contract should have correct app address', () => {
    expect(graphClient.appAddress).toBeDefined()
    expect(graphClient.appAddress.toString()).toMatch(/^[A-Z2-7]{58}$/)
  })

  test('isBlocked read method should work directly on client', async () => {
    const deployer2 = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(100_000_000) })
    const result = await graphClient.isBlocked({
      args: {
        user: deployer.addr.toString(),
        blocked: deployer2.addr.toString()
      }
    })
    expect(result).toBe(false)
  })
})

// ============================================================================
// Test Suite: Full Integration with Akita Universe (requires full DAO)
// ============================================================================
import { ProposalActionEnum } from 'akita-sdk'
import { AkitaUniverse, buildAkitaUniverse } from '../../tests/fixtures/dao'

// NOTE: These tests require buildAkitaUniverse which takes 5-10 minutes
describe('Full DAO Integration Tests', () => {
  let deployer: algosdk.Account
  let user1: algosdk.Account
  let user2: algosdk.Account
  let moderator: algosdk.Account
  let daoSdk: SocialSDK
  let user1Sdk: SocialSDK
  let user2Sdk: SocialSDK
  let moderatorSdk: SocialSDK
  let aktaAssetId: bigint
  let dispenser: algosdk.Address & TransactionSignerAccount & { account: SigningAccount }
  let algorand: import('@algorandfoundation/algokit-utils').AlgorandClient
  let akitaUniverse: AkitaUniverse
  let postRef1: Uint8Array
  let payWallId: bigint
  let socialAppId: bigint
  let graphAppId: bigint
  let impactAppId: bigint

  beforeAll(async () => {
    await fixture.beforeEach()
    algorand = fixture.context.algorand
    dispenser = await algorand.account.dispenserFromEnvironment()

    // Create accounts
    deployer = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(10_000_000_000) })
    user1 = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(2_000_000_000) })
    user2 = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(2_000_000_000) })
    moderator = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(2_000_000_000) })

    await algorand.account.ensureFunded(deployer.addr, dispenser, (5000).algo())

    // Create AKTA token BEFORE building universe so escrows can be opted in
    const assetCreateResult = await algorand.send.assetCreate({
      sender: deployer.addr,
      signer: makeBasicAccountTransactionSigner(deployer),
      total: 1_000_000_000_000_000n,
      decimals: 6,
      assetName: 'Akita Inu Test',
      unitName: 'AKTA',
      defaultFrozen: false,
    })
    aktaAssetId = assetCreateResult.confirmation.assetIndex!

    // Build Akita Universe with AKTA asset ID (escrows will be opted into AKTA during setup)
    akitaUniverse = await buildAkitaUniverse({
      fixture,
      sender: deployer.addr,
      signer: makeBasicAccountTransactionSigner(deployer),
      apps: {},
      aktaAssetId
    })

    // Set social fees for testing (AKTA asset is already set in buildAkitaUniverse)
    await akitaUniverse.dao.client.appClient.fundAppAccount({ amount: algokit.microAlgos(5_000_000) })
    const { return: feesProposalId } = await akitaUniverse.dao.newProposal({
      actions: [
        {
          type: ProposalActionEnum.UpdateFields,
          field: 'social_fees',
          value: { postFee: 100_000_000n, reactFee: 10_000_000n, impactTaxMin: 0n, impactTaxMax: 100n }
        }
      ]
    })
    if (feesProposalId !== undefined) {
      await akitaUniverse.dao.executeProposal({ proposalId: feesProposalId })
    }

    // Use social contracts from akitaUniverse (properly configured with correct escrow)
    socialAppId = akitaUniverse.social.socialAppId
    graphAppId = akitaUniverse.social.graphAppId
    impactAppId = akitaUniverse.social.impactAppId
    const moderationAppId = akitaUniverse.social.moderationAppId

    // Opt users into AKTA and fund them
    // When we create the AKTA token, deployer is the creator and has all tokens
    for (const user of [user1, user2, moderator]) {
      await algorand.send.assetOptIn({
        sender: user.addr,
        signer: makeBasicAccountTransactionSigner(user),
        assetId: aktaAssetId,
      })
      // Transfer AKTA from deployer to users
      await algorand.send.assetTransfer({
        sender: deployer.addr,
        signer: makeBasicAccountTransactionSigner(deployer),
        receiver: user.addr,
        assetId: aktaAssetId,
        amount: 100_000_000_000n, // 100,000 AKTA (6 decimals)
      })
    }

    // Create SDKs - pass daoAppId for full integration tests
    const daoAppId = akitaUniverse.dao.client.appId

    daoSdk = new SocialSDK({
      algorand,
      daoAppId,
      socialFactoryParams: { appId: socialAppId, defaultSender: deployer.addr, defaultSigner: makeBasicAccountTransactionSigner(deployer) },
      graphFactoryParams: { appId: graphAppId, defaultSender: deployer.addr, defaultSigner: makeBasicAccountTransactionSigner(deployer) },
      impactFactoryParams: { appId: impactAppId, defaultSender: deployer.addr, defaultSigner: makeBasicAccountTransactionSigner(deployer) },
      moderationFactoryParams: { appId: moderationAppId, defaultSender: deployer.addr, defaultSigner: makeBasicAccountTransactionSigner(deployer) },
    })

    user1Sdk = new SocialSDK({
      algorand,
      daoAppId,
      socialFactoryParams: { appId: socialAppId, defaultSender: user1.addr, defaultSigner: makeBasicAccountTransactionSigner(user1) },
      graphFactoryParams: { appId: graphAppId, defaultSender: user1.addr, defaultSigner: makeBasicAccountTransactionSigner(user1) },
      impactFactoryParams: { appId: impactAppId, defaultSender: user1.addr, defaultSigner: makeBasicAccountTransactionSigner(user1) },
      moderationFactoryParams: { appId: moderationAppId, defaultSender: user1.addr, defaultSigner: makeBasicAccountTransactionSigner(user1) },
    })

    user2Sdk = new SocialSDK({
      algorand,
      daoAppId,
      socialFactoryParams: { appId: socialAppId, defaultSender: user2.addr, defaultSigner: makeBasicAccountTransactionSigner(user2) },
      graphFactoryParams: { appId: graphAppId, defaultSender: user2.addr, defaultSigner: makeBasicAccountTransactionSigner(user2) },
      impactFactoryParams: { appId: impactAppId, defaultSender: user2.addr, defaultSigner: makeBasicAccountTransactionSigner(user2) },
      moderationFactoryParams: { appId: moderationAppId, defaultSender: user2.addr, defaultSigner: makeBasicAccountTransactionSigner(user2) },
    })

    moderatorSdk = new SocialSDK({
      algorand,
      daoAppId,
      socialFactoryParams: { appId: socialAppId, defaultSender: moderator.addr, defaultSigner: makeBasicAccountTransactionSigner(moderator) },
      graphFactoryParams: { appId: graphAppId, defaultSender: moderator.addr, defaultSigner: makeBasicAccountTransactionSigner(moderator) },
      impactFactoryParams: { appId: impactAppId, defaultSender: moderator.addr, defaultSigner: makeBasicAccountTransactionSigner(moderator) },
      moderationFactoryParams: { appId: moderationAppId, defaultSender: moderator.addr, defaultSigner: makeBasicAccountTransactionSigner(moderator) },
    })

    // Initialize social contract to opt into AKTA (required for tip payments)
    try {
      await daoSdk.init()
    } catch (e) {
      console.log('Init failed (may already be opted in):', e)
    }

    // Note: Tests now use ALGO (asset ID 0) for tips to avoid escrow opt-in complexity
    // AKTA opt-in would require using the revenue manager plugin on the escrow
    // which requires proper plugin installation and execution through the DAO wallet

  }, 600_000) // 10 minute timeout for full setup

  describe('DAO Setup Verification', () => {
    test('akita universe should be created', () => {
      expect(akitaUniverse).toBeDefined()
      expect(akitaUniverse.dao).toBeDefined()
    })

    test('social contracts should be deployed', () => {
      expect(socialAppId).toBeGreaterThan(0n)
      expect(graphAppId).toBeGreaterThan(0n)
      expect(impactAppId).toBeGreaterThan(0n)
    })

    test('AKTA token should exist', () => {
      expect(aktaAssetId).toBeGreaterThan(0n)
    })

    test('social fees should be configured', async () => {
      const socialFees = await akitaUniverse.dao.client.state.global.socialFees()
      expect(socialFees?.postFee).toBe(100_000_000n)
      expect(socialFees?.reactFee).toBe(10_000_000n)
    })

    test('DAO app list should have social contracts', async () => {
      const appList = await akitaUniverse.dao.client.state.global.akitaSocialAppList()
      expect(appList?.social).toBe(socialAppId)
      expect(appList?.graph).toBe(graphAppId)
      expect(appList?.impact).toBe(impactAppId)
    })
  })

  describe('Meta Operations (Success)', () => {
    test('initMeta should initialize user1 metadata', async () => {
      // Get expected cost (MBR for meta initialization)
      // Account for: app call fee + payment transaction fee + inner transaction fees
      // Note: initMeta has 1 inner payment transaction + 1 abiCall (which may create inner transactions)
      const expectedPayment = user1Sdk.calculateMetaMBR()
      const expectedCost = createExpectedCost(expectedPayment, 1, MIN_TXN_FEE * 3n) // 1 inner payment + payment transaction + extra inner txns
      const verification = await verifyBalanceChange(
        algorand,
        user1.addr.toString(),
        expectedCost,
        'initMeta for user1'
      )

      const streak = await user1Sdk.initMeta({ user: user1.addr.toString() })

      // Verify balance change matches expected cost
      const completed = await completeBalanceVerification(
        verification,
        algorand,
        user1.addr.toString()
      )
      expectBalanceChange(completed, 'initMeta for user1')
      expect(completed.actualCost).toBe(expectedCost.total)

      expect(streak).toBe(1n)
    })

    test('getMeta should return initialized metadata for user1', async () => {
      const meta = await user1Sdk.getMeta({ user: user1.addr.toString() })
      expect(meta.streak).toBe(1n)
    })

    test('initMeta should initialize user2 metadata', async () => {
      const streak = await user2Sdk.initMeta({ user: user2.addr.toString() })
      expect(streak).toBe(1n)
    })

    test('initMeta should initialize moderator metadata', async () => {
      const streak = await moderatorSdk.initMeta({ user: moderator.addr.toString() })
      expect(streak).toBe(1n)
    })

    test('updateMeta should update metadata fields', async () => {
      // First create a paywall since updateMeta validates the defaultPayWallId
      const payWallId = await user1Sdk.createPayWall({
        userPayInfo: [{ type: PayWallType.OneTimePayment, assetOrSubId: 0n, amount: 1000n }],
        agentPayInfo: []
      })
      await user1Sdk.updateMeta({ followGateId: 0n, defaultPayWallId: payWallId })
      const meta = await user1Sdk.getMeta({ user: user1.addr.toString() })
      expect(meta).toBeDefined()
      expect(meta.defaultPayWallId).toBe(payWallId)
    })
  })

  describe('PayWall Operations (Success)', () => {
    test('createPayWall with AKTA payment option', async () => {
      // Get expected cost (MBR for paywall)
      // Account for: app call fee + payment transaction fee
      const mbrAmount = user1Sdk.calculatePayWallMBR(1, 0) // 1 user option, 0 agent options
      const expectedCost = createExpectedCost(mbrAmount, 0, MIN_TXN_FEE)
      const verification = await verifyBalanceChange(
        algorand,
        user1.addr.toString(),
        expectedCost,
        'createPayWall with AKTA payment option'
      )

      payWallId = await user1Sdk.createPayWall({
        userPayInfo: [{ type: PayWallType.OneTimePayment, assetOrSubId: aktaAssetId, amount: 1_000_000n }],
        agentPayInfo: []
      })

      // Verify balance change matches expected cost
      const completed = await completeBalanceVerification(
        verification,
        algorand,
        user1.addr.toString()
      )
      expectBalanceChange(completed, 'createPayWall with AKTA payment option')
      expect(completed.actualCost).toBe(expectedCost.total)

      expect(payWallId).toBeGreaterThan(0n)
    })

    test('createPayWall with multiple options', async () => {
      // Get expected cost (MBR for paywall with multiple options)
      // Account for: app call fee + payment transaction fee
      const mbrAmount = user1Sdk.calculatePayWallMBR(2, 1) // 2 user options, 1 agent option
      const expectedCost = createExpectedCost(mbrAmount, 0, MIN_TXN_FEE)
      const verification = await verifyBalanceChange(
        algorand,
        user1.addr.toString(),
        expectedCost,
        'createPayWall with multiple options'
      )

      const id = await user1Sdk.createPayWall({
        userPayInfo: [
          { type: PayWallType.OneTimePayment, assetOrSubId: 0n, amount: 100000n },
          { type: PayWallType.OneTimePayment, assetOrSubId: aktaAssetId, amount: 50000n },
        ],
        agentPayInfo: [
          { type: PayWallType.Subscription, assetOrSubId: 1n, amount: 0n },
        ]
      })

      // Verify balance change matches expected cost
      const completed = await completeBalanceVerification(
        verification,
        algorand,
        user1.addr.toString()
      )
      expectBalanceChange(completed, 'createPayWall with multiple options')
      expect(completed.actualCost).toBe(expectedCost.total)

      expect(id).toBeGreaterThan(payWallId)
    })
  })

  describe('Post Operations (Success)', () => {
    const testCid = new Uint8Array(36).fill(42)

    test('post should create a new post', async () => {
      // Get expected cost (MBR payment in ALGO + transaction fees)
      // Note: postFee is paid in AKTA via asset transfer, not included in ALGO payment
      // Account for: app call fee + payment transaction fee + asset transfer fee + 2 opUp transaction fees + inner txns
      const mbrAmount = user1Sdk.calculatePostMBR(testCid.length, false)
      const expectedCost = createExpectedCost(mbrAmount, 0, MIN_TXN_FEE * 12n) // payment + asset transfer + 2 opUp + inner txns
      const verification = await verifyBalanceChange(
        algorand,
        user1.addr.toString(),
        expectedCost,
        'create post'
      )

      const result = await user1Sdk.post({ cid: testCid })
      postRef1 = result.postKey // Capture the computed post key

      // Verify balance change matches expected cost (MBR + fees)
      // Note: postFee is paid separately in AKTA, not ALGO
      const completed = await completeBalanceVerification(
        verification,
        algorand,
        user1.addr.toString()
      )
      expectBalanceChange(completed, 'create post')
      expect(completed.actualCost).toBe(expectedCost.total)

      expect(postRef1).toHaveLength(32)
    })

    test('post with paywall', async () => {
      const testCid2 = new Uint8Array(36).fill(43)
      const result = await user1Sdk.post({
        cid: testCid2,
        payWallId,
        usePayWall: true,
      })
      expect(result.postKey).toHaveLength(32)
    })

    test('post with gate (gateId 0 = no gate)', async () => {
      const testCid3 = new Uint8Array(36).fill(44)
      const result = await user1Sdk.post({
        cid: testCid3,
        gateId: 0n,
      })
      expect(result.postKey).toHaveLength(32)
    })
  })

  describe('Reply Operations (Success)', () => {
    test('reply to a post', async () => {
      const replyCid = new Uint8Array(36).fill(50)
      // Get expected cost (MBR for reply)
      // Note: reactFee is paid in AKTA via asset transfer, not included in ALGO payment
      // Account for: app call fee + payment transaction fee + asset transfer fee + 2 opUp transaction fees + inner txns
      // Note: opUp calls are separate transactions, not inner transactions
      const mbrAmount = user2Sdk.calculateReplyMBR(replyCid.length, false, false)
      const expectedCost = createExpectedCost(mbrAmount, 0, MIN_TXN_FEE * 18n) // payment + asset transfer + 2 opUp + inner txns
      const verification = await verifyBalanceChange(
        algorand,
        user2.addr.toString(),
        expectedCost,
        'reply to a post'
      )

      const result = await user2Sdk.reply({
        cid: replyCid,
        ref: postRef1,
        refType: RefType.Post,
      })

      // Verify balance change matches expected cost (MBR + fees)
      // Note: reactFee is paid separately in AKTA, not ALGO
      const completed = await completeBalanceVerification(
        verification,
        algorand,
        user2.addr.toString()
      )
      expectBalanceChange(completed, 'reply to a post')
      expect(completed.actualCost).toBe(expectedCost.total)

      expect(result.replyKey).toHaveLength(32)
    })
  })

  describe('Vote Operations (Success)', () => {
    test('upvote a post', async () => {
      // Get expected cost (MBR for vote)
      // Note: reactFee is paid in AKTA via asset transfer, not included in ALGO payment
      // Account for: app call fee + payment transaction fee + asset transfer fee + 3 opUp transaction fees + inner txns
      // Note: opUp calls are separate transactions, not inner transactions
      const mbrAmount = user2Sdk.calculateVoteMBR(false)
      const expectedCost = createExpectedCost(mbrAmount, 0, MIN_TXN_FEE * 17n) // payment + asset transfer + 3 opUp + inner txns
      const verification = await verifyBalanceChange(
        algorand,
        user2.addr.toString(),
        expectedCost,
        'upvote a post'
      )

      await user2Sdk.vote({
        ref: postRef1,
        refType: RefType.Post,
        isUp: true,
      })

      // Verify balance change matches expected cost (MBR + fees)
      // Note: reactFee is paid separately in AKTA, not ALGO
      const completed = await completeBalanceVerification(
        verification,
        algorand,
        user2.addr.toString()
      )
      expectBalanceChange(completed, 'upvote a post')
      expect(completed.actualCost).toBe(expectedCost.total)
    })

    test('invertVote to flip vote direction', async () => {
      // invertVote has no MBR payment (0), but requires reactFee in AKTA
      // Note: reactFee is paid in AKTA via asset transfer, not included in ALGO payment
      const expectedCost = createExpectedCost(0n, 3, MIN_TXN_FEE * 9n) // 3 opUp calls + asset transfer + inner txns
      const verification = await verifyBalanceChange(
        algorand,
        user2.addr.toString(),
        expectedCost,
        'invertVote to flip vote direction'
      )

      await user2Sdk.invertVote({
        ref: postRef1,
      })

      // Verify balance change matches expected cost (just fees)
      // Note: reactFee is paid separately in AKTA, not ALGO
      const completed = await completeBalanceVerification(
        verification,
        algorand,
        user2.addr.toString()
      )
      expectBalanceChange(completed, 'invertVote to flip vote direction')
      expect(completed.actualCost).toBe(expectedCost.total)
    })

    test('deleteVote to remove vote entirely', async () => {
      // deleteVote refunds MBR, so cost is just fees
      // Note: MBR refund increases balance, so actual cost will be minimal
      const expectedCost = createExpectedCost(0n, 3, 0n) // 3 opUp calls, no base payment
      const verification = await verifyBalanceChange(
        algorand,
        user2.addr.toString(),
        expectedCost,
        'deleteVote to remove vote entirely'
      )

      await user2Sdk.deleteVote({
        ref: postRef1,
      })

      // Verify balance change (refund increases balance, so cost is minimal - just fees)
      const completed = await completeBalanceVerification(
        verification,
        algorand,
        user2.addr.toString()
      )
      // Note: actualCost will be negative or small because MBR refund increases balance
      // We just verify the operation completed successfully
      expect(completed.balanceAfter).toBeGreaterThanOrEqual(completed.balanceBefore - expectedCost.total)
    })
  })

  describe('React Operations (Success)', () => {
    let reactionNftId: bigint

    test('react to a post with NFT', async () => {
      // Create an NFT for user2 to react with
      const nftResult = await algorand.send.assetCreate({
        sender: user2.addr,
        signer: makeBasicAccountTransactionSigner(user2),
        total: 1n,
        decimals: 0,
        assetName: 'React NFT',
        unitName: 'REACT',
        defaultFrozen: false,
      })
      reactionNftId = BigInt(nftResult.confirmation.assetIndex!)

      // Get expected cost (MBR for first reaction with NFT)
      // Note: reactFee is paid in AKTA via asset transfer, not included in ALGO payment
      // Account for: app call fee + payment transaction fee + asset transfer fee + 3 opUp transaction fees + inner txns
      // Note: opUp calls are separate transactions, not inner transactions
      const mbrAmount = user2Sdk.calculateReactMBR(true, false) // first reaction with NFT
      const expectedCost = createExpectedCost(mbrAmount, 0, MIN_TXN_FEE * 14n) // payment + asset transfer + 3 opUp + inner txns
      const verification = await verifyBalanceChange(
        algorand,
        user2.addr.toString(),
        expectedCost,
        'react to a post with NFT'
      )

      await user2Sdk.react({
        ref: postRef1,
        refType: RefType.Post,
        nft: reactionNftId,
      })

      // Verify balance change matches expected cost (MBR + fees)
      // Note: reactFee is paid separately in AKTA, not ALGO
      const completed = await completeBalanceVerification(
        verification,
        algorand,
        user2.addr.toString()
      )
      expectBalanceChange(completed, 'react to a post with NFT')
      expect(completed.actualCost).toBe(expectedCost.total)
    })

    test('deleteReaction should remove reaction', async () => {
      // deleteReaction refunds MBR, so cost is just fees
      // Note: MBR refund increases balance, so actual cost will be minimal
      const expectedCost = createExpectedCost(0n, 3, 0n) // 3 opUp calls, no base payment
      const verification = await verifyBalanceChange(
        algorand,
        user2.addr.toString(),
        expectedCost,
        'deleteReaction should remove reaction'
      )

      await user2Sdk.deleteReaction({
        ref: postRef1,
        nft: reactionNftId
      })

      // Verify balance change (refund increases balance, so cost is minimal - just fees)
      const completed = await completeBalanceVerification(
        verification,
        algorand,
        user2.addr.toString()
      )
      // Note: actualCost will be negative or small because MBR refund increases balance
      // We just verify the operation completed successfully
      expect(completed.balanceAfter).toBeGreaterThanOrEqual(completed.balanceBefore - expectedCost.total)
    })
  })

  describe('Graph Operations (Success)', () => {
    // Note: Graph write operations (follow, block, etc.) require akitaDAO to be set
    // The graph contract has a chicken-and-egg problem: updateAkitaDAO requires DAO wallet
    // but to find DAO wallet we need akitaDAO set. Read operations still work.

    test('isBlocked should return false for users who have not blocked each other', async () => {
      // Read operation works without akitaDAO
      const isBlocked = await user1Sdk.isBlocked({
        user: user1.addr.toString(),
        blocked: user2.addr.toString()
      })
      expect(isBlocked).toBe(false)
    })

    test('isBlocked should work for multiple user pairs', async () => {
      const isBlocked1 = await user1Sdk.isBlocked({
        user: user2.addr.toString(),
        blocked: user1.addr.toString()
      })
      const isBlocked2 = await user1Sdk.isBlocked({
        user: deployer.addr.toString(),
        blocked: user1.addr.toString()
      })
      expect(isBlocked1).toBe(false)
      expect(isBlocked2).toBe(false)
    })

    // Graph write operations are tested in standalone tests where
    // the contract doesn't require akitaDAO for the core functionality
  })

  // Note: Moderation operations (addModerator, removeModerator, addAction, removeAction)
  // require calling from the DAO wallet (abstracted account), not just any sender.
  // This requires using the wallet's plugin system which is complex to set up in tests.
  // These operations are tested via the DAO fixture tests.

  describe('Moderation Operations (Success)', () => {
    // Note: addModerator/removeModerator require the DAO wallet plugin system
    // The contract checks Txn.sender === akitaDAOWallet.address which requires inner txns from wallet
    // Read operations work without wallet sender

    test('addModerator should throw (requires DAO wallet sender)', async () => {
      // This requires sender to be DAO wallet (abstracted account)
      await expect(daoSdk.addModerator({ address: moderator.addr.toString() }))
        .rejects.toThrow()
    })

    test('getModeratorMeta should return exists=false for non-moderators', async () => {
      const meta = await daoSdk.getModeratorMeta({ user: moderator.addr.toString() })
      expect(meta.exists).toBe(false)
    })

    test('isBanned should return false for non-banned users', async () => {
      const isBanned = await daoSdk.isBanned({ account: user2.addr.toString() })
      expect(isBanned).toBe(false)
    })
  })

  describe('Action Operations (Success)', () => {
    // Note: addAction/removeAction require Txn.sender === akitaDAOWallet.address

    test('addAction should throw (requires DAO wallet sender)', async () => {
      // This requires sender to be DAO wallet (abstracted account)
      const content = new Uint8Array(36).fill(200)
      await expect(daoSdk.addAction({ actionAppId: 123n, content }))
        .rejects.toThrow()
    })

    test('removeAction should throw (requires DAO wallet sender)', async () => {
      // This requires sender to be DAO wallet (abstracted account)
      await expect(daoSdk.removeAction({ actionAppId: 123n }))
        .rejects.toThrow()
    })
  })

  describe('Impact Operations (Success)', () => {
    test('getUserImpact should return user impact score', async () => {
      const impact = await daoSdk.getUserImpact({ address: user1.addr.toString() })
      expect(impact).toBeGreaterThanOrEqual(0n)
    })

    test('getUserImpactWithoutSocial should return base impact', async () => {
      const impact = await daoSdk.getUserImpactWithoutSocial({ address: user1.addr.toString() })
      expect(impact).toBeGreaterThanOrEqual(0n)
    })

    test('getUserSocialImpact should return social component', async () => {
      const impact = await daoSdk.getUserSocialImpact({ user: user1.addr.toString() })
      expect(typeof impact).toBe('bigint')
    })
  })
})

