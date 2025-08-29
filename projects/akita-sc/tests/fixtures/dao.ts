import { AkitaDaoApps, AkitaDaoFactory } from '../../smart_contracts/artifacts/arc58/dao/AkitaDAOClient';
import { FixtureAndAccount } from '../types';
import { DEFAULT_ADD_ALLOWANCE_APPROVAL, DEFAULT_ADD_ALLOWANCE_PARTICIPATION, DEFAULT_ADD_ALLOWANCE_PROPOSAL_CREATION, DEFAULT_ADD_ALLOWANCE_PROPOSAL_POWER, DEFAULT_ADD_ALLOWANCE_VOTING_DURATION, DEFAULT_ADD_PLUGIN_APPROVAL, DEFAULT_ADD_PLUGIN_PARTICIPATION, DEFAULT_ADD_PLUGIN_PROPOSAL_CREATION, DEFAULT_ADD_PLUGIN_PROPOSAL_POWER, DEFAULT_ADD_PLUGIN_VOTING_DURATION, DEFAULT_AUCTION_COMPOSABLE_PERCENTAGE, DEFAULT_AUCTION_CREATION_FEE, DEFAULT_AUCTION_RAFFLE_PERCENTAGE, DEFAULT_AUCTION_SALE_IMPACT_MAX, DEFAULT_AUCTION_SALE_IMPACT_TAX_MIN, DEFAULT_IMPACT_TAX_MAX, DEFAULT_IMPACT_TAX_MIN, DEFAULT_KRBY_PERCENTAGE, DEFAULT_MARKETPLACE_COMPOSABLE_PERCENTAGE, DEFAULT_MARKETPLACE_ROYALTY_DEFAULT_PERCENTAGE, DEFAULT_MARKETPLACE_SALE_PERCENTAGE_MAXIMUM, DEFAULT_MARKETPLACE_SALE_PERCENTAGE_MINIMUM, DEFAULT_MIN_POOL_CREATION_FEE, DEFAULT_MIN_REWARDS_IMPACT, DEFAULT_MODERATOR_PERCENTAGE, DEFAULT_NEW_ESCROW_APPROVAL, DEFAULT_NEW_ESCROW_PARTICIPATION, DEFAULT_NEW_ESCROW_PROPOSAL_CREATION, DEFAULT_NEW_ESCROW_PROPOSAL_POWER, DEFAULT_NEW_ESCROW_VOTING_DURATION, DEFAULT_OMNIGEM_SALE_FEE, DEFAULT_POOL_IMPACT_TAX_MAX, DEFAULT_POOL_IMPACT_TAX_MIN, DEFAULT_POST_FEE, DEFAULT_RAFFLE_COMPOSABLE_PERCENTAGE, DEFAULT_RAFFLE_CREATION_FEE, DEFAULT_RAFFLE_SALE_IMPACT_MAX, DEFAULT_RAFFLE_SALE_IMPACT_TAX_MIN, DEFAULT_REACT_FEE, DEFAULT_REMOVE_ALLOWANCE_APPROVAL, DEFAULT_REMOVE_ALLOWANCE_PARTICIPATION, DEFAULT_REMOVE_ALLOWANCE_PROPOSAL_CREATION, DEFAULT_REMOVE_ALLOWANCE_PROPOSAL_POWER, DEFAULT_REMOVE_ALLOWANCE_VOTING_DURATION, DEFAULT_REMOVE_EXECUTE_PROPOSAL_APPROVAL, DEFAULT_REMOVE_EXECUTE_PROPOSAL_CREATION, DEFAULT_REMOVE_EXECUTE_PROPOSAL_PARTICIPATION, DEFAULT_REMOVE_EXECUTE_PROPOSAL_POWER, DEFAULT_REMOVE_EXECUTE_PROPOSAL_VOTING_DURATION, DEFAULT_REMOVE_PLUGIN_APPROVAL, DEFAULT_REMOVE_PLUGIN_PARTICIPATION, DEFAULT_REMOVE_PLUGIN_PROPOSAL_CREATION, DEFAULT_REMOVE_PLUGIN_PROPOSAL_POWER, DEFAULT_REMOVE_PLUGIN_VOTING_DURATION, DEFAULT_SERVICE_CREATION_FEE, DEFAULT_SHUFFLE_SALE_PERCENTAGE, DEFAULT_SUBSCRIPTION_PAYMENT_PERCENTAGE, DEFAULT_SUBSCRIPTION_TRIGGER_PERCENTAGE, DEFAULT_SWAP_COMPOSABLE_PERCENTAGE, DEFAULT_SWAP_FEE_IMPACT_TAX_MAX, DEFAULT_SWAP_FEE_IMPACT_TAX_MIN, DEFAULT_SWAP_LIQUIDITY_PERCENTAGE, DEFAULT_UPDATE_FIELD_APPROVAL, DEFAULT_UPDATE_FIELD_PARTICIPATION, DEFAULT_UPDATE_FIELD_PROPOSAL_CREATION, DEFAULT_UPDATE_FIELD_PROPOSAL_POWER, DEFAULT_UPDATE_FIELD_VOTING_DURATION, DEFAULT_UPGRADE_APP_APPROVAL, DEFAULT_UPGRADE_APP_PARTICIPATION, DEFAULT_UPGRADE_APP_PROPOSAL_CREATION, DEFAULT_UPGRADE_APP_PROPOSAL_POWER, DEFAULT_UPGRADE_APP_VOTING_DURATION, DEFAULT_WALLET_CREATE_FEE } from '../../smart_contracts/utils/defaults'
import { AkitaDaoSDK, EMPTY_CID } from 'akita-sdk';
import { algo } from '@algorandfoundation/algokit-utils';

