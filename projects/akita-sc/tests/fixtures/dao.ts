import { microAlgo } from '@algorandfoundation/algokit-utils';
import { AkitaDaoSDK, EMPTY_CID, OptInPluginSDK, ProposalAction, ProposalActionEnum, RevenueManagerPluginSDK, SDKClient, SocialSDK, SplitDistributionType, StakingPoolFactorySDK, StakingSDK, SubscriptionsSDK, UpdateAkitaDAOPluginSDK, WalletFactorySDK } from 'akita-sdk';
import { AkitaDaoApps, AkitaDaoFactory } from '../../smart_contracts/artifacts/arc58/dao/AkitaDAOClient';
import { EscrowFactoryClient } from '../../smart_contracts/artifacts/escrow/EscrowFactoryClient';
import { DEFAULT_ADD_ALLOWANCE_APPROVAL, DEFAULT_ADD_ALLOWANCE_PARTICIPATION, DEFAULT_ADD_ALLOWANCE_PROPOSAL_CREATION, DEFAULT_ADD_ALLOWANCE_PROPOSAL_POWER, DEFAULT_ADD_ALLOWANCE_VOTING_DURATION, DEFAULT_ADD_PLUGIN_APPROVAL, DEFAULT_ADD_PLUGIN_PARTICIPATION, DEFAULT_ADD_PLUGIN_PROPOSAL_CREATION, DEFAULT_ADD_PLUGIN_PROPOSAL_POWER, DEFAULT_ADD_PLUGIN_VOTING_DURATION, DEFAULT_AUCTION_COMPOSABLE_PERCENTAGE, DEFAULT_AUCTION_CREATION_FEE, DEFAULT_AUCTION_RAFFLE_PERCENTAGE, DEFAULT_AUCTION_SALE_IMPACT_MAX, DEFAULT_AUCTION_SALE_IMPACT_TAX_MIN, DEFAULT_CREATION, DEFAULT_IMPACT_TAX_MAX, DEFAULT_IMPACT_TAX_MIN, DEFAULT_KRBY_PERCENTAGE, DEFAULT_MARKETPLACE_COMPOSABLE_PERCENTAGE, DEFAULT_MARKETPLACE_ROYALTY_DEFAULT_PERCENTAGE, DEFAULT_MARKETPLACE_SALE_PERCENTAGE_MAXIMUM, DEFAULT_MARKETPLACE_SALE_PERCENTAGE_MINIMUM, DEFAULT_MIN_POOL_CREATION_FEE, DEFAULT_MIN_REWARDS_IMPACT, DEFAULT_MODERATOR_PERCENTAGE, DEFAULT_NEW_ESCROW_APPROVAL, DEFAULT_NEW_ESCROW_PARTICIPATION, DEFAULT_NEW_ESCROW_PROPOSAL_CREATION, DEFAULT_NEW_ESCROW_PROPOSAL_POWER, DEFAULT_NEW_ESCROW_VOTING_DURATION, DEFAULT_OMNIGEM_SALE_FEE, DEFAULT_POOL_IMPACT_TAX_MAX, DEFAULT_POOL_IMPACT_TAX_MIN, DEFAULT_POST_FEE, DEFAULT_RAFFLE_COMPOSABLE_PERCENTAGE, DEFAULT_RAFFLE_CREATION_FEE, DEFAULT_RAFFLE_SALE_IMPACT_MAX, DEFAULT_RAFFLE_SALE_IMPACT_TAX_MIN, DEFAULT_REACT_FEE, DEFAULT_REMOVE_ALLOWANCE_APPROVAL, DEFAULT_REMOVE_ALLOWANCE_PARTICIPATION, DEFAULT_REMOVE_ALLOWANCE_PROPOSAL_CREATION, DEFAULT_REMOVE_ALLOWANCE_PROPOSAL_POWER, DEFAULT_REMOVE_ALLOWANCE_VOTING_DURATION, DEFAULT_REMOVE_EXECUTE_PROPOSAL_APPROVAL, DEFAULT_REMOVE_EXECUTE_PROPOSAL_CREATION, DEFAULT_REMOVE_EXECUTE_PROPOSAL_PARTICIPATION, DEFAULT_REMOVE_EXECUTE_PROPOSAL_POWER, DEFAULT_REMOVE_EXECUTE_PROPOSAL_VOTING_DURATION, DEFAULT_REMOVE_PLUGIN_APPROVAL, DEFAULT_REMOVE_PLUGIN_PARTICIPATION, DEFAULT_REMOVE_PLUGIN_PROPOSAL_CREATION, DEFAULT_REMOVE_PLUGIN_PROPOSAL_POWER, DEFAULT_REMOVE_PLUGIN_VOTING_DURATION, DEFAULT_SERVICE_CREATION_FEE, DEFAULT_SHUFFLE_SALE_PERCENTAGE, DEFAULT_SUBSCRIPTION_PAYMENT_PERCENTAGE, DEFAULT_SUBSCRIPTION_TRIGGER_PERCENTAGE, DEFAULT_SWAP_COMPOSABLE_PERCENTAGE, DEFAULT_SWAP_FEE_IMPACT_TAX_MAX, DEFAULT_SWAP_FEE_IMPACT_TAX_MIN, DEFAULT_SWAP_LIQUIDITY_PERCENTAGE, DEFAULT_TOGGLE_ESCROW_LOCK_APPROVAL, DEFAULT_TOGGLE_ESCROW_LOCK_PARTICIPATION, DEFAULT_TOGGLE_ESCROW_LOCK_PROPOSAL_CREATION, DEFAULT_TOGGLE_ESCROW_LOCK_PROPOSAL_POWER, DEFAULT_TOGGLE_ESCROW_LOCK_VOTING_DURATION, DEFAULT_UPDATE_AKITA_DAO_APP_APPROVAL, DEFAULT_UPDATE_AKITA_DAO_DURATION, DEFAULT_UPDATE_AKITA_DAO_PARTICIPATION, DEFAULT_UPDATE_AKITA_DAO_PROPOSAL_CREATION, DEFAULT_UPDATE_AKITA_DAO_PROPOSAL_POWER, DEFAULT_UPDATE_FIELD_APPROVAL, DEFAULT_UPDATE_FIELD_PARTICIPATION, DEFAULT_UPDATE_FIELD_PROPOSAL_CREATION, DEFAULT_UPDATE_FIELD_PROPOSAL_POWER, DEFAULT_UPDATE_FIELD_VOTING_DURATION, DEFAULT_UPGRADE_APP_APPROVAL, DEFAULT_UPGRADE_APP_PARTICIPATION, DEFAULT_UPGRADE_APP_PROPOSAL_CREATION, DEFAULT_UPGRADE_APP_PROPOSAL_POWER, DEFAULT_UPGRADE_APP_VOTING_DURATION, DEFAULT_WALLET_CREATE_FEE, DEFAULT_WALLET_REFERRER_PERCENTAGE } from '../../smart_contracts/utils/defaults';
import { FixtureAndAccount } from '../types';
import { logger } from '../utils/logger';
import { deployAbstractedAccountFactory } from './abstracted-account';
import { deployEscrowFactory } from './escrow';
import { deployOptInPlugin } from './plugins/optin';
import { deployRevenueManagerPlugin } from './plugins/revenue-manager';
import { deployUpdateAkitaDaoPlugin } from './plugins/update-akita-dao';
import { deploySocialSystem } from './social';
import { deployStaking } from './staking';
import { deployStakingPoolFactory } from './staking-pool';
import { deploySubscriptions } from './subscriptions';

