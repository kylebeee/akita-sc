import { microAlgo } from '@algorandfoundation/algokit-utils';
import { AlgorandFixture } from '@algorandfoundation/algokit-utils/types/testing';
import { proposeAndExecute } from '../../scripts/utils';
import { setCurrentNetwork } from 'akita-sdk';
import { AuctionFactorySDK } from 'akita-sdk/auction';
import { AkitaDaoSDK, EMPTY_CID, ProposalActionEnum, SplitDistributionType } from 'akita-sdk/dao';
import { AkitaDaoDeployableSDK } from 'akita-sdk/dao-deployable';
import { MarketplaceSDK } from 'akita-sdk/marketplace';
import { PollFactorySDK } from 'akita-sdk/poll';
import { PrizeBoxFactorySDK } from 'akita-sdk/prize-box';
import { RaffleFactorySDK } from 'akita-sdk/raffle';
import { SocialSDK } from 'akita-sdk/social';
import { StakingSDK } from 'akita-sdk/staking';
import { StakingPoolFactorySDK } from 'akita-sdk/staking-pool';
import { SubscriptionsSDK } from 'akita-sdk/subscriptions';
import {
  AsaMintPluginSDK,
  AuctionPluginSDK,
  DAOPluginSDK,
  DualStakePluginSDK,
  GatePluginSDK,
  HyperSwapPluginSDK,
  MarketplacePluginSDK,
  NFDPluginSDK,
  OptInPluginSDK,
  PayPluginSDK,
  PaySiloFactoryPluginSDK,
  PaySiloPluginSDK,
  PollPluginSDK,
  RafflePluginSDK,
  RevenueManagerPluginSDK,
  RewardsPluginSDK,
  SocialPluginSDK,
  StakingPluginSDK,
  StakingPoolPluginSDK,
  SubscriptionsPluginSDK,
  UpdateAkitaDAOPluginSDK,
  WalletFactorySDK
} from 'akita-sdk/wallet';
import algosdk, { ALGORAND_ZERO_ADDRESS_STRING, getApplicationAddress } from 'algosdk';
import { AkitaDaoApps, AkitaDaoFactory } from '../../smart_contracts/artifacts/arc58/dao-deployable/AkitaDAOClient';
import { EscrowFactoryClient } from '../../smart_contracts/artifacts/escrow/EscrowFactoryClient';
import { GateClient } from '../../smart_contracts/artifacts/gates/GateClient';
import { HyperSwapClient } from '../../smart_contracts/artifacts/hyper-swap/HyperSwapClient';
import { MetaMerklesClient } from '../../smart_contracts/artifacts/meta-merkles/MetaMerklesClient';
import { RewardsClient } from '../../smart_contracts/artifacts/rewards/RewardsClient';
import { DEFAULT_ADD_ALLOWANCE_APPROVAL, DEFAULT_ADD_ALLOWANCE_PARTICIPATION, DEFAULT_ADD_ALLOWANCE_PROPOSAL_CREATION, DEFAULT_ADD_ALLOWANCE_PROPOSAL_POWER, DEFAULT_ADD_ALLOWANCE_VOTING_DURATION, DEFAULT_ADD_PLUGIN_APPROVAL, DEFAULT_ADD_PLUGIN_PARTICIPATION, DEFAULT_ADD_PLUGIN_PROPOSAL_CREATION, DEFAULT_ADD_PLUGIN_PROPOSAL_POWER, DEFAULT_ADD_PLUGIN_VOTING_DURATION, DEFAULT_AUCTION_COMPOSABLE_PERCENTAGE, DEFAULT_AUCTION_CREATION_FEE, DEFAULT_AUCTION_RAFFLE_PERCENTAGE, DEFAULT_AUCTION_SALE_IMPACT_MAX, DEFAULT_AUCTION_SALE_IMPACT_TAX_MIN, DEFAULT_CREATION, DEFAULT_IMPACT_TAX_MAX, DEFAULT_IMPACT_TAX_MIN, DEFAULT_KRBY_PERCENTAGE, DEFAULT_MARKETPLACE_COMPOSABLE_PERCENTAGE, DEFAULT_MARKETPLACE_ROYALTY_DEFAULT_PERCENTAGE, DEFAULT_MARKETPLACE_SALE_PERCENTAGE_MAXIMUM, DEFAULT_MARKETPLACE_SALE_PERCENTAGE_MINIMUM, DEFAULT_MIN_POOL_CREATION_FEE, DEFAULT_MIN_REWARDS_IMPACT, DEFAULT_MODERATOR_PERCENTAGE, DEFAULT_NEW_ESCROW_APPROVAL, DEFAULT_NEW_ESCROW_PARTICIPATION, DEFAULT_NEW_ESCROW_PROPOSAL_CREATION, DEFAULT_NEW_ESCROW_PROPOSAL_POWER, DEFAULT_NEW_ESCROW_VOTING_DURATION, DEFAULT_OMNIGEM_SALE_FEE, DEFAULT_POOL_IMPACT_TAX_MAX, DEFAULT_POOL_IMPACT_TAX_MIN, DEFAULT_POST_FEE, DEFAULT_RAFFLE_COMPOSABLE_PERCENTAGE, DEFAULT_RAFFLE_CREATION_FEE, DEFAULT_RAFFLE_SALE_IMPACT_MAX, DEFAULT_RAFFLE_SALE_IMPACT_TAX_MIN, DEFAULT_REACT_FEE, DEFAULT_REMOVE_ALLOWANCE_APPROVAL, DEFAULT_REMOVE_ALLOWANCE_PARTICIPATION, DEFAULT_REMOVE_ALLOWANCE_PROPOSAL_CREATION, DEFAULT_REMOVE_ALLOWANCE_PROPOSAL_POWER, DEFAULT_REMOVE_ALLOWANCE_VOTING_DURATION, DEFAULT_REMOVE_EXECUTE_PROPOSAL_APPROVAL, DEFAULT_REMOVE_EXECUTE_PROPOSAL_CREATION, DEFAULT_REMOVE_EXECUTE_PROPOSAL_PARTICIPATION, DEFAULT_REMOVE_EXECUTE_PROPOSAL_POWER, DEFAULT_REMOVE_EXECUTE_PROPOSAL_VOTING_DURATION, DEFAULT_REMOVE_PLUGIN_APPROVAL, DEFAULT_REMOVE_PLUGIN_PARTICIPATION, DEFAULT_REMOVE_PLUGIN_PROPOSAL_CREATION, DEFAULT_REMOVE_PLUGIN_PROPOSAL_POWER, DEFAULT_REMOVE_PLUGIN_VOTING_DURATION, DEFAULT_SERVICE_CREATION_FEE, DEFAULT_SHUFFLE_SALE_PERCENTAGE, DEFAULT_SUBSCRIPTION_PAYMENT_PERCENTAGE, DEFAULT_SUBSCRIPTION_TRIGGER_PERCENTAGE, DEFAULT_SWAP_COMPOSABLE_PERCENTAGE, DEFAULT_SWAP_FEE_IMPACT_TAX_MAX, DEFAULT_SWAP_FEE_IMPACT_TAX_MIN, DEFAULT_SWAP_LIQUIDITY_PERCENTAGE, DEFAULT_TOGGLE_ESCROW_LOCK_APPROVAL, DEFAULT_TOGGLE_ESCROW_LOCK_PARTICIPATION, DEFAULT_TOGGLE_ESCROW_LOCK_PROPOSAL_CREATION, DEFAULT_TOGGLE_ESCROW_LOCK_PROPOSAL_POWER, DEFAULT_TOGGLE_ESCROW_LOCK_VOTING_DURATION, DEFAULT_UPDATE_AKITA_DAO_APP_APPROVAL, DEFAULT_UPDATE_AKITA_DAO_DURATION, DEFAULT_UPDATE_AKITA_DAO_PARTICIPATION, DEFAULT_UPDATE_AKITA_DAO_PROPOSAL_CREATION, DEFAULT_UPDATE_AKITA_DAO_PROPOSAL_POWER, DEFAULT_UPDATE_FIELD_APPROVAL, DEFAULT_UPDATE_FIELD_PARTICIPATION, DEFAULT_UPDATE_FIELD_PROPOSAL_CREATION, DEFAULT_UPDATE_FIELD_PROPOSAL_POWER, DEFAULT_UPDATE_FIELD_VOTING_DURATION, DEFAULT_UPGRADE_APP_APPROVAL, DEFAULT_UPGRADE_APP_PARTICIPATION, DEFAULT_UPGRADE_APP_PROPOSAL_CREATION, DEFAULT_UPGRADE_APP_PROPOSAL_POWER, DEFAULT_UPGRADE_APP_VOTING_DURATION, DEFAULT_WALLET_CREATE_FEE, DEFAULT_WALLET_REFERRER_PERCENTAGE } from '../../smart_contracts/utils/defaults';
import { FixtureAndAccount } from '../types';
import { logger } from '../utils/logger';
import { deployAbstractedAccountFactory } from './abstracted-account';
import { deployAuctionFactory } from './auction';
import { deployEscrowFactory } from './escrow';
import { deployGate } from './gate';
import { deployHyperSwap } from './hyper-swap';
import { deployMarketplace } from './marketplace';
import { deployMetaMerkles } from './meta-merkles';
import { deployAsaMintPlugin } from './plugins/asa-mint';
import { deployAuctionPlugin } from './plugins/auction';
import { deployDAOPlugin } from './plugins/dao';
import { deployDualStakePlugin } from './plugins/dual-stake';
import { deployGatePlugin } from './plugins/gate';
import { deployHyperSwapPlugin } from './plugins/hyper-swap';
import { deployMarketplacePlugin } from './plugins/marketplace';
import { deployNFDPlugin } from './plugins/nfd';
import { deployOptInPlugin } from './plugins/optin';
import { deployPayPlugin } from './plugins/pay';
import { deployPaySiloPlugin } from './plugins/pay-silo';
import { deployPaySiloFactoryPlugin } from './plugins/pay-silo-factory';
import { deployPollPlugin } from './plugins/poll';
import { deployRafflePlugin } from './plugins/raffle';
import { deployRevenueManagerPlugin } from './plugins/revenue-manager';
import { deployRewardsPlugin } from './plugins/rewards';
import { deploySocialPlugin } from './plugins/social';
import { deployStakingPlugin } from './plugins/staking';
import { deployStakingPoolPlugin } from './plugins/staking-pool';
import { deploySubscriptionsPlugin } from './plugins/subscriptions';
import { deployUpdateAkitaDaoPlugin } from './plugins/update-akita-dao';
import { deployPollFactory } from './poll';
import { deployPrizeBoxFactory } from './prize-box';
import { deployRaffleFactory } from './raffle';
import { deployRewards } from './rewards';
import { deploySocialSystem } from './social';
import { deployStaking } from './staking';
import { deployStakingPoolFactory } from './staking-pool';
import { deployAllSubgates, SubgateClients } from './subgates';
import { deploySubscriptions } from './subscriptions';

