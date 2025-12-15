import * as algokit from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { SigningAccount, TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { beforeAll, describe, expect, test } from '@jest/globals'
import { PrizeBoxSDK } from 'akita-sdk/prize-box'
import algosdk, { makeBasicAccountTransactionSigner } from 'algosdk'
import { AkitaUniverse, buildAkitaUniverse } from '../../tests/fixtures/dao'
import {
    getAccountBalance,
} from '../../tests/utils/balance'

algokit.Config.configure({ populateAppCallResources: true })

const fixture = algorandFixture()

describe('Prize Box SDK', () => {
    let deployer: algosdk.Account
    let creator: algosdk.Account
    let recipient: algosdk.Account
    let akitaUniverse: AkitaUniverse
    let prizeBoxSDK: PrizeBoxSDK
    let testAssetId: bigint
    let testAssetId2: bigint
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
        creator = await ctx.generateAccount({ initialFunds: algokit.microAlgos(500_000_000) })
        recipient = await ctx.generateAccount({ initialFunds: algokit.microAlgos(100_000_000) })

        await algorand.account.ensureFunded(deployer.addr, dispenser, (2000).algo())
        await algorand.account.ensureFunded(creator.addr, dispenser, (500).algo())
        await algorand.account.ensureFunded(recipient.addr, dispenser, (100).algo())

        // Build the full Akita DAO universe (includes prizeBoxFactory)
        akitaUniverse = await buildAkitaUniverse({
            fixture,
            sender: deployer.addr,
            signer: makeBasicAccountTransactionSigner(deployer),
            apps: {},
        })

        // Create test ASAs for prize box contents
        const assetCreate1 = await algorand.send.assetCreate({
            sender: deployer.addr,
            signer: makeBasicAccountTransactionSigner(deployer),
            total: 1_000_000n,
            decimals: 0,
            assetName: 'Prize Token 1',
            unitName: 'PT1',
        })
        testAssetId = BigInt(assetCreate1.confirmation.assetIndex!)

        const assetCreate2 = await algorand.send.assetCreate({
            sender: deployer.addr,
            signer: makeBasicAccountTransactionSigner(deployer),
            total: 1_000_000n,
            decimals: 6,
            assetName: 'Prize Token 2',
            unitName: 'PT2',
        })
        testAssetId2 = BigInt(assetCreate2.confirmation.assetIndex!)

        // Opt accounts into assets
        for (const account of [creator, recipient]) {
            await algorand.send.assetOptIn({
                sender: account.addr,
                signer: makeBasicAccountTransactionSigner(account),
                assetId: testAssetId,
            })
            await algorand.send.assetOptIn({
                sender: account.addr,
                signer: makeBasicAccountTransactionSigner(account),
                assetId: testAssetId2,
            })
        }

        // Transfer assets to creator
        await algorand.send.assetTransfer({
            sender: deployer.addr,
            signer: makeBasicAccountTransactionSigner(deployer),
            assetId: testAssetId,
            amount: 1000n,
            receiver: creator.addr,
        })
        await algorand.send.assetTransfer({
            sender: deployer.addr,
            signer: makeBasicAccountTransactionSigner(deployer),
            assetId: testAssetId2,
            amount: 1_000_000n,
            receiver: creator.addr,
        })

        // Fund the prize box factory to cover MBR
        await algorand.account.ensureFunded(akitaUniverse.prizeBoxFactory.client.appAddress, dispenser, (100).algo())
    })

    describe('PrizeBoxFactorySDK', () => {
        describe('cost()', () => {
            test('should return the cost to create a prize box', () => {
                const cost = akitaUniverse.prizeBoxFactory.cost()
                expect(cost).toBeGreaterThan(0n)
                expect(cost).toBe(278_500n)
            })
        })

        describe('mint()', () => {
            test('should create a new prize box', async () => {
                const balanceBefore = await getAccountBalance(algorand, creator.addr.toString())
                const cost = akitaUniverse.prizeBoxFactory.cost()

                prizeBoxSDK = await akitaUniverse.prizeBoxFactory.mint({
                    sender: creator.addr,
                    signer: makeBasicAccountTransactionSigner(creator),
                    owner: creator.addr.toString(),
                })

                expect(prizeBoxSDK).toBeInstanceOf(PrizeBoxSDK)
                expect(prizeBoxSDK.client.appId).toBeGreaterThan(0n)

                // Verify cost was deducted
                const balanceAfter = await getAccountBalance(algorand, creator.addr.toString())
                expect(balanceBefore - balanceAfter).toBeGreaterThanOrEqual(cost)
            })
        })

        describe('get()', () => {
            test('should return PrizeBoxSDK for existing prize box', () => {
                const existingBox = akitaUniverse.prizeBoxFactory.get({ appId: prizeBoxSDK.client.appId })
                expect(existingBox).toBeInstanceOf(PrizeBoxSDK)
                expect(existingBox.client.appId).toBe(prizeBoxSDK.client.appId)
            })
        })
    })

    describe('PrizeBoxSDK', () => {
        describe('state()', () => {
            test('should return the current prize box state', async () => {
                const state = await prizeBoxSDK.state()
                expect(state.owner).toBe(creator.addr.toString())
                expect(state.optinCount).toBe(0n)
            })
        })

        describe('owner()', () => {
            test('should return the owner address', async () => {
                const owner = await prizeBoxSDK.owner()
                expect(owner).toBe(creator.addr.toString())
            })
        })

        describe('optIn()', () => {
            test('should opt prize box into an asset', async () => {
                await prizeBoxSDK.optIn({
                    sender: creator.addr,
                    signer: makeBasicAccountTransactionSigner(creator),
                    asset: testAssetId,
                })

                const state = await prizeBoxSDK.state()
                expect(state.optinCount).toBe(1n)
            })

            test('should allow opting into multiple assets', async () => {
                await prizeBoxSDK.optIn({
                    sender: creator.addr,
                    signer: makeBasicAccountTransactionSigner(creator),
                    asset: testAssetId2,
                })

                const state = await prizeBoxSDK.state()
                expect(state.optinCount).toBe(2n)
            })
        })

        describe('transfer()', () => {
            test('should transfer ownership to new owner', async () => {
                await prizeBoxSDK.transfer({
                    sender: creator.addr,
                    signer: makeBasicAccountTransactionSigner(creator),
                    newOwner: recipient.addr.toString(),
                })

                const owner = await prizeBoxSDK.owner()
                expect(owner).toBe(recipient.addr.toString())
            })

            test('should allow new owner to manage prize box', async () => {
                // Transfer back to creator for remaining tests
                await prizeBoxSDK.transfer({
                    sender: recipient.addr,
                    signer: makeBasicAccountTransactionSigner(recipient),
                    newOwner: creator.addr.toString(),
                })

                const owner = await prizeBoxSDK.owner()
                expect(owner).toBe(creator.addr.toString())
            })
        })

        describe('withdraw()', () => {
            test('should withdraw assets from prize box', async () => {
                // First deposit some assets
                await algorand.send.assetTransfer({
                    sender: creator.addr,
                    signer: makeBasicAccountTransactionSigner(creator),
                    assetId: testAssetId,
                    amount: 100n,
                    receiver: prizeBoxSDK.client.appAddress,
                })

                const creatorBalanceBefore = await algorand.asset.getAccountInformation(
                    creator.addr,
                    testAssetId
                )

                await prizeBoxSDK.withdraw({
                    sender: creator.addr,
                    signer: makeBasicAccountTransactionSigner(creator),
                    assets: [{ asset: testAssetId, amount: 50n }],
                })

                const creatorBalanceAfter = await algorand.asset.getAccountInformation(
                    creator.addr,
                    testAssetId
                )

                expect(BigInt(creatorBalanceAfter.balance) - BigInt(creatorBalanceBefore.balance)).toBe(50n)
            })
        })

        describe('delete()', () => {
            test('should delete empty prize box', async () => {
                // Create a new empty prize box for deletion test
                const emptyBox = await akitaUniverse.prizeBoxFactory.mint({
                    sender: creator.addr,
                    signer: makeBasicAccountTransactionSigner(creator),
                    owner: creator.addr.toString(),
                })

                await emptyBox.delete({
                    sender: creator.addr,
                    signer: makeBasicAccountTransactionSigner(creator),
                })

                // Trying to access the deleted box should fail
                await expect(emptyBox.state()).rejects.toThrow()
            })
        })
    })

    describe('DAO Integration', () => {
        test('should verify prize box factory is registered in DAO', async () => {
            // The prize box factory should be registered in the DAO's akitaAppList
            const daoState = await akitaUniverse.dao.client.state.global.getAll()
            expect(daoState.akitaAppList?.prizeBox).toBe(akitaUniverse.prizeBoxFactory.client.appId)
        })
    })
})
