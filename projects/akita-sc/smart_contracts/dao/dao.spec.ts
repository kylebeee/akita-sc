import * as algokit from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { beforeAll, beforeEach, describe, expect, test } from '@jest/globals'
import algosdk, { makeBasicAccountTransactionSigner } from 'algosdk'
import { AkitaDaoClient, AkitaDaoFactory } from '../clients/AkitaDAOClient'

algokit.Config.configure({ populateAppCallResources: true })

const fixture = algorandFixture()

describe('DAO Tests', () => {
    /** Alice's externally owned account (ie. a keypair account she has in Defly) */
    let aliceEOA: algosdk.Account
    /** The suggested params for transactions */
    let suggestedParams: algosdk.SuggestedParams
    /** The client for the DAO */
    let daoClient: AkitaDaoClient

    beforeEach(fixture.beforeEach)

    beforeAll(async () => {
        await fixture.beforeEach()
        const { algorand, algod } = fixture.context
        const dispenser = await algorand.account.dispenserFromEnvironment()
        suggestedParams = await algorand.getSuggestedParams()
        aliceEOA = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(100_000_000) })

        await algorand.account.ensureFunded(aliceEOA.addr, dispenser, (100).algo())

        const minter = new AkitaDaoFactory({
            defaultSender: aliceEOA.addr,
            defaultSigner: makeBasicAccountTransactionSigner(aliceEOA),
            algorand,
        })

        const results = await minter.send.create.createApplication()
        daoClient = results.appClient

        console.log('DAO Address:', daoClient.appAddress)
        console.log('current version: ', await daoClient.state.global.version())

        await daoClient.send.init({
            args: {
                version: '0.0.1',
                contentPolicy: Buffer.from('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'),
                minimumRewardsImpact: 400,
                fees: {
                    socialPostFee: 100_000_000n,
                    socialReactFee: 10_000_000n,
                    stakingPoolCreationFee: 50_000_000n,
                    subscriptionServiceCreationFee: 50_000_000n,
                    subscriptionPaymentPercentage: 350n,
                    subscriptionTriggerPercentage: 50n,
                    omnigemSaleFee: 100_000_000n,
                    marketplaceSalePercentageMinimum: 50n,
                    marketplaceSalePercentageMaximum: 150n,
                    marketplaceComposablePercentage: 100n,
                    nftShuffleSalePercentage: 100n,
                    auctionSalePercentageMinimum: 100n,
                    auctionSalePercentageMaximum: 200n,
                    auctionComposablePercentage: 100n,
                    krbyPercentage: 30n,
                    moderatorPercentage: 4n,
                },
                minimumProposalThreshold: 10,
                minimumVoteThreshold: 10,
                revocationAddress: aliceEOA.addr,
            },
        })
    })

    test('txnHash check', async () => {
        expect(null).toBe(null)
    })
})