type DeployParams = FixtureAndAccount & { apps?: Partial<AkitaDaoApps> }
type BuildUniverseParams = DeployParams & {
  aktaAssetId?: bigint
  usdcAssetId?: bigint
  network?: 'localnet' | 'testnet' | 'mainnet'
}

// Asset configurations for localnet test assets
// Note: Using 6 decimals to match the fee structure (DEFAULT_POST_FEE = 100_000_000 = 100 AKTA)
const TEST_AKTA_CONFIG = {
  name: 'Akita (Test)',
  unitName: 'AKTA',
  decimals: 6,
  total: 1_000_000_000_000_000n, // 1 billion AKTA with 6 decimals
}

const TEST_USDC_CONFIG = {
  name: 'USD Coin (Test)',
  unitName: 'USDC',
  decimals: 6,
  total: 10_000_000_000_000_000n, // 10 billion with 6 decimals
}

/**
 * Create a test asset on localnet
 */
async function createTestAsset(
  fixture: AlgorandFixture,
  sender: string,
  signer: algosdk.TransactionSigner,
  config: { name: string; unitName: string; decimals: number; total: bigint }
): Promise<bigint> {
  const { algorand } = fixture.context
  const suggestedParams = await algorand.client.algod.getTransactionParams().do()
  
  const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    sender,
    total: config.total,
    decimals: config.decimals,
    defaultFrozen: false,
    unitName: config.unitName,
    assetName: config.name,
    manager: sender,
    reserve: sender,
    freeze: sender,
    clawback: sender,
    suggestedParams,
  })
  
  const signedTxn = await signer([txn], [0])
  const { txid } = await algorand.client.algod.sendRawTransaction(signedTxn[0]).do()
  
  // Wait for confirmation
  const result = await algosdk.waitForConfirmation(algorand.client.algod, txid, 4)
  const assetId = BigInt(result.assetIndex!)
  
  logger.deploy(`Test Asset: ${config.unitName}`, assetId, sender)
  
  return assetId
}
export const AkitaDAOGlobalStateKeysRevenueSplits = 'revenue_splits'


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
    revenueManager = 0n,
    update = 0n,
    social = 0n,
    graph = 0n,
    impact = 0n,
    moderation = 0n,
    vrfBeacon = 0n,
    nfdRegistry = 0n,
    assetInbox = 0n,
    wallet = 0n,
    escrow = 0n,
    poll = 0n,
  } = {},
  sender,
  signer
}: DeployParams): Promise<AkitaDaoDeployableSDK> => {
  // Ensure network is set for SDK initialization (fixtures are always localnet)
  setCurrentNetwork('localnet');
  
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
        revenueManager,
        update,
        social,
        graph,
        impact,
        moderation,
        vrfBeacon,
        nfdRegistry,
        assetInbox,
        wallet,
        escrow,
        poll,
      },
      fees: {
        walletCreateFee: DEFAULT_WALLET_CREATE_FEE,
        walletReferrerPercentage: DEFAULT_WALLET_REFERRER_PERCENTAGE,
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
        toggleEscrowLock: {
          fee: DEFAULT_TOGGLE_ESCROW_LOCK_PROPOSAL_CREATION,
          power: DEFAULT_TOGGLE_ESCROW_LOCK_PROPOSAL_POWER,
          duration: DEFAULT_TOGGLE_ESCROW_LOCK_VOTING_DURATION,
          participation: DEFAULT_TOGGLE_ESCROW_LOCK_PARTICIPATION,
          approval: DEFAULT_TOGGLE_ESCROW_LOCK_APPROVAL
        },
        updateFields: {
          fee: DEFAULT_UPDATE_FIELD_PROPOSAL_CREATION,
          power: DEFAULT_UPDATE_FIELD_PROPOSAL_POWER,
          duration: DEFAULT_UPDATE_FIELD_VOTING_DURATION,
          participation: DEFAULT_UPDATE_FIELD_PARTICIPATION,
          approval: DEFAULT_UPDATE_FIELD_APPROVAL
        }
      },
      revenueSplits: []
    }
  })

  const client = results.appClient

  client.appClient.fundAppAccount({ amount: microAlgo(1318600n) })

  logger.deploy('Akita DAO', client.appId, client.appAddress.toString());

  return new AkitaDaoDeployableSDK({
    algorand,
    factoryParams: {
      appId: client.appId,
      defaultSender: sender,
      defaultSigner: signer,
    }
  });
}

