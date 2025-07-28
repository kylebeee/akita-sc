import * as algokit from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { beforeAll, beforeEach, describe, expect, test } from '@jest/globals'
// import { beforeAll, beforeEach, describe, expect, test } from 'vitest'
import algosdk, { makeBasicAccountTransactionSigner } from 'algosdk'

import { DEFAULT_ADD_ALLOWANCE_APPROVAL, DEFAULT_ADD_ALLOWANCE_PARTICIPATION, DEFAULT_ADD_ALLOWANCE_PROPOSAL_CREATION, DEFAULT_ADD_ALLOWANCE_VOTING_DURATION, DEFAULT_ADD_PLUGIN_APPROVAL, DEFAULT_ADD_PLUGIN_PARTICIPATION, DEFAULT_ADD_PLUGIN_PROPOSAL_CREATION, DEFAULT_ADD_PLUGIN_VOTING_DURATION, DEFAULT_AUCTION_COMPOSABLE_PERCENTAGE, DEFAULT_AUCTION_CREATION_FEE, DEFAULT_AUCTION_RAFFLE_PERCENTAGE, DEFAULT_AUCTION_SALE_IMPACT_MAX, DEFAULT_AUCTION_SALE_IMPACT_TAX_MIN, DEFAULT_IMPACT_TAX_MAX, DEFAULT_IMPACT_TAX_MIN, DEFAULT_KRBY_PERCENTAGE, DEFAULT_MARKETPLACE_COMPOSABLE_PERCENTAGE, DEFAULT_MARKETPLACE_ROYALTY_DEFAULT_PERCENTAGE, DEFAULT_MARKETPLACE_SALE_PERCENTAGE_MAXIMUM, DEFAULT_MARKETPLACE_SALE_PERCENTAGE_MINIMUM, DEFAULT_MIN_POOL_CREATION_FEE, DEFAULT_MIN_REWARDS_IMPACT, DEFAULT_MODERATOR_PERCENTAGE, DEFAULT_OMNIGEM_SALE_FEE, DEFAULT_POOL_IMPACT_TAX_MAX, DEFAULT_POOL_IMPACT_TAX_MIN, DEFAULT_POST_FEE, DEFAULT_RAFFLE_COMPOSABLE_PERCENTAGE, DEFAULT_RAFFLE_CREATION_FEE, DEFAULT_RAFFLE_SALE_IMPACT_MAX, DEFAULT_RAFFLE_SALE_IMPACT_TAX_MIN, DEFAULT_REACT_FEE, DEFAULT_REMOVE_ALLOWANCE_APPROVAL, DEFAULT_REMOVE_ALLOWANCE_PARTICIPATION, DEFAULT_REMOVE_ALLOWANCE_PROPOSAL_CREATION, DEFAULT_REMOVE_ALLOWANCE_VOTING_DURATION, DEFAULT_REMOVE_PLUGIN_APPROVAL, DEFAULT_REMOVE_PLUGIN_PARTICIPATION, DEFAULT_REMOVE_PLUGIN_PROPOSAL_CREATION, DEFAULT_REMOVE_PLUGIN_VOTING_DURATION, DEFAULT_SERVICE_CREATION_FEE, DEFAULT_SHUFFLE_SALE_PERCENTAGE, DEFAULT_SUBSCRIPTION_PAYMENT_PERCENTAGE, DEFAULT_SUBSCRIPTION_TRIGGER_PERCENTAGE, DEFAULT_SWAP_COMPOSABLE_PERCENTAGE, DEFAULT_SWAP_FEE_IMPACT_TAX_MAX, DEFAULT_SWAP_FEE_IMPACT_TAX_MIN, DEFAULT_SWAP_LIQUIDITY_PERCENTAGE, DEFAULT_UPDATE_FIELD_APPROVAL, DEFAULT_UPDATE_FIELD_PARTICIPATION, DEFAULT_UPDATE_FIELD_PROPOSAL_CREATION, DEFAULT_UPDATE_FIELD_VOTING_DURATION, DEFAULT_UPGRADE_APP_APPROVAL, DEFAULT_UPGRADE_APP_PARTICIPATION, DEFAULT_UPGRADE_APP_PROPOSAL_CREATION, DEFAULT_UPGRADE_APP_VOTING_DURATION } from '../../utils/defaults'
import { EscrowFactoryFactory } from '../../artifacts/escrow/EscrowFactoryClient'
import { PoolFactoryFactory } from '../../artifacts/pool/PoolFactoryClient'
import { AkitaDaoClient, AkitaDaoFactory } from '../../artifacts/arc58/dao/AkitaDAOClient'


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

    const escrowFactory = new EscrowFactoryFactory({
      defaultSender: aliceEOA.addr,
      defaultSigner: makeBasicAccountTransactionSigner(aliceEOA),
      algorand
    })

    const escrowFactoryResults = await escrowFactory.send.create.bare()

    await escrowFactoryResults.appClient.appClient.fundAppAccount({ amount: (100_000).microAlgos() });

    const poolFactory = new PoolFactoryFactory({
      defaultSender: aliceEOA.addr,
      defaultSigner: makeBasicAccountTransactionSigner(aliceEOA),
      algorand
    })

    const minter = new AkitaDaoFactory({
      defaultSender: aliceEOA.addr,
      defaultSigner: makeBasicAccountTransactionSigner(aliceEOA),
      algorand,
    })

    const results = await minter.send.create.create({
      args: {
        version: '0.0.1',
        akta: 0n,
        contentPolicy: Buffer.from('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'),
        minRewardsImpact: DEFAULT_MIN_REWARDS_IMPACT,
        apps: {
          staking: 0n,
          rewards: 0n,
          pool: 0n,
          prizeBox: 0n,
          subscriptions: 0n,
          gate: 0n,
          auction: 0n,
          hyperSwap: 0n,
          raffle: 0n,
          metaMerkles: 0n,
          marketplace: 0n,
          akitaNfd: 0n,
          optin: 0n,
          social: 0n,
          impact: 0n,
          vrfBeacon: 0n,
          nfdRegistry: 0n,
          assetInbox: 0n,
          walletFactory: 0n,
          escrowFactory: escrowFactoryResults.appClient.appId,
        },
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
          upgradeApp: {
            create: DEFAULT_UPGRADE_APP_PROPOSAL_CREATION,
            duration: DEFAULT_UPGRADE_APP_VOTING_DURATION,
            participation: DEFAULT_UPGRADE_APP_PARTICIPATION,
            approval: DEFAULT_UPGRADE_APP_APPROVAL
          },
          addPlugin: {
            create: DEFAULT_ADD_PLUGIN_PROPOSAL_CREATION,
            duration: DEFAULT_ADD_PLUGIN_VOTING_DURATION,
            participation: DEFAULT_ADD_PLUGIN_PARTICIPATION,
            approval: DEFAULT_ADD_PLUGIN_APPROVAL
          },
          removeExecutePlugin: {
            create: 0n,
            duration: 0n,
            participation: 0n,
            approval: 0n
          },
          removePlugin: {
            create: DEFAULT_REMOVE_PLUGIN_PROPOSAL_CREATION,
            duration: DEFAULT_REMOVE_PLUGIN_VOTING_DURATION,
            participation: DEFAULT_REMOVE_PLUGIN_PARTICIPATION,
            approval: DEFAULT_REMOVE_PLUGIN_APPROVAL
          },
          addAllowance: {
            create: DEFAULT_ADD_ALLOWANCE_PROPOSAL_CREATION,
            duration: DEFAULT_ADD_ALLOWANCE_VOTING_DURATION,
            participation: DEFAULT_ADD_ALLOWANCE_PARTICIPATION,
            approval: DEFAULT_ADD_ALLOWANCE_APPROVAL
          },
          newEscrow: {
            create: 0n,
            duration: 0n,
            participation: 0n,
            approval: 0n
          },
          removeAllowance: {
            create: DEFAULT_REMOVE_ALLOWANCE_PROPOSAL_CREATION,
            duration: DEFAULT_REMOVE_ALLOWANCE_VOTING_DURATION,
            participation: DEFAULT_REMOVE_ALLOWANCE_PARTICIPATION,
            approval: DEFAULT_REMOVE_ALLOWANCE_APPROVAL
          },
          updateFields: {
            create: DEFAULT_UPDATE_FIELD_PROPOSAL_CREATION,
            duration: DEFAULT_UPDATE_FIELD_VOTING_DURATION,
            participation: DEFAULT_UPDATE_FIELD_PARTICIPATION,
            approval: DEFAULT_UPDATE_FIELD_APPROVAL
          }
        }
      }
    })
    daoClient = results.appClient

    daoClient.appClient.fundAppAccount({ amount: (200_000).microAlgos() })

    console.log('DAO Address:', daoClient.appAddress.toString())

    const poolFactoryResults = await poolFactory.send.create.create({
      args: {
        version: '0.0.1',
        childVersion: '0.0.1',
        akitaDao: daoClient.appClient.appId
      }
    })

    // mint the DAOs ARC58 wallet
    await daoClient.send.setup({ extraFee: (100_000).microAlgos() })

    console.log('current version: ', await daoClient.state.global.version())
  })

  test('balance matches min', async () => {
    let accountInfo = await daoClient.algorand.account.getInformation(daoClient.appAddress)
    expect(accountInfo.balance.microAlgos).toEqual(accountInfo.minBalance.microAlgos)
  })
})
