import { microAlgo } from '@algorandfoundation/algokit-utils';
import { AkitaDaoSDK, EMPTY_CID, ProposalAction, ProposalActionEnum, RevenueManagerPluginSDK, SDKClient, StakingPoolFactorySDK, SubscriptionsSDK, UpdateAkitaDAOPluginSDK, WalletFactorySDK } from 'akita-sdk';
import { AkitaDaoApps, AkitaDaoFactory } from '../../smart_contracts/artifacts/arc58/dao/AkitaDAOClient';
import { EscrowFactoryClient } from '../../smart_contracts/artifacts/escrow/EscrowFactoryClient';
import { DEFAULT_ADD_ALLOWANCE_APPROVAL, DEFAULT_ADD_ALLOWANCE_PARTICIPATION, DEFAULT_ADD_ALLOWANCE_PROPOSAL_CREATION, DEFAULT_ADD_ALLOWANCE_PROPOSAL_POWER, DEFAULT_ADD_ALLOWANCE_VOTING_DURATION, DEFAULT_ADD_PLUGIN_APPROVAL, DEFAULT_ADD_PLUGIN_PARTICIPATION, DEFAULT_ADD_PLUGIN_PROPOSAL_CREATION, DEFAULT_ADD_PLUGIN_PROPOSAL_POWER, DEFAULT_ADD_PLUGIN_VOTING_DURATION, DEFAULT_AUCTION_COMPOSABLE_PERCENTAGE, DEFAULT_AUCTION_CREATION_FEE, DEFAULT_AUCTION_RAFFLE_PERCENTAGE, DEFAULT_AUCTION_SALE_IMPACT_MAX, DEFAULT_AUCTION_SALE_IMPACT_TAX_MIN, DEFAULT_CREATION, DEFAULT_IMPACT_TAX_MAX, DEFAULT_IMPACT_TAX_MIN, DEFAULT_KRBY_PERCENTAGE, DEFAULT_MARKETPLACE_COMPOSABLE_PERCENTAGE, DEFAULT_MARKETPLACE_ROYALTY_DEFAULT_PERCENTAGE, DEFAULT_MARKETPLACE_SALE_PERCENTAGE_MAXIMUM, DEFAULT_MARKETPLACE_SALE_PERCENTAGE_MINIMUM, DEFAULT_MIN_POOL_CREATION_FEE, DEFAULT_MIN_REWARDS_IMPACT, DEFAULT_MODERATOR_PERCENTAGE, DEFAULT_NEW_ESCROW_APPROVAL, DEFAULT_NEW_ESCROW_PARTICIPATION, DEFAULT_NEW_ESCROW_PROPOSAL_CREATION, DEFAULT_NEW_ESCROW_PROPOSAL_POWER, DEFAULT_NEW_ESCROW_VOTING_DURATION, DEFAULT_OMNIGEM_SALE_FEE, DEFAULT_POOL_IMPACT_TAX_MAX, DEFAULT_POOL_IMPACT_TAX_MIN, DEFAULT_POST_FEE, DEFAULT_RAFFLE_COMPOSABLE_PERCENTAGE, DEFAULT_RAFFLE_CREATION_FEE, DEFAULT_RAFFLE_SALE_IMPACT_MAX, DEFAULT_RAFFLE_SALE_IMPACT_TAX_MIN, DEFAULT_REACT_FEE, DEFAULT_REMOVE_ALLOWANCE_APPROVAL, DEFAULT_REMOVE_ALLOWANCE_PARTICIPATION, DEFAULT_REMOVE_ALLOWANCE_PROPOSAL_CREATION, DEFAULT_REMOVE_ALLOWANCE_PROPOSAL_POWER, DEFAULT_REMOVE_ALLOWANCE_VOTING_DURATION, DEFAULT_REMOVE_EXECUTE_PROPOSAL_APPROVAL, DEFAULT_REMOVE_EXECUTE_PROPOSAL_CREATION, DEFAULT_REMOVE_EXECUTE_PROPOSAL_PARTICIPATION, DEFAULT_REMOVE_EXECUTE_PROPOSAL_POWER, DEFAULT_REMOVE_EXECUTE_PROPOSAL_VOTING_DURATION, DEFAULT_REMOVE_PLUGIN_APPROVAL, DEFAULT_REMOVE_PLUGIN_PARTICIPATION, DEFAULT_REMOVE_PLUGIN_PROPOSAL_CREATION, DEFAULT_REMOVE_PLUGIN_PROPOSAL_POWER, DEFAULT_REMOVE_PLUGIN_VOTING_DURATION, DEFAULT_SERVICE_CREATION_FEE, DEFAULT_SHUFFLE_SALE_PERCENTAGE, DEFAULT_SUBSCRIPTION_PAYMENT_PERCENTAGE, DEFAULT_SUBSCRIPTION_TRIGGER_PERCENTAGE, DEFAULT_SWAP_COMPOSABLE_PERCENTAGE, DEFAULT_SWAP_FEE_IMPACT_TAX_MAX, DEFAULT_SWAP_FEE_IMPACT_TAX_MIN, DEFAULT_SWAP_LIQUIDITY_PERCENTAGE, DEFAULT_TOGGLE_ESCROW_LOCK_APPROVAL, DEFAULT_TOGGLE_ESCROW_LOCK_PARTICIPATION, DEFAULT_TOGGLE_ESCROW_LOCK_PROPOSAL_CREATION, DEFAULT_TOGGLE_ESCROW_LOCK_PROPOSAL_POWER, DEFAULT_TOGGLE_ESCROW_LOCK_VOTING_DURATION, DEFAULT_UPDATE_AKITA_DAO_APP_APPROVAL, DEFAULT_UPDATE_AKITA_DAO_DURATION, DEFAULT_UPDATE_AKITA_DAO_PARTICIPATION, DEFAULT_UPDATE_AKITA_DAO_PROPOSAL_CREATION, DEFAULT_UPDATE_AKITA_DAO_PROPOSAL_POWER, DEFAULT_UPDATE_FIELD_APPROVAL, DEFAULT_UPDATE_FIELD_PARTICIPATION, DEFAULT_UPDATE_FIELD_PROPOSAL_CREATION, DEFAULT_UPDATE_FIELD_PROPOSAL_POWER, DEFAULT_UPDATE_FIELD_VOTING_DURATION, DEFAULT_UPGRADE_APP_APPROVAL, DEFAULT_UPGRADE_APP_PARTICIPATION, DEFAULT_UPGRADE_APP_PROPOSAL_CREATION, DEFAULT_UPGRADE_APP_PROPOSAL_POWER, DEFAULT_UPGRADE_APP_VOTING_DURATION, DEFAULT_WALLET_CREATE_FEE, DEFAULT_WALLET_REFERRER_PERCENTAGE } from '../../smart_contracts/utils/defaults';
import { FixtureAndAccount } from '../types';
import { logger } from '../utils/logger';
import { deployAbstractedAccountFactory } from './abstracted-account';
import { deployEscrowFactory } from './escrow';
import { deployRevenueManagerPlugin } from './plugins/revenue-manager';
import { deployUpdateAkitaDaoPlugin } from './plugins/update-akita-dao';
import { deployStakingPoolFactory } from './staking-pool';
import { deploySubscriptions } from './subscriptions';