type DeployParams = FixtureAndAccount & { apps: Partial<AkitaDaoApps> }
type BuildUniverseParams = DeployParams & { aktaAssetId?: bigint }
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

  return new AkitaDaoSDK({
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
  social: SocialSDK;
  revenueManagerPlugin: RevenueManagerPluginSDK;
  updatePlugin: UpdateAkitaDAOPluginSDK;
  optInPlugin: OptInPluginSDK;
  escrowFactory: EscrowFactoryClient;
}

export const buildAkitaUniverse = async (params: BuildUniverseParams): Promise<AkitaUniverse> => {

  if (!params.sender) {
    throw new Error('Sender is required to deploy and setup Akita DAO');
  }

  const { fixture: localnet, aktaAssetId } = params;

  logger.startBuild();

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 1: Deploy Core Contracts
  // ═══════════════════════════════════════════════════════════════════════════
  logger.phase('DEPLOY_CORE');

  const escrowFactory = await deployEscrowFactory({
    fixture: localnet,
    sender: params.sender,
    signer: params.signer
  });
  logger.deploy('Escrow Factory', escrowFactory.appId, escrowFactory.appAddress.toString());

  const dao = await deployAkitaDAO({ ...params, apps: { ...params.apps, escrow: escrowFactory.appId } });

  const dispenser = await localnet.algorand.account.dispenserFromEnvironment();
  // Fund sender with enough ALGO to cover all proposals and executions during setup
  // Each proposal costs ~1-20 ALGO and we make 15+ proposals during buildAkitaUniverse
  await localnet.algorand.account.ensureFunded(params.sender, dispenser, (500).algos());
  await localnet.algorand.account.ensureFunded(dao.readerAccount, dispenser, (1).algos());

  const abstractAccountFactory = await deployAbstractedAccountFactory({
    fixture: localnet,
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
    fixture: localnet,
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
    fixture: localnet,
    sender: params.sender,
    signer: params.signer,
    args: {
      akitaDao: dao.appId,
      version: '0.0.1',
      akitaDaoEscrow: 0n,
    }
  });
  logger.deploy('Staking Pool Factory', stakingPoolFactorySdk.appId, stakingPoolFactorySdk.client.appAddress.toString());

  const stakingClient = await deployStaking({
    fixture: localnet,
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
    algorand: localnet.algorand,
    factoryParams: {
      appId: stakingClient.appId,
      defaultSender: params.sender,
      defaultSigner: params.signer,
    }
  });
  logger.deploy('Staking', stakingClient.appId, stakingClient.appAddress.toString());

  // Deploy Social System (Social, Graph, Impact contracts) with escrow = 0n initially
  const socialSystem = await deploySocialSystem({
    fixture: localnet,
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

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 2: Configure DAO
  // ═══════════════════════════════════════════════════════════════════════════
  logger.phase('CONFIGURE_DAO');

  const updateFieldsProposalId = await proposeAndExecute(dao, [
    {
      type: ProposalActionEnum.UpdateFields,
      field: 'aal',
      value: {
        wallet: abstractAccountFactory.appId,
        staking: stakingClient.appId,
        subscriptions: subscriptionsSdk.appId,
        pool: stakingPoolFactorySdk.appId,
      }
    }
  ]);
  logger.proposal('UpdateFields: Set wallet factory, staking, subscriptions, and pool', updateFieldsProposalId);

  const updateSalProposalId = await proposeAndExecute(dao, [
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

  // Set the otherAppList (oal) with the escrow factory - required for revenue collection
  const updateOalProposalId = await proposeAndExecute(dao, [
    {
      type: ProposalActionEnum.UpdateFields,
      field: 'oal',
      value: {
        vrfBeacon: 0n,
        nfdRegistry: 0n,
        assetInbox: 0n,
        escrow: escrowFactory.appId,
        poll: 0n,
        akitaNfd: 0n
      }
    }
  ]);
  logger.proposal('UpdateFields: Set escrow factory in otherAppList', updateOalProposalId);

  // Fund DAO with setup cost before creating the wallet
  const setupCost = await dao.setupCost();
  await dao.client.appClient.fundAppAccount({ amount: setupCost.microAlgo() });

  await dao.setup();
  logger.wallet('DAO ARC58 Wallet', dao.wallet.client.appId, dao.wallet.client.appAddress.toString());

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
  const revenueEscrowNames = ['rev_wallet', 'rev_subscriptions', 'rev_pool', 'rev_social'];
  const escrowNames = [...recipientEscrowNames, ...revenueEscrowNames];

  // Calculate MBR for all escrows and plugins
  const mbrPromises = [
    // Base wallet MBR with 2 global plugins and 2 execution groups
    dao.wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 2n }),
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
    fixture: localnet,
    sender: params.sender,
    signer: params.signer
  });
  logger.plugin('deploy', 'RevenueManagerPlugin', revenueManagerPluginSdk.appId);

  await localnet.algorand.account.ensureFunded(revenueManagerPluginSdk.client.appAddress, dispenser, (1).algos());

  await proposeAndExecute(dao, [{
    type: ProposalActionEnum.UpdateFields,
    field: 'pal',
    value: {
      revenueManager: revenueManagerPluginSdk.appId
    }
  }]);

  const installRevenueManagerProposalId = await proposeAndExecute(dao, [
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
    fixture: localnet,
    sender: params.sender,
    signer: params.signer,
    args: {
      akitaDao: dao.appId,
    }
  });
  logger.plugin('deploy', 'UpdateAkitaDAOPlugin', daoUpdatePluginSdk.appId);

  await proposeAndExecute(dao, [
    {
      type: ProposalActionEnum.UpdateFields,
      field: 'pal',
      value: { update: daoUpdatePluginSdk.appId }
    }
  ]);

  // Install UpdateAkitaDAO Plugin
  const installUpdatePluginProposalId = await proposeAndExecute(dao, [
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

  const krbyEscrow = 'rec_krby'
  const modEscrow = 'rec_mod'
  const govEscrow = 'rec_gov'

  const walletFactoryRevenueEscrow = 'rev_wallet';
  // const auctionFactoryRevenueEscrow = 'rev_auctions';
  // const marketplaceFactoryRevenueEscrow = 'rev_marketplace';
  // const raffleFactoryRevenueEscrow = 'rev_raffle';
  const socialFactoryRevenueEscrow = 'rev_social';
  const subscriptionsFactoryRevenueEscrow = 'rev_subscriptions';
  const stakingPoolFactoryRevenueEscrow = 'rev_pool';

  // Create rev_wallet escrow first so we can get its ID for wallet factory configuration
  await proposeAndExecute(dao, [{ type: ProposalActionEnum.NewEscrow, escrow: walletFactoryRevenueEscrow }]);
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

  const executePluginProposalId = await proposeAndExecute(dao, [
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

  // Ensure sender has enough funds for the remaining proposals
  await localnet.algorand.account.ensureFunded(params.sender, dispenser, (200).algos());

  const recipientEscrows = [krbyEscrow, modEscrow, govEscrow]

  const optInPluginSDK = await deployOptInPlugin({
    fixture: localnet,
    sender: params.sender,
    signer: params.signer,
  })

  for (const escrow of recipientEscrows) {
    // Create escrow first
    await proposeAndExecute(dao, [
      { type: ProposalActionEnum.NewEscrow, escrow },
    ]);

    // Add plugin and toggle lock in separate proposal (escrow must exist for validation)
    await proposeAndExecute(dao, [
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

  await proposeAndExecute(dao, [{
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

  // Ensure sender has enough funds for the revenue escrow proposals
  await localnet.algorand.account.ensureFunded(params.sender, dispenser, (200).algos());

  const escrows = [
    {
      escrow: walletFactoryRevenueEscrow,
      source: abstractAccountFactory.client.appAddress.toString(),
      appToUpdate: abstractAccountFactory.appId,
      alreadyCreated: true // Created earlier for wallet factory configuration
    },
    // {
    //   escrow: auctionFactoryRevenueEscrow,
    //   source: abstractAccountFactory.client.appAddress.toString()
    // },
    // {
    //   escrow: marketplaceFactoryRevenueEscrow,
    //   source: abstractAccountFactory.client.appAddress.toString()
    // },
    // {
    //   escrow: raffleFactoryRevenueEscrow,
    //   source: abstractAccountFactory.client.appAddress.toString()
    // },
    {
      escrow: socialFactoryRevenueEscrow,
      // Use deployer address as source so deployer can authorize opt-ins via usePlugin calls
      // (for testing - in production, this would typically be a trusted admin address)
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
    }
  ]

  for (const { escrow, source, appToUpdate, alreadyCreated } of escrows) {
    // Only create escrow if it hasn't been created already
    if (!alreadyCreated) {
      await proposeAndExecute(dao, [{ type: ProposalActionEnum.NewEscrow, escrow }]);
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

    await proposeAndExecute(dao, [
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

      await proposeAndExecute(dao, [
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

  // If AKTA asset ID is provided, configure it in the DAO and opt contracts into it
  if (aktaAssetId && aktaAssetId > 0n) {
    // First, update the DAO with the AKTA asset so it knows about it
    await proposeAndExecute(dao, [
      {
        type: ProposalActionEnum.UpdateFields,
        field: 'akita_assets',
        value: { akta: aktaAssetId }
      }
    ]);
    logger.proposal('UpdateFields: Set AKTA asset', 0n);

    // Fund and initialize the social contract to opt it into AKTA
    // The social contract's init() method opts it into the AKTA asset
    await localnet.algorand.send.payment({
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

  return {
    dao,
    walletFactory: abstractAccountFactory,
    subscriptions: subscriptionsSdk,
    stakingPoolFactory: stakingPoolFactorySdk,
    staking: stakingSdk,
    social: socialSystem.sdk,
    revenueManagerPlugin: revenueManagerPluginSdk,
    updatePlugin: daoUpdatePluginSdk,
    optInPlugin: optInPluginSDK,
    escrowFactory: escrowFactory,
  }
}

const proposeAndExecute = async (dao: AkitaDaoSDK, actions: ProposalAction<SDKClient>[]): Promise<bigint> => {
  const info = await dao.proposalCost({ actions });

  await dao.client.appClient.fundAppAccount({ amount: info.total.microAlgo() });

  const { return: proposalId } = await dao.newProposal({ actions });

  if (proposalId === undefined) {
    throw new Error('Failed to create proposal');
  }

  await dao.executeProposal({ proposalId });

  return proposalId;
}