export type AkitaUniverse = {
  dao: AkitaDaoSDK;
  walletFactory: WalletFactorySDK;
  subscriptions: SubscriptionsSDK;
  stakingPoolFactory: StakingPoolFactorySDK;
  staking: StakingSDK;
  rewards: { client: RewardsClient; appId: bigint };
  social: SocialSDK;
  auctionFactory: AuctionFactorySDK;
  marketplace: MarketplaceSDK;
  raffleFactory: RaffleFactorySDK;
  pollFactory: PollFactorySDK;
  prizeBoxFactory: PrizeBoxFactorySDK;
  revenueManagerPlugin: RevenueManagerPluginSDK;
  updatePlugin: UpdateAkitaDAOPluginSDK;
  optInPlugin: OptInPluginSDK;
  asaMintPlugin: AsaMintPluginSDK;
  payPlugin: PayPluginSDK;
  hyperSwapPlugin: HyperSwapPluginSDK;
  subscriptionsPlugin: SubscriptionsPluginSDK;
  auctionPlugin: AuctionPluginSDK;
  daoPlugin: DAOPluginSDK;
  dualStakePlugin: DualStakePluginSDK;
  gatePlugin: GatePluginSDK;
  marketplacePlugin: MarketplacePluginSDK;
  nfdPlugin: NFDPluginSDK;
  paySiloPlugin: PaySiloPluginSDK;
  paySiloFactoryPlugin: PaySiloFactoryPluginSDK;
  pollPlugin: PollPluginSDK;
  rafflePlugin: RafflePluginSDK;
  rewardsPlugin: RewardsPluginSDK;
  socialPlugin: SocialPluginSDK;
  stakingPlugin: StakingPluginSDK;
  stakingPoolPlugin: StakingPoolPluginSDK;
  escrowFactory: EscrowFactoryClient;
  // New contracts
  gate: { client: GateClient; appId: bigint };
  hyperSwap: { client: HyperSwapClient; appId: bigint };
  metaMerkles: { client: MetaMerklesClient; appId: bigint };
  subgates: SubgateClients;
  // Test/Token assets
  aktaAssetId: bigint;
  bonesAssetId: bigint;
  usdcAssetId: bigint;
}