type DeployParams = FixtureAndAccount & { apps: Partial<AkitaDaoApps> }

export const deployAkitaDAO = async ({
  fixture,
  apps: {
    staking = 0n,
    rewards = 0n,
    pool = 0n,
    prizeBox = 0n,
    subscriptions = 0n,
    gate = 0n,
    auction = 0n,
    hyperSwap = 0n,
    raffle = 0n,
    metaMerkles = 0n,
    marketplace = 0n,
    akitaNfd = 0n,
    optin = 0n,
    social = 0n,
    impact = 0n,
    vrfBeacon = 0n,
    nfdRegistry = 0n,
    assetInbox = 0n,
    walletFactory = 0n,
    escrowFactory = 0n,
  },
  sender,
  signer
}: DeployParams): Promise<AkitaDaoSDK> => {
  const { algorand } = fixture.context

  const factory = algorand.client.getTypedAppFactory(
    AkitaDaoFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  const results = await factory.send.create.create({
    args: {
      version: '0.0.1',
      akta: 0n,
      contentPolicy: EMPTY_CID,
      minRewardsImpact: DEFAULT_MIN_REWARDS_IMPACT,
      apps: {
        staking,
        rewards,
        pool,
        prizeBox,
        subscriptions,
        gate,
        auction,
        hyperSwap,
        raffle,
        metaMerkles,
        marketplace,
        akitaNfd,
        optin,
        social,
        impact,
        vrfBeacon,
        nfdRegistry,
        assetInbox,
        walletFactory,
        escrowFactory,
      },
      fees: {
        walletCreateFee: DEFAULT_WALLET_CREATE_FEE,
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
          fee: DEFAULT_UPGRADE_APP_PROPOSAL_CREATION,
          power: DEFAULT_UPGRADE_APP_PROPOSAL_POWER,
          duration: DEFAULT_UPGRADE_APP_VOTING_DURATION,
          participation: DEFAULT_UPGRADE_APP_PARTICIPATION,
          approval: DEFAULT_UPGRADE_APP_APPROVAL
        },
        addPlugin: {
          fee: DEFAULT_ADD_PLUGIN_PROPOSAL_CREATION,
          power: DEFAULT_ADD_PLUGIN_PROPOSAL_POWER,
          duration: DEFAULT_ADD_PLUGIN_VOTING_DURATION,
          participation: DEFAULT_ADD_PLUGIN_PARTICIPATION,
          approval: DEFAULT_ADD_PLUGIN_APPROVAL
        },
        removeExecutePlugin: {
          fee: DEFAULT_REMOVE_EXECUTE_PROPOSAL_CREATION,
          power: DEFAULT_REMOVE_EXECUTE_PROPOSAL_POWER,
          duration: DEFAULT_REMOVE_EXECUTE_PROPOSAL_VOTING_DURATION,
          participation: DEFAULT_REMOVE_EXECUTE_PROPOSAL_PARTICIPATION,
          approval: DEFAULT_REMOVE_EXECUTE_PROPOSAL_APPROVAL
        },
        removePlugin: {
          fee: DEFAULT_REMOVE_PLUGIN_PROPOSAL_CREATION,
          power: DEFAULT_REMOVE_PLUGIN_PROPOSAL_POWER,
          duration: DEFAULT_REMOVE_PLUGIN_VOTING_DURATION,
          participation: DEFAULT_REMOVE_PLUGIN_PARTICIPATION,
          approval: DEFAULT_REMOVE_PLUGIN_APPROVAL
        },
        addAllowance: {
          fee: DEFAULT_ADD_ALLOWANCE_PROPOSAL_CREATION,
          power: DEFAULT_ADD_ALLOWANCE_PROPOSAL_POWER,
          duration: DEFAULT_ADD_ALLOWANCE_VOTING_DURATION,
          participation: DEFAULT_ADD_ALLOWANCE_PARTICIPATION,
          approval: DEFAULT_ADD_ALLOWANCE_APPROVAL
        },
        newEscrow: {
          fee: DEFAULT_NEW_ESCROW_PROPOSAL_CREATION,
          power: DEFAULT_NEW_ESCROW_PROPOSAL_POWER,
          duration: DEFAULT_NEW_ESCROW_VOTING_DURATION,
          participation: DEFAULT_NEW_ESCROW_PARTICIPATION,
          approval: DEFAULT_NEW_ESCROW_APPROVAL
        },
        removeAllowance: {
          fee: DEFAULT_REMOVE_ALLOWANCE_PROPOSAL_CREATION,
          power: DEFAULT_REMOVE_ALLOWANCE_PROPOSAL_POWER,
          duration: DEFAULT_REMOVE_ALLOWANCE_VOTING_DURATION,
          participation: DEFAULT_REMOVE_ALLOWANCE_PARTICIPATION,
          approval: DEFAULT_REMOVE_ALLOWANCE_APPROVAL
        },
        updateFields: {
          fee: DEFAULT_UPDATE_FIELD_PROPOSAL_CREATION,
          power: DEFAULT_UPDATE_FIELD_PROPOSAL_POWER,
          duration: DEFAULT_UPDATE_FIELD_VOTING_DURATION,
          participation: DEFAULT_UPDATE_FIELD_PARTICIPATION,
          approval: DEFAULT_UPDATE_FIELD_APPROVAL
        }
      }
    }
  })

  const client = results.appClient

  client.appClient.fundAppAccount({ amount: algo(1) })

  console.log('Akita DAO deployed with appId:', client.appId);

  // mint the DAOs ARC58 wallet
  // await client.send.setup({ args: {}, extraFee: (100_000).microAlgos() })

  return new AkitaDaoSDK({
    algorand,
    factoryParams: {
      appId: client.appId,
      defaultSender: sender,
      defaultSigner: signer,
    }
  });
}