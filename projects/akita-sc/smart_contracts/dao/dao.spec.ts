import * as algokit from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { beforeAll, beforeEach, describe, expect, test } from '@jest/globals'
import algosdk, { makeBasicAccountTransactionSigner } from 'algosdk'
import { AkitaDaoClient, AkitaDaoFactory } from '../artifacts/dao/AkitaDAOClient'
import { DEFAULT_AUCTION_COMPOSABLE_PERCENTAGE, DEFAULT_AUCTION_CREATION_FEE, DEFAULT_AUCTION_RAFFLE_PERCENTAGE, DEFAULT_AUCTION_SALE_IMPACT_MAX, DEFAULT_AUCTION_SALE_IMPACT_TAX_MIN, DEFAULT_IMPACT_TAX_MAX, DEFAULT_IMPACT_TAX_MIN, DEFAULT_KRBY_PERCENTAGE, DEFAULT_MARKETPLACE_COMPOSABLE_PERCENTAGE, DEFAULT_MARKETPLACE_ROYALTY_DEFAULT_PERCENTAGE, DEFAULT_MARKETPLACE_SALE_PERCENTAGE_MAXIMUM, DEFAULT_MARKETPLACE_SALE_PERCENTAGE_MINIMUM, DEFAULT_MIN_POOL_CREATION_FEE, DEFAULT_MODERATOR_PERCENTAGE, DEFAULT_OMNIGEM_SALE_FEE, DEFAULT_POOL_IMPACT_TAX_MAX, DEFAULT_POOL_IMPACT_TAX_MIN, DEFAULT_POST_FEE, DEFAULT_RAFFLE_COMPOSABLE_PERCENTAGE, DEFAULT_RAFFLE_CREATION_FEE, DEFAULT_RAFFLE_SALE_IMPACT_MAX, DEFAULT_RAFFLE_SALE_IMPACT_TAX_MIN, DEFAULT_REACT_FEE, DEFAULT_SERVICE_CREATION_FEE, DEFAULT_SHUFFLE_SALE_PERCENTAGE, DEFAULT_SUBSCRIPTION_PAYMENT_PERCENTAGE, DEFAULT_SUBSCRIPTION_TRIGGER_PERCENTAGE, DEFAULT_SWAP_COMPOSABLE_PERCENTAGE, DEFAULT_SWAP_FEE_IMPACT_TAX_MAX, DEFAULT_SWAP_FEE_IMPACT_TAX_MIN, DEFAULT_SWAP_LIQUIDITY_PERCENTAGE } from '../utils/defaults'


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

    const results = await minter.send.create.create({ args: { spendingAccountFactoryApp: 0 } })
    daoClient = results.appClient

    daoClient.appClient.fundAppAccount({ amount: (200_000).microAlgos() })

    console.log('DAO Address:', daoClient.appAddress.toString())
    console.log('current version: ', await daoClient.state.global.version())

    await daoClient.send.init({
      args: {
        version: '0.0.1',
        akta: 0n,
        contentPolicy: Buffer.from('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'),
        minimumRewardsImpact: 400,
        fees: {
          postFee: DEFAULT_POST_FEE,
          reactFee: DEFAULT_REACT_FEE,
          impactTaxMin: DEFAULT_IMPACT_TAX_MIN,
          impactTaxMax: DEFAULT_IMPACT_TAX_MAX,
          poolCreationFee: DEFAULT_MIN_POOL_CREATION_FEE,
          poolImpactTaxMin: DEFAULT_POOL_IMPACT_TAX_MIN,
          poolImpactTaxMax: DEFAULT_POOL_IMPACT_TAX_MAX,
          subscriptionServiceCreationFee: DEFAULT_SERVICE_CREATION_FEE,
          subscriptionPaymentPercentage: DEFAULT_SUBSCRIPTION_PAYMENT_PERCENTAGE,
          subscriptionTriggerPercentage: DEFAULT_SUBSCRIPTION_TRIGGER_PERCENTAGE,
          marketplaceSalePercentageMin: DEFAULT_MARKETPLACE_SALE_PERCENTAGE_MINIMUM,
          marketplaceSalePercentageMax: DEFAULT_MARKETPLACE_SALE_PERCENTAGE_MAXIMUM,
          marketplaceComposablePercentage: DEFAULT_MARKETPLACE_COMPOSABLE_PERCENTAGE,
          marketplaceRoyaltyDefaultPercentage: DEFAULT_MARKETPLACE_ROYALTY_DEFAULT_PERCENTAGE,
          shuffleSalePercentage: DEFAULT_SHUFFLE_SALE_PERCENTAGE,
          omnigemSaleFee: DEFAULT_OMNIGEM_SALE_FEE,
          auctionCreationFee: DEFAULT_AUCTION_CREATION_FEE,
          auctionSaleImpactTaxMin: DEFAULT_AUCTION_SALE_IMPACT_TAX_MIN,
          auctionSaleImpactTaxMax: DEFAULT_AUCTION_SALE_IMPACT_MAX,
          auctionComposablePercentage: DEFAULT_AUCTION_COMPOSABLE_PERCENTAGE,
          auctionRafflePercentage: DEFAULT_AUCTION_RAFFLE_PERCENTAGE,
          raffleCreationFee: DEFAULT_RAFFLE_CREATION_FEE,
          raffleSaleImpactTaxMin: DEFAULT_RAFFLE_SALE_IMPACT_TAX_MIN,
          raffleSaleImpactTaxMax: DEFAULT_RAFFLE_SALE_IMPACT_MAX,
          raffleComposablePercentage: DEFAULT_RAFFLE_COMPOSABLE_PERCENTAGE,
          swapFeeImpactTaxMin: DEFAULT_SWAP_FEE_IMPACT_TAX_MIN,
          swapFeeImpactTaxMax: DEFAULT_SWAP_FEE_IMPACT_TAX_MAX,
          swapComposablePercentage: DEFAULT_SWAP_COMPOSABLE_PERCENTAGE,
          swapLiquidityPercentage: DEFAULT_SWAP_LIQUIDITY_PERCENTAGE,
          krbyPercentage: DEFAULT_KRBY_PERCENTAGE,
          moderatorPercentage: DEFAULT_MODERATOR_PERCENTAGE,
        },
        proposalSettings: {
          minimumProposalThreshold: 10n,
          minimumVoteThreshold: 10n,
        },
        revocationAddress: aliceEOA.addr.toString(),
      },
      extraFee: (1_000).microAlgos()
    })
  })

  test('txnHash check', async () => {
    expect(null).toBe(null)
  })
})