export const buildAkitaUniverse = async (params: BuildUniverseParams): Promise<AkitaUniverse> => {

  if (!params.sender) {
    throw new Error('Sender is required to deploy and setup Akita DAO');
  }

  const { fixture, aktaAssetId: providedAktaAssetId, usdcAssetId: providedUsdcAssetId, network = 'localnet' } = params;
  const isLocalnet = network === 'localnet';

  // Set the current network so SDKs can resolve app IDs correctly
  setCurrentNetwork(network);

  logger.startBuild();

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 0: Create Test Assets (localnet only)
  // ═══════════════════════════════════════════════════════════════════════════
  let aktaAssetId = providedAktaAssetId ?? 0n;
  let usdcAssetId = providedUsdcAssetId ?? 0n;

  if (isLocalnet) {
    logger.phase('CREATE_TEST_ASSETS');
    
    if (!params.signer) {
      throw new Error('Signer is required to create test assets');
    }

    // Create test AKTA asset if not provided
    if (!providedAktaAssetId || providedAktaAssetId === 0n) {
      aktaAssetId = await createTestAsset(fixture as AlgorandFixture, params.sender.toString(), params.signer, TEST_AKTA_CONFIG);
    }
    
    // Create test USDC asset if not provided
    if (!providedUsdcAssetId || providedUsdcAssetId === 0n) {
      usdcAssetId = await createTestAsset(fixture as AlgorandFixture, params.sender.toString(), params.signer, TEST_USDC_CONFIG);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 1: Deploy Core Contracts
  // ═══════════════════════════════════════════════════════════════════════════
  logger.phase('DEPLOY_CORE');

  const escrowFactory = await deployEscrowFactory({
    fixture,
    sender: params.sender,
    signer: params.signer
  });
  logger.deploy('Escrow Factory', escrowFactory.appId, escrowFactory.appAddress.toString());

  // Get dispenser only on fixture (for auto-funding during tests)
  const dispenser = isLocalnet ? await fixture.algorand.account.dispenserFromEnvironment() : null;

  // Deploy DAO with the deployable version (has setup() for initial wallet creation)
  const deployableDao = await deployAkitaDAO({ ...params, apps: { ...params.apps, escrow: escrowFactory.appId } });
  let dao: AkitaDaoSDK = deployableDao;

  // Now deploy Rewards contract with the actual DAO app ID
  const rewardsClient = await deployRewards({
    fixture,
    sender: params.sender,
    signer: params.signer,
    args: {
      akitaDao: dao.appId,
      version: '0.0.1',
    }
  });
  logger.deploy('Rewards', rewardsClient.appId, rewardsClient.appAddress.toString());

  // Fund the rewards contract (on fixture use dispenser, on testnet/mainnet use direct payment)
  if (isLocalnet && dispenser) {
    await fixture.algorand.account.ensureFunded(rewardsClient.appAddress, dispenser, (10).algos());
    // Fund sender with enough ALGO to cover all proposals, executions, and MetaMerkles type registration
    // Each proposal costs ~1-20 ALGO, we make 15+ proposals, and MetaMerkles addType costs 100 ALGO x4
    await fixture.algorand.account.ensureFunded(params.sender, dispenser, (1000).algos());
    await fixture.algorand.account.ensureFunded(dao.readerAccount, dispenser, (1).algos());
  } else {
    // On testnet/mainnet, fund contracts directly from the sender account
    await fixture.algorand.send.payment({
      sender: params.sender,
      signer: params.signer,
      receiver: rewardsClient.appAddress,
      amount: (10).algos(),
    });
  }

  const abstractAccountFactory = await deployAbstractedAccountFactory({
    fixture,
    sender: params.sender,
    signer: params.signer,
    args: {
      akitaDao: dao.appId,
      version: '0.0.1',
      escrowFactory: escrowFactory.appId,
    }
  });
  logger.deploy('Wallet Factory', abstractAccountFactory.appId, abstractAccountFactory.client.appAddress.toString());

  const subscriptionsSdk = await deploySubscriptions({
    fixture,
    sender: params.sender,
    signer: params.signer,
    args: {
      akitaDao: dao.appId,
      version: '0.0.1',
      akitaDaoEscrow: 0n,
    }
  });
  logger.deploy('Subscriptions', subscriptionsSdk.appId, subscriptionsSdk.client.appAddress.toString());

  const stakingPoolFactorySdk = await deployStakingPoolFactory({
    fixture,
    sender: params.sender,
    signer: params.signer,
    args: {
      akitaDao: dao.appId,
      version: '0.0.1',
    }
  });
  logger.deploy('Staking Pool Factory', stakingPoolFactorySdk.appId, stakingPoolFactorySdk.client.appAddress.toString());

  const stakingClient = await deployStaking({
    fixture,
    sender: params.sender,
    signer: params.signer,
    args: {
      akitaDao: dao.appId,
      version: '0.0.1',
    }
  });

  // Fund the staking contract
  await stakingClient.appClient.fundAppAccount({ amount: (1_000_000).microAlgos() });
  // Initialize the staking contract
  await stakingClient.send.init({ args: {} });

  const stakingSdk = new StakingSDK({
    algorand: fixture.algorand,
    factoryParams: {
      appId: stakingClient.appId,
      defaultSender: params.sender,
      defaultSigner: params.signer,
    }
  });
  logger.deploy('Staking', stakingClient.appId, stakingClient.appAddress.toString());

  // Deploy Social System (Social, Graph, Impact contracts) with escrow = 0n initially
  const socialSystem = await deploySocialSystem({
    fixture,
    sender: params.sender,
    signer: params.signer,
    args: {
      akitaDao: dao.appId,
      akitaDaoEscrow: 0n, // Will be updated later with proper escrow ID
      version: '0.0.1',
    }
  });
  logger.deploy('Social System', socialSystem.socialClient.appId, socialSystem.socialClient.appAddress.toString());

  // Fund social contracts
  await socialSystem.socialClient.appClient.fundAppAccount({ amount: (10_000_000).microAlgos() });
  await socialSystem.graphClient.appClient.fundAppAccount({ amount: (10_000_000).microAlgos() });
  await socialSystem.impactClient.appClient.fundAppAccount({ amount: (10_000_000).microAlgos() });

  // Deploy Auction Factory (with escrow = 0n initially, will be updated later)
  const auctionFactoryResult = await deployAuctionFactory({
    fixture,
    sender: params.sender,
    signer: params.signer,
    args: {
      akitaDao: dao.appId,
      version: '0.0.1',
      childVersion: '0.0.1',
      akitaDaoEscrow: 0n,
    }
  });
  logger.deploy('Auction Factory', auctionFactoryResult.client.appId, auctionFactoryResult.client.appAddress.toString());

  // Deploy Marketplace (with escrow = 0n initially, will be updated later)
  const marketplaceResult = await deployMarketplace({
    fixture,
    sender: params.sender,
    signer: params.signer,
    args: {
      akitaDao: dao.appId,
      version: '0.0.1',
      childVersion: '0.0.1',
      akitaDaoEscrow: 0n,
    }
  });
  logger.deploy('Marketplace', marketplaceResult.client.appId, marketplaceResult.client.appAddress.toString());

  // Deploy Raffle Factory (with escrow = 0n initially, will be updated later)
  const raffleFactoryResult = await deployRaffleFactory({
    fixture,
    sender: params.sender,
    signer: params.signer,
    args: {
      akitaDao: dao.appId,
      version: '0.0.1',
      childVersion: '0.0.1',
      akitaDaoEscrow: 0n,
    }
  });
  logger.deploy('Raffle Factory', raffleFactoryResult.client.appId, raffleFactoryResult.client.appAddress.toString());

  // Deploy Poll Factory (with escrow = 0n initially, will be updated later)
  const pollFactoryResult = await deployPollFactory({
    fixture,
    sender: params.sender,
    signer: params.signer,
    args: {
      akitaDao: dao.appId,
      version: '0.0.1',
      childVersion: '0.0.1',
      akitaDaoEscrow: 0n,
    }
  });
  logger.deploy('Poll Factory', pollFactoryResult.client.appId, pollFactoryResult.client.appAddress.toString());

  // Deploy Prize Box Factory
  const prizeBoxFactoryResult = await deployPrizeBoxFactory({
    fixture,
    sender: params.sender,
    signer: params.signer,
    args: {
      version: '0.0.1',
      akitaDao: dao.appId,
    }
  });
  logger.deploy('Prize Box Factory', prizeBoxFactoryResult.client.appId, prizeBoxFactoryResult.client.appAddress.toString());

  // Deploy MetaMerkles (type registration costs 400 ALGO, re-fund sender if needed)
  if (isLocalnet && dispenser) {
    await fixture.algorand.account.ensureFunded(params.sender, dispenser, (500).algos());
  }
  const metaMerklesResult = await deployMetaMerkles({
    fixture,
    sender: params.sender,
    signer: params.signer,
  });
  logger.deploy('MetaMerkles', metaMerklesResult.appId, metaMerklesResult.client.appAddress.toString());

  // Deploy Gate
  const gateResult = await deployGate({
    fixture,
    sender: params.sender,
    signer: params.signer,
    args: {
      version: '0.0.1',
      akitaDao: dao.appId,
    }
  });
  logger.deploy('Gate', gateResult.appId, gateResult.client.appAddress.toString());

  // Deploy HyperSwap (standalone)
  const hyperSwapResult = await deployHyperSwap({
    fixture,
    sender: params.sender,
    signer: params.signer,
    args: {
      version: '0.0.1',
      akitaDao: dao.appId,
    }
  });
  logger.deploy('HyperSwap', hyperSwapResult.appId, hyperSwapResult.client.appAddress.toString());

  // Deploy all subgates
  const subgatesResult = await deployAllSubgates({
    fixture,
    sender: params.sender,
    signer: params.signer,
    args: {
      version: '0.0.1',
      akitaDao: dao.appId,
    }
  });
  logger.deploy('Subgates', 0n, '(16 subgate contracts deployed)');

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 2: Configure DAO
  // ═══════════════════════════════════════════════════════════════════════════
  logger.phase('CONFIGURE_DAO');

  const updateFieldsProposalId = await proposeAndExecute(fixture.algorand, dao, [
    {
      type: ProposalActionEnum.UpdateFields,
      field: 'aal',
      value: {
        wallet: abstractAccountFactory.appId,
        staking: stakingClient.appId,
        subscriptions: subscriptionsSdk.appId,
        pool: stakingPoolFactorySdk.appId,
        auction: auctionFactoryResult.client.appId,
        marketplace: marketplaceResult.client.appId,
        raffle: raffleFactoryResult.client.appId,
        prizeBox: prizeBoxFactoryResult.client.appId,
        metaMerkles: metaMerklesResult.appId,
        gate: gateResult.appId,
        hyperSwap: hyperSwapResult.appId,
      }
    }
  ]);
  logger.proposal('UpdateFields: Set wallet factory, staking, subscriptions, pool, auction, marketplace, raffle, prizeBox, metaMerkles, gate, and hyperSwap', updateFieldsProposalId);

  const updateSalProposalId = await proposeAndExecute(fixture.algorand, dao, [
    {
      type: ProposalActionEnum.UpdateFields,
      field: 'sal',
      value: {
        social: socialSystem.socialClient.appId,
        moderation: socialSystem.moderationClient.appId,
        graph: socialSystem.graphClient.appId,
        impact: socialSystem.impactClient.appId,
      }
    }
  ]);
  logger.proposal('UpdateFields: Set social apps', updateSalProposalId);

  // Set the otherAppList (oal) with the escrow factory and poll - required for revenue collection
  // External values come from params.otherAppList, escrow and poll are set internally
  const updateOalProposalId = await proposeAndExecute(fixture.algorand, dao, [
    {
      type: ProposalActionEnum.UpdateFields,
      field: 'oal',
      value: {
        escrow: escrowFactory.appId,
        poll: pollFactoryResult.client.appId,
      }
    }
  ]);
  logger.proposal('UpdateFields: Set otherAppList (oal) with escrow factory, poll, and external apps', updateOalProposalId);

  // Fund DAO with setup cost before creating the wallet
  const setupCost = await deployableDao.setupCost();
  await deployableDao.client.appClient.fundAppAccount({ amount: setupCost.microAlgo() });

  await deployableDao.setup();
  logger.wallet('DAO ARC58 Wallet', deployableDao.wallet.client.appId, deployableDao.wallet.client.appAddress.toString());

  // Upgrade to regular AkitaDaoSDK (setup is complete, no longer needed)
  dao = new AkitaDaoSDK({
    algorand: fixture.algorand,
    factoryParams: {
      appId: deployableDao.appId,
      defaultSender: params.sender,
      defaultSigner: params.signer,
    }
  });
  await dao.getWallet();

  // ═══════════════════════════════════════════════════════════════════════════
  // Calculate total wallet MBR needed for all proposals & executions
  // ═══════════════════════════════════════════════════════════════════════════
  // We need MBR for:
  // - 2 global plugins with execution keys (revenue manager, update plugin)
  // - 2 execution key groups
  // - 7 escrows (rec_krby, rec_mod, rec_gov, rev_wallet, rev_subscriptions, rev_pool, rev_social)
  // - 1 global plugin per escrow for opt-in (3 recipient escrows)
  // - 1 global plugin per escrow for revenue manager (4 revenue escrows, each with 3 methods)
  // - Additional buffer for transaction fees and proposal executions

  const recipientEscrowNames = ['rec_krby', 'rec_mod', 'rec_gov'];
  const revenueEscrowNames = ['rev_wallet', 'rev_subscriptions', 'rev_pool', 'rev_social', 'rev_auction', 'rev_marketplace', 'rev_raffle', 'rev_poll'];
  const bonesEscrowNames = ['bones_dau', 'bones_gov', 'bones_public', 'bones_liquidity', 'bones_akta', 'bones_nft', 'bones_team', 'bones_event'];
  const escrowNames = [...recipientEscrowNames, ...revenueEscrowNames, ...bonesEscrowNames];

  // Calculate MBR for all escrows and plugins
  const mbrPromises = [
    // Base wallet MBR with 4 global plugins (revenue manager, update, asa-mint, pay) and 2 execution groups
    dao.wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 4n }),
    // MBR for each escrow creation
    ...escrowNames.map(escrow =>
      dao.wallet.getMbr({ escrow, methodCount: 0n, plugin: '', groups: 0n })
    ),
    // MBR for opt-in plugin on each recipient escrow (no methods)
    ...recipientEscrowNames.map(escrow =>
      dao.wallet.getMbr({ escrow, methodCount: 0n, plugin: 'optin', groups: 0n })
    ),
    // MBR for revenue manager plugin on each revenue escrow (3 methods each)
    ...revenueEscrowNames.map(escrow =>
      dao.wallet.getMbr({ escrow, methodCount: 3n, plugin: 'revenue', groups: 0n })
    ),
    // MBR for opt-in plugin on each bones escrow (temporary, will be removed after opt-in)
    ...bonesEscrowNames.map(escrow =>
      dao.wallet.getMbr({ escrow, methodCount: 0n, plugin: 'optin', groups: 0n })
    )
  ];

  const mbrResults = await Promise.allSettled(mbrPromises);

  let totalWalletMbr = 0n;
  for (const result of mbrResults) {
    if (result.status === 'rejected') {
      logger.error('MBR calculation failed', result.reason);
      throw result.reason;
    }
    // Add up all MBR components
    totalWalletMbr += result.value.plugins;
    totalWalletMbr += result.value.namedPlugins;
    totalWalletMbr += result.value.executions;
    totalWalletMbr += result.value.newEscrowMintCost;
  }

  // Add buffer for transaction fees and additional operations
  const mbrBuffer = 5_000_000n; // 5 ALGO buffer
  totalWalletMbr += mbrBuffer;

  // logger.info?.(`Total wallet MBR calculated: ${totalWalletMbr} microAlgos`);

  // Fund the wallet with all required MBR upfront
  await dao.wallet.client.appClient.fundAppAccount({ amount: totalWalletMbr.microAlgo() });

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 3: Deploy & Install Plugins
  // ═══════════════════════════════════════════════════════════════════════════
  logger.phase('DEPLOY_PLUGINS');

  // Deploy Revenue Manager Plugin
  const revenueManagerPluginSdk = await deployRevenueManagerPlugin({
    fixture,
    sender: params.sender,
    signer: params.signer,
    args: {
      akitaDao: dao.appId,
      version: '0.0.1',
    }
  });
  logger.plugin('deploy', 'RevenueManagerPlugin', revenueManagerPluginSdk.appId);

  if (isLocalnet && dispenser) {
    await fixture.algorand.account.ensureFunded(revenueManagerPluginSdk.client.appAddress, dispenser, (1).algos());
  } else {
    await fixture.algorand.send.payment({
      sender: params.sender,
      signer: params.signer,
      receiver: revenueManagerPluginSdk.client.appAddress,
      amount: (1).algos(),
    });
  }

  await proposeAndExecute(fixture.algorand, dao, [{
    type: ProposalActionEnum.UpdateFields,
    field: 'pal',
    value: {
      revenueManager: revenueManagerPluginSdk.appId
    }
  }]);

  const installRevenueManagerProposalId = await proposeAndExecute(fixture.algorand, dao, [
    {
      type: ProposalActionEnum.AddPlugin,
      client: revenueManagerPluginSdk,
      global: true,
      escrow: '',
      sourceLink: 'https://github.com/kylebee/akita-sc',
      useExecutionKey: true,
      fee: DEFAULT_CREATION,
      power: DEFAULT_UPGRADE_APP_PROPOSAL_POWER,
      duration: DEFAULT_UPGRADE_APP_VOTING_DURATION,
      participation: DEFAULT_UPGRADE_APP_PARTICIPATION,
      approval: DEFAULT_UPGRADE_APP_APPROVAL,
    }
  ]);
  logger.proposal('Install RevenueManagerPlugin (global)', installRevenueManagerProposalId);

  // Deploy UpdateAkitaDAO Plugin
  const daoUpdatePluginSdk = await deployUpdateAkitaDaoPlugin({
    fixture,
    sender: params.sender,
    signer: params.signer,
    args: {
      akitaDao: dao.appId,
    }
  });
  logger.plugin('deploy', 'UpdateAkitaDAOPlugin', daoUpdatePluginSdk.appId);

  await proposeAndExecute(fixture.algorand, dao, [
    {
      type: ProposalActionEnum.UpdateFields,
      field: 'pal',
      value: { update: daoUpdatePluginSdk.appId }
    }
  ]);

  // Install UpdateAkitaDAO Plugin
  const installUpdatePluginProposalId = await proposeAndExecute(fixture.algorand, dao, [
    {
      type: ProposalActionEnum.AddPlugin,
      fee: DEFAULT_UPDATE_AKITA_DAO_PROPOSAL_CREATION,
      power: DEFAULT_UPDATE_AKITA_DAO_PROPOSAL_POWER,
      duration: DEFAULT_UPDATE_AKITA_DAO_DURATION,
      participation: DEFAULT_UPDATE_AKITA_DAO_PARTICIPATION,
      approval: DEFAULT_UPDATE_AKITA_DAO_APP_APPROVAL,
      sourceLink: 'https://github.com/kylebee/akita-sc',
      client: daoUpdatePluginSdk,
      global: true,
      useExecutionKey: true,
    }
  ]);
  logger.proposal('Install UpdateAkitaDAOPlugin (global)', installUpdatePluginProposalId);

  // Update the DAO's akitaAppList with the rewards app ID (DAO was deployed with rewards: 0n)
  const updateRewardsInDaoProposalId = await proposeAndExecute(fixture.algorand, dao, [
    {
      type: ProposalActionEnum.UpdateFields,
      field: 'aal',
      value: {
        rewards: rewardsClient.appId
      }
    }
  ]);
  logger.proposal('UpdateFields: Set rewards app in akitaAppList', updateRewardsInDaoProposalId);

  const krbyEscrow = 'rec_krby'
  const modEscrow = 'rec_mod'
  const govEscrow = 'rec_gov'

  const walletFactoryRevenueEscrow = 'rev_wallet';
  const auctionFactoryRevenueEscrow = 'rev_auction';
  const marketplaceRevenueEscrow = 'rev_marketplace';
  const raffleFactoryRevenueEscrow = 'rev_raffle';
  const socialFactoryRevenueEscrow = 'rev_social';
  const subscriptionsFactoryRevenueEscrow = 'rev_subscriptions';
  const stakingPoolFactoryRevenueEscrow = 'rev_pool';
  const pollFactoryRevenueEscrow = 'rev_poll';

  // Create rev_wallet escrow first so we can get its ID for wallet factory configuration
  await proposeAndExecute(fixture.algorand, dao, [{ type: ProposalActionEnum.NewEscrow, escrow: walletFactoryRevenueEscrow }]);
  logger.escrow(walletFactoryRevenueEscrow, 'create');

  // Get rev_wallet escrow info and update wallet factory escrow
  const revWallet = await dao.wallet.getEscrow(walletFactoryRevenueEscrow);

  const { lease, firstValid, lastValid, ids: groups, atcs } = await dao.wallet.build.usePlugin({
    sender: params.sender,
    signer: params.signer,
    lease: 'update_escrow_app',
    windowSize: 2000n,
    global: true,
    calls: [
      daoUpdatePluginSdk.updateAkitaDaoEscrowForApp({
        appId: abstractAccountFactory.appId,
        newEscrow: revWallet.id
      })
    ]
  });

  const executePluginProposalId = await proposeAndExecute(fixture.algorand, dao, [
    {
      type: ProposalActionEnum.ExecutePlugin,
      plugin: daoUpdatePluginSdk.appId,
      caller: params.sender.toString(),
      escrow: '',
      executionKey: lease,
      groups,
      firstValid,
      lastValid
    }
  ]);

  await atcs[0].submit(dao.wallet.client.algorand.client.algod);
  logger.proposal('Update wallet factory escrow', executePluginProposalId);

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 4: Setup Revenue Escrows
  // ═══════════════════════════════════════════════════════════════════════════
  logger.phase('SETUP_ESCROWS');

  // Ensure sender has enough funds for the remaining proposals (fixture only)
  if (isLocalnet && dispenser) {
    await fixture.algorand.account.ensureFunded(params.sender, dispenser, (200).algos());
  }

  const recipientEscrows = [krbyEscrow, modEscrow, govEscrow]

  const optInPluginSDK = await deployOptInPlugin({
    fixture: fixture,
    sender: params.sender,
    signer: params.signer,
  })
  logger.plugin('deploy', 'OptInPlugin', optInPluginSDK.appId);

  // Add OptInPlugin to PluginAppList (pal)
  await proposeAndExecute(fixture.algorand, dao, [{
    type: ProposalActionEnum.UpdateFields,
    field: 'pal',
    value: {
      optin: optInPluginSDK.appId
    }
  }]);

  // Deploy additional wallet plugins (not installed on DAO, but available for wallet use)
  const asaMintPluginSDK = await deployAsaMintPlugin({
    fixture,
    sender: params.sender,
    signer: params.signer,
  });
  logger.plugin('deploy', 'AsaMintPlugin', asaMintPluginSDK.appId);

  const payPluginSDK = await deployPayPlugin({
    fixture: fixture,
    sender: params.sender,
    signer: params.signer,
  });
  logger.plugin('deploy', 'PayPlugin', payPluginSDK.appId);

  const hyperSwapPluginSDK = await deployHyperSwapPlugin({
    fixture,
    sender: params.sender,
    signer: params.signer,
    args: {
      akitaDao: dao.appId,
      version: '0.0.1',
    }
  });
  logger.plugin('deploy', 'HyperSwapPlugin', hyperSwapPluginSDK.appId);

  const subscriptionsPluginSDK = await deploySubscriptionsPlugin({
    fixture,
    sender: params.sender,
    signer: params.signer,
    args: {
      akitaDao: dao.appId,
      version: '0.0.1',
    }
  });
  logger.plugin('deploy', 'SubscriptionsPlugin', subscriptionsPluginSDK.appId);

  // Deploy remaining wallet plugins
  // Note: Some plugins require factory/DAO IDs, so they're deployed after those contracts exist
  const auctionPluginSDK = await deployAuctionPlugin({
    fixture,
    sender: params.sender,
    signer: params.signer,
    args: {
      version: '0.0.1',
      factory: auctionFactoryResult.client.appId,
      akitaDao: dao.appId,
    }
  });
  logger.plugin('deploy', 'AuctionPlugin', auctionPluginSDK.appId);

  const daoPluginSDK = await deployDAOPlugin({
    fixture,
    sender: params.sender,
    signer: params.signer,
    args: {
      daoAppId: dao.appId,
    }
  });
  logger.plugin('deploy', 'DAOPlugin', daoPluginSDK.appId);

  // DualStakePlugin and GatePlugin need registry/gateAppID - these can be 0n for now (will be set when used)
  // NFDPlugin needs registry - can be 0n for now
  const dualStakePluginSDK = await deployDualStakePlugin({
    fixture,
    sender: params.sender,
    signer: params.signer,
  });
  logger.plugin('deploy', 'DualStakePlugin', dualStakePluginSDK.appId);

  const gatePluginSDK = await deployGatePlugin({
    fixture,
    sender: params.sender,
    signer: params.signer,
  });
  logger.plugin('deploy', 'GatePlugin', gatePluginSDK.appId);

  const marketplacePluginSDK = await deployMarketplacePlugin({
    fixture,
    sender: params.sender,
    signer: params.signer,
    args: {
      factory: marketplaceResult.client.appId,
      akitaDao: dao.appId,
      version: '0.0.1',
    }
  });
  logger.plugin('deploy', 'MarketplacePlugin', marketplacePluginSDK.appId);

  const nfdPluginSDK = await deployNFDPlugin({
    fixture,
    sender: params.sender,
    signer: params.signer,
  });
  logger.plugin('deploy', 'NFDPlugin', nfdPluginSDK.appId);

  // PaySiloPlugin needs a recipient - using sender as default
  const paySiloPluginSDK = await deployPaySiloPlugin({
    fixture,
    sender: params.sender,
    signer: params.signer,
    args: {
      recipient: params.sender.toString(),
    }
  });
  logger.plugin('deploy', 'PaySiloPlugin', paySiloPluginSDK.appId);

  const paySiloFactoryPluginSDK = await deployPaySiloFactoryPlugin({
    fixture,
    sender: params.sender,
    signer: params.signer,
  });
  logger.plugin('deploy', 'PaySiloFactoryPlugin', paySiloFactoryPluginSDK.appId);

  const pollPluginSDK = await deployPollPlugin({
    fixture,
    sender: params.sender,
    signer: params.signer,
    args: {
      version: '0.0.1',
      factory: pollFactoryResult.client.appId,
      akitaDao: dao.appId,
    }
  });
  logger.plugin('deploy', 'PollPlugin', pollPluginSDK.appId);

  const rafflePluginSDK = await deployRafflePlugin({
    fixture,
    sender: params.sender,
    signer: params.signer,
    args: {
      version: '0.0.1',
      factory: raffleFactoryResult.client.appId,
    }
  });
  logger.plugin('deploy', 'RafflePlugin', rafflePluginSDK.appId);

  const rewardsPluginSDK = await deployRewardsPlugin({
    fixture,
    sender: params.sender,
    signer: params.signer,
    args: {
      akitaDao: dao.appId,
      version: '0.0.1',
    }
  });
  logger.plugin('deploy', 'RewardsPlugin', rewardsPluginSDK.appId);

  // SocialPlugin needs escrow - using DAO wallet address as escrow
  const socialPluginSDK = await deploySocialPlugin({
    fixture,
    sender: params.sender,
    signer: params.signer,
    args: {
      version: '0.0.1',
      akitaDao: dao.appId,
      escrow: dao.wallet.client.appId, // Using DAO wallet as escrow
    }
  });
  logger.plugin('deploy', 'SocialPlugin', socialPluginSDK.appId);

  const stakingPluginSDK = await deployStakingPlugin({
    fixture,
    sender: params.sender,
    signer: params.signer,
    args: {
      akitaDao: dao.appId,
      version: '0.0.1',
    }
  });
  logger.plugin('deploy', 'StakingPlugin', stakingPluginSDK.appId);

  const stakingPoolPluginSDK = await deployStakingPoolPlugin({
    fixture,
    sender: params.sender,
    signer: params.signer,
    args: {
      version: '0.0.1',
      factory: stakingPoolFactorySdk.appId,
      akitaDao: dao.appId,
    }
  });
  logger.plugin('deploy', 'StakingPoolPlugin', stakingPoolPluginSDK.appId);

  for (const escrow of recipientEscrows) {
    // Create escrow first
    await proposeAndExecute(fixture.algorand, dao, [
      { type: ProposalActionEnum.NewEscrow, escrow },
    ]);

    // Add plugin and toggle lock in separate proposal (escrow must exist for validation)
    await proposeAndExecute(fixture.algorand, dao, [
      {
        type: ProposalActionEnum.AddPlugin,
        client: optInPluginSDK,
        global: true,
        escrow,
        sourceLink: '',
        useExecutionKey: false,
      },
      { type: ProposalActionEnum.ToggleEscrowLock, escrow }
    ]);
  }

  await proposeAndExecute(fixture.algorand, dao, [{
    type: ProposalActionEnum.UpdateFields,
    field: 'revenue_splits',
    value: [
      {
        receiver: { wallet: dao.wallet.appId, escrow: krbyEscrow },
        type: SplitDistributionType.Percentage,
        value: 40_000n
      },
      {
        receiver: { wallet: dao.wallet.appId, escrow: modEscrow },
        type: SplitDistributionType.Percentage,
        value: 20_000n
      },
      {
        receiver: { wallet: dao.wallet.appId, escrow: govEscrow },
        type: SplitDistributionType.Percentage,
        value: 40_000n
      }
    ]
  }])

  // Ensure sender has enough funds for the revenue escrow proposals (fixture only)
  if (isLocalnet && dispenser) {
    await fixture.algorand.account.ensureFunded(params.sender, dispenser, (200).algos());
  }

  const escrows = [
    {
      escrow: walletFactoryRevenueEscrow,
      source: abstractAccountFactory.client.appAddress.toString(),
      appToUpdate: abstractAccountFactory.appId,
      alreadyCreated: true // Created earlier for wallet factory configuration
    },
    {
      escrow: auctionFactoryRevenueEscrow,
      source: auctionFactoryResult.client.appAddress.toString(),
      appToUpdate: auctionFactoryResult.client.appId,
      alreadyCreated: false
    },
    {
      escrow: marketplaceRevenueEscrow,
      source: marketplaceResult.client.appAddress.toString(),
      appToUpdate: marketplaceResult.client.appId,
      alreadyCreated: false
    },
    {
      escrow: raffleFactoryRevenueEscrow,
      source: raffleFactoryResult.client.appAddress.toString(),
      appToUpdate: raffleFactoryResult.client.appId,
      alreadyCreated: false
    },
    {
      escrow: socialFactoryRevenueEscrow,
      source: socialSystem.socialClient.appAddress.toString(),
      appToUpdate: socialSystem.socialClient.appId,
      alreadyCreated: false
    },
    {
      escrow: subscriptionsFactoryRevenueEscrow,
      source: subscriptionsSdk.client.appAddress.toString(),
      appToUpdate: subscriptionsSdk.appId,
      alreadyCreated: false
    },
    {
      escrow: stakingPoolFactoryRevenueEscrow,
      source: stakingPoolFactorySdk.client.appAddress.toString(),
      appToUpdate: stakingPoolFactorySdk.appId,
      alreadyCreated: false
    },
    {
      escrow: pollFactoryRevenueEscrow,
      source: pollFactoryResult.client.appAddress.toString(),
      appToUpdate: pollFactoryResult.client.appId,
      alreadyCreated: false
    }
  ]

  for (const { escrow, source, appToUpdate, alreadyCreated } of escrows) {
    // Ensure sender has enough funds for this escrow's proposals (fixture only)
    if (isLocalnet && dispenser) {
      await fixture.algorand.account.ensureFunded(params.sender, dispenser, (50).algos());
    }

    // Only create escrow if it hasn't been created already
    if (!alreadyCreated) {
      await proposeAndExecute(fixture.algorand, dao, [{ type: ProposalActionEnum.NewEscrow, escrow }]);
    }

    const newReceiveEscrowPluginBuild = await dao.wallet.build.usePlugin({
      sender: params.sender,
      signer: params.signer,
      lease: `new_${escrow}_lease`,
      global: true,
      windowSize: 2000n,
      calls: [
        revenueManagerPluginSdk.newReceiveEscrowWithRef({
          escrow,
          source,
          allocatable: true,
          optinAllowed: true,
          splitRef: {
            app: dao.appId,
            key: new Uint8Array(Buffer.from(AkitaDAOGlobalStateKeysRevenueSplits))
          }
        })
      ]
    });

    await proposeAndExecute(fixture.algorand, dao, [
      {
        type: ProposalActionEnum.ExecutePlugin,
        plugin: revenueManagerPluginSdk.appId,
        caller: params.sender.toString(),
        escrow: '',
        executionKey: newReceiveEscrowPluginBuild.lease,
        groups: newReceiveEscrowPluginBuild.ids,
        firstValid: newReceiveEscrowPluginBuild.firstValid,
        lastValid: newReceiveEscrowPluginBuild.lastValid
      },
      {
        type: ProposalActionEnum.AddPlugin,
        client: revenueManagerPluginSdk,
        global: true,
        escrow,
        sourceLink: 'https://github.com/kylebee/akita-sc',
        useExecutionKey: false,
        methods: [
          { name: revenueManagerPluginSdk.optIn(), cooldown: 0n },
          { name: revenueManagerPluginSdk.startEscrowDisbursement(), cooldown: 0n },
          { name: revenueManagerPluginSdk.processEscrowAllocation(), cooldown: 0n },
        ]
      },
      { type: ProposalActionEnum.ToggleEscrowLock, escrow }
    ]);

    await newReceiveEscrowPluginBuild.atcs[0].submit(dao.client.algorand.client.algod);
    logger.escrow(escrow, 'configure');

    // Update the app's akitaDaoEscrow with the new escrow ID (skip wallet factory as it's done separately above)
    if (appToUpdate && escrow !== walletFactoryRevenueEscrow) {
      // Ensure sender has enough funds for the update proposal (fixture only)
      if (isLocalnet && dispenser) {
        await fixture.algorand.account.ensureFunded(params.sender, dispenser, (50).algos());
      }

      const escrowInfo = await dao.wallet.getEscrow(escrow);

      const updateEscrowBuild = await dao.wallet.build.usePlugin({
        sender: params.sender,
        signer: params.signer,
        lease: `update_escrow_${escrow}`,
        windowSize: 2000n,
        global: true,
        calls: [
          daoUpdatePluginSdk.updateAkitaDaoEscrowForApp({
            appId: appToUpdate,
            newEscrow: escrowInfo.id
          })
        ]
      });

      await proposeAndExecute(fixture.algorand, dao, [
        {
          type: ProposalActionEnum.ExecutePlugin,
          plugin: daoUpdatePluginSdk.appId,
          caller: params.sender.toString(),
          escrow: '',
          executionKey: updateEscrowBuild.lease,
          groups: updateEscrowBuild.ids,
          firstValid: updateEscrowBuild.firstValid,
          lastValid: updateEscrowBuild.lastValid
        }
      ]);

      await updateEscrowBuild.atcs[0].submit(dao.wallet.client.algorand.client.algod);
      logger.proposal(`Update ${escrow} escrow for app ${appToUpdate}`, 0n);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 4b: Setup Bones Token and Escrows
  // ═══════════════════════════════════════════════════════════════════════════
  logger.phase('SETUP_BONES');

  // Ensure sender has enough funds for the bones setup (fixture only)
  if (isLocalnet && dispenser) {
    await fixture.algorand.account.ensureFunded(params.sender, dispenser, (300).algos());
  }

  // Add asa-mint plugin to DAO wallet (global, no escrow)
  await proposeAndExecute(fixture.algorand, dao, [
    {
      type: ProposalActionEnum.AddPlugin,
      client: asaMintPluginSDK,
      caller: params.sender.toString(),
      escrow: '',
      sourceLink: 'https://github.com/kylebee/akita-sc',
      useExecutionKey: false,
    }
  ]);
  logger.proposal('Install AsaMintPlugin (global)', 0n);

  // Mint the Bones token (total supply: 1,000,000,000 BONES with 6 decimals)
  // Get wallet assets before minting to know what's new
  const walletAssetsBefore = (await fixture.algorand.account.getInformation(dao.wallet.client.appAddress)).assets ?? [];
  const assetIdsBefore = new Set(walletAssetsBefore.map(a => a.assetId));

  // Mint the Bones token using the wallet's usePlugin directly (no execution key needed)
  const mintBonesResult = await dao.wallet.usePlugin({
    sender: params.sender,
    signer: params.signer,
    calls: [
      asaMintPluginSDK.mint({
        assets: [{
          assetName: 'Bones',
          unitName: 'BONES',
          total: 1_000_000_000_000_000n, // 1B tokens with 6 decimals
          decimals: 6n,
          manager: dao.wallet.client.appAddress.toString(),
          reserve: dao.wallet.client.appAddress.toString(),
          freeze: ALGORAND_ZERO_ADDRESS_STRING,
          clawback: ALGORAND_ZERO_ADDRESS_STRING,
          defaultFrozen: false,
          url: 'https://akita.community',
        }]
      }),
    ]
  });

  // Get the asset ID from the mint result
  const bonesAssetId = mintBonesResult.returns[1][0] as bigint;
  logger.proposal('Mint Bones Token', bonesAssetId);

  // Update the DAO's akita_assets with AKTA (if available) and Bones asset IDs
  const akitaAssetsUpdate: { akta?: bigint; bones: bigint } = { bones: bonesAssetId };
  if (aktaAssetId && aktaAssetId > 0n) {
    akitaAssetsUpdate.akta = aktaAssetId;
  }
  
  await proposeAndExecute(fixture.algorand, dao, [
    {
      type: ProposalActionEnum.UpdateFields,
      field: 'akita_assets',
      value: akitaAssetsUpdate
    }
  ]);
  logger.proposal(`UpdateFields: Set assets (AKTA: ${aktaAssetId}, BONES: ${bonesAssetId})`, 0n);

  // Add pay plugin to DAO wallet (global, no escrow)
  await proposeAndExecute(fixture.algorand, dao, [
    {
      type: ProposalActionEnum.AddPlugin,
      client: payPluginSDK,
      global: true,
      escrow: '',
      sourceLink: 'https://github.com/kylebee/akita-sc',
      useExecutionKey: false,
    }
  ]);
  logger.proposal('Install PayPlugin (global)', 0n);

  // Define bones escrow distributions (whole units, will be multiplied by 10^6 for decimals)
  const bonesDistributions: Record<string, bigint> = {
    'bones_dau': 200_000_000n,
    'bones_gov': 200_000_000n,
    'bones_public': 150_000_000n,
    'bones_liquidity': 50_000_000n,
    'bones_akta': 100_000_000n,
    'bones_nft': 100_000_000n,
    'bones_team': 100_000_000n,
    'bones_event': 100_000_000n,
  };

  // Create each bones escrow, add optin plugin, opt into Bones, remove optin plugin
  for (const escrow of bonesEscrowNames) {
    // Ensure sender has enough funds for this escrow's proposals (fixture only)
    if (isLocalnet && dispenser) {
      await fixture.algorand.account.ensureFunded(params.sender, dispenser, (50).algos());
    }

    // Create the escrow
    await proposeAndExecute(fixture.algorand, dao, [{ type: ProposalActionEnum.NewEscrow, escrow }]);
    logger.escrow(escrow, 'create');

    // Add optin plugin to the escrow
    await proposeAndExecute(fixture.algorand, dao, [
      {
        type: ProposalActionEnum.AddPlugin,
        client: optInPluginSDK,
        global: true,
        escrow,
        sourceLink: '',
        useExecutionKey: false,
      }
    ]);
    logger.plugin('install', 'OptInPlugin', optInPluginSDK.appId);

    // Opt the escrow into the Bones token (plugin installed without execution key, call directly)
    await dao.wallet.usePlugin({
      sender: params.sender,
      signer: params.signer,
      global: true,
      escrow,
      calls: [
        optInPluginSDK.optIn({
          assets: [bonesAssetId],
        })
      ]
    });
    logger.escrow(escrow, 'optin');

    // Remove the optin plugin from the escrow (must use zero address since it was added with global: true)
    await proposeAndExecute(fixture.algorand, dao, [
      {
        type: ProposalActionEnum.RemovePlugin,
        plugin: optInPluginSDK.appId,
        caller: ALGORAND_ZERO_ADDRESS_STRING,
        escrow,
      }
    ]);
    logger.plugin('remove', 'OptInPlugin', optInPluginSDK.appId);
  }

  // Send Bones tokens to each escrow (one at a time to avoid reference limits)
  for (const escrow of bonesEscrowNames) {
    const escrowInfo = await dao.wallet.getEscrow(escrow);
    const escrowAddress = getApplicationAddress(escrowInfo.id).toString();
    const amount = bonesDistributions[escrow] * 1_000_000n; // Convert to base units (6 decimals)

    await dao.wallet.usePlugin({
      sender: params.sender,
      signer: params.signer,
      global: true,
      calls: [
        payPluginSDK.pay({
          payments: [{
            receiver: escrowAddress,
            asset: bonesAssetId,
            amount,
          }],
        }),
      ]
    });
    logger.escrow(escrow, 'configure');
  }
  logger.proposal('Distribute Bones to escrows', 0n);

  // Initialize social contract to opt it into AKTA (if AKTA is available)
  if (aktaAssetId && aktaAssetId > 0n) {
    // Fund and initialize the social contract to opt it into AKTA
    // The social contract's init() method opts it into the AKTA asset
    await fixture.algorand.send.payment({
      sender: params.sender,
      signer: params.signer,
      receiver: socialSystem.socialClient.appAddress,
      amount: microAlgo(500_000), // MBR for asset opt-in
    });
    await socialSystem.sdk.init();
    logger.deploy('Social AKTA opt-in', socialSystem.socialClient.appId, socialSystem.socialClient.appAddress.toString());
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 5: Finalize
  // ═══════════════════════════════════════════════════════════════════════════
  logger.phase('FINALIZE');

  logger.completeBuild({
    dao: dao.appId,
    wallet: dao.wallet.client.appId,
    escrowFactory: escrowFactory.appId,
    walletFactory: abstractAccountFactory.appId,
  });

  // Re-fund sender after universe build (MetaMerkles type registration + proposals consume significant ALGO)
  if (isLocalnet && dispenser) {
    await fixture.algorand.account.ensureFunded(params.sender, dispenser, (500).algos());
  }

  return {
    dao,
    walletFactory: abstractAccountFactory,
    subscriptions: subscriptionsSdk,
    stakingPoolFactory: stakingPoolFactorySdk,
    staking: stakingSdk,
    rewards: { client: rewardsClient, appId: rewardsClient.appId },
    social: socialSystem.sdk,
    auctionFactory: auctionFactoryResult.sdk,
    marketplace: marketplaceResult.sdk,
    raffleFactory: raffleFactoryResult.sdk,
    pollFactory: pollFactoryResult.sdk,
    prizeBoxFactory: prizeBoxFactoryResult.sdk,
    revenueManagerPlugin: revenueManagerPluginSdk,
    updatePlugin: daoUpdatePluginSdk,
    optInPlugin: optInPluginSDK,
    asaMintPlugin: asaMintPluginSDK,
    payPlugin: payPluginSDK,
    hyperSwapPlugin: hyperSwapPluginSDK,
    subscriptionsPlugin: subscriptionsPluginSDK,
    auctionPlugin: auctionPluginSDK,
    daoPlugin: daoPluginSDK,
    dualStakePlugin: dualStakePluginSDK,
    gatePlugin: gatePluginSDK,
    marketplacePlugin: marketplacePluginSDK,
    nfdPlugin: nfdPluginSDK,
    paySiloPlugin: paySiloPluginSDK,
    paySiloFactoryPlugin: paySiloFactoryPluginSDK,
    pollPlugin: pollPluginSDK,
    rafflePlugin: rafflePluginSDK,
    rewardsPlugin: rewardsPluginSDK,
    socialPlugin: socialPluginSDK,
    stakingPlugin: stakingPluginSDK,
    stakingPoolPlugin: stakingPoolPluginSDK,
    escrowFactory: escrowFactory,
    // New contracts
    gate: gateResult,
    hyperSwap: hyperSwapResult,
    metaMerkles: metaMerklesResult,
    subgates: subgatesResult,
    // Test/Token assets
    aktaAssetId,
    bonesAssetId,
    usdcAssetId,
  }
}

