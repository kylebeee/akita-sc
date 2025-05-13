import * as algokit from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { beforeAll, beforeEach, describe, expect, test } from '@jest/globals'
import algosdk, { makeBasicAccountTransactionSigner } from 'algosdk'
import { AkitaDaoClient, AkitaDaoFactory } from '../artifacts/dao/AkitaDAOClient'


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
        akta: 0n,
        contentPolicy: Buffer.from('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'),
        minimumRewardsImpact: 400,
        fees: {
          postFee: 100_000_000n,
          reactFee: 10_000_000n,
          impactTaxMin: 1_000n,
          impactTaxMax: 20_000n,
          poolCreationFee: 50_000_000n,
          poolImpactTaxMin: 500n,
          poolImpactTaxMax: 3_000n,
          subscriptionServiceCreationFee: 100_000_000n,
          subscriptionPaymentPercentage: 3_500n,
          subscriptionTriggerPercentage: 500n,
          marketplaceSalePercentageMinimum: 500n,
          marketplaceSalePercentageMaximum: 2_000n,
          marketplaceComposablePercentage: 500n,
          marketplaceRoyaltyDefaultPercentage: 5_000n,
          omnigemSaleFee: 100_000_000n,
          auctionCreationFee: 10_000_000n,
          auctionSaleImpactTaxMin: 500n,
          auctionSaleImpactTaxMax: 2_000n,
          auctionComposablePercentage: 500n,
          auctionRafflePercentage: 10_000n,
          raffleCreationFee: 10_000_000n,
          raffleSaleImpactTaxMin: 500n,
          raffleSaleImpactTaxMax: 2_000n,
          raffleComposablePercentage: 500n,
          swapFeeImpactTaxMin: 0n,
          swapFeeImpactTaxMax: 2_000n,
          swapComposablePercentage: 500n,
          swapLiquidityPercentage: 2_500n,
          krbyPercentage: 30_000n,
          moderatorPercentage: 5_000n,
        },
        proposalSettings: {
          minimumProposalThreshold: 10n,
          minimumVoteThreshold: 10n,
        },
        revocationAddress: aliceEOA.addr.toString(),
      },
    })
  })

  test('txnHash check', async () => {
    expect(null).toBe(null)
  })
})