type DeployParams = FixtureAndAccount & { apps: Partial<AkitaDaoApps> }
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
    impact = 0n,
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
        impact,
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
  revenueManagerPlugin: RevenueManagerPluginSDK;
  updatePlugin: UpdateAkitaDAOPluginSDK
  escrowFactory: EscrowFactoryClient
}

export const buildAkitaUniverse = async (params: DeployParams): Promise<AkitaUniverse> => {

  if (!params.sender) {
    throw new Error('Sender is required to deploy and setup Akita DAO');
  }

  const { fixture: localnet } = params;

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
  await localnet.algorand.account.ensureFunded(params.sender, dispenser, (100).algos());
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

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 2: Configure DAO
  // ═══════════════════════════════════════════════════════════════════════════
  logger.phase('CONFIGURE_DAO');

  const updateFieldsProposalId = await proposeAndExecute(dao, [
    {
      type: ProposalActionEnum.UpdateFields,
      field: 'akita_al',
      value: { wallet: abstractAccountFactory.appId }
    }
  ]);
  logger.proposal('UpdateFields: Set wallet factory', updateFieldsProposalId);

  // Fund DAO with setup cost before creating the wallet
  const setupCost = await dao.setupCost();
  await dao.client.appClient.fundAppAccount({ amount: setupCost.microAlgo() });

  await dao.setup();
  logger.wallet('DAO ARC58 Wallet', dao.wallet.client.appId, dao.wallet.client.appAddress.toString());

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 3: Deploy & Install Plugins
  // ═══════════════════════════════════════════════════════════════════════════
  logger.phase('DEPLOY_PLUGINS');

  const walletFactoryRevenueEscrow = 'rev_wallet';
  // const auctionFactoryRevenueEscrow = 'rev_auctions';
  // const marketplaceFactoryRevenueEscrow = 'rev_marketplace';
  // const raffleFactoryRevenueEscrow = 'rev_raffle';
  // const socialFactoryRevenueEscrow = 'rev_social';
  const subscriptionsFactoryRevenueEscrow = 'rev_subscriptions';
  const stakingPoolFactoryRevenueEscrow = 'rev_pool';

  // Calculate MBR for escrows
  const mbrResults = await Promise.allSettled([
    dao.wallet.getMbr({ escrow: walletFactoryRevenueEscrow, methodCount: 0n, plugin: '', groups: 0n }),
    dao.wallet.getMbr({ escrow: subscriptionsFactoryRevenueEscrow, methodCount: 0n, plugin: '', groups: 0n }),
    dao.wallet.getMbr({ escrow: stakingPoolFactoryRevenueEscrow, methodCount: 0n, plugin: '', groups: 0n }),
  ]);

  let totalMbr = 0n;
  for (const result of mbrResults) {
    if (result.status === 'rejected') {
      logger.error('MBR calculation failed', result.reason);
      throw result.reason;
    }
    totalMbr += result.value.newEscrowMintCost;
  }

  await dao.wallet.client.appClient.fundAppAccount({ amount: totalMbr.microAlgo() });

  const escrows = [
    {
      escrow: walletFactoryRevenueEscrow,
      source: abstractAccountFactory.client.appAddress.toString()
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
    // {
    //   escrow: socialFactoryRevenueEscrow,
    //   source: abstractAccountFactory.client.appAddress.toString()
    // },
    {
      escrow: subscriptionsFactoryRevenueEscrow,
      source: abstractAccountFactory.client.appAddress.toString()
    },
    {
      escrow: stakingPoolFactoryRevenueEscrow,
      source: abstractAccountFactory.client.appAddress.toString()
    }
  ]

  // Deploy Revenue Manager Plugin
  const revenueManagerPluginSdk = await deployRevenueManagerPlugin({
    fixture: localnet,
    sender: params.sender,
    signer: params.signer
  });
  logger.plugin('deploy', 'RevenueManagerPlugin', revenueManagerPluginSdk.appId);

  await localnet.algorand.account.ensureFunded(revenueManagerPluginSdk.client.appAddress, dispenser, (1).algos());

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
      field: 'plugn_al',
      value: { update: daoUpdatePluginSdk.appId }
    }
  ]);

  let mbr = await dao.wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 2n });

  const paymentAmount = 1_000_000n;
  const fundAmount = mbr.plugins + mbr.executions + paymentAmount;

  await dao.wallet.client.appClient.fundAppAccount({ amount: fundAmount.microAlgo() });

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

  for (const { escrow, source } of escrows) {
    await proposeAndExecute(dao, [{ type: ProposalActionEnum.NewEscrow, escrow }]);

    const newReceiveEscrowPluginBuild = await dao.wallet.build.usePlugin({
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
    revenueManagerPlugin: revenueManagerPluginSdk,
    updatePlugin: daoUpdatePluginSdk,
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
