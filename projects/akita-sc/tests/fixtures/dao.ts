import { AkitaDaoApps, AkitaDaoFactory } from '../../smart_contracts/artifacts/arc58/dao/AkitaDAOClient';
import { FixtureAndAccount } from '../types';
import { DEFAULT_ADD_ALLOWANCE_APPROVAL, DEFAULT_ADD_ALLOWANCE_PARTICIPATION, DEFAULT_ADD_ALLOWANCE_PROPOSAL_CREATION, DEFAULT_ADD_ALLOWANCE_PROPOSAL_POWER, DEFAULT_ADD_ALLOWANCE_VOTING_DURATION, DEFAULT_ADD_PLUGIN_APPROVAL, DEFAULT_ADD_PLUGIN_PARTICIPATION, DEFAULT_ADD_PLUGIN_PROPOSAL_CREATION, DEFAULT_ADD_PLUGIN_PROPOSAL_POWER, DEFAULT_ADD_PLUGIN_VOTING_DURATION, DEFAULT_AUCTION_COMPOSABLE_PERCENTAGE, DEFAULT_AUCTION_CREATION_FEE, DEFAULT_AUCTION_RAFFLE_PERCENTAGE, DEFAULT_AUCTION_SALE_IMPACT_MAX, DEFAULT_AUCTION_SALE_IMPACT_TAX_MIN, DEFAULT_IMPACT_TAX_MAX, DEFAULT_IMPACT_TAX_MIN, DEFAULT_KRBY_PERCENTAGE, DEFAULT_MARKETPLACE_COMPOSABLE_PERCENTAGE, DEFAULT_MARKETPLACE_ROYALTY_DEFAULT_PERCENTAGE, DEFAULT_MARKETPLACE_SALE_PERCENTAGE_MAXIMUM, DEFAULT_MARKETPLACE_SALE_PERCENTAGE_MINIMUM, DEFAULT_MIN_POOL_CREATION_FEE, DEFAULT_MIN_REWARDS_IMPACT, DEFAULT_MODERATOR_PERCENTAGE, DEFAULT_NEW_ESCROW_APPROVAL, DEFAULT_NEW_ESCROW_PARTICIPATION, DEFAULT_NEW_ESCROW_PROPOSAL_CREATION, DEFAULT_NEW_ESCROW_PROPOSAL_POWER, DEFAULT_NEW_ESCROW_VOTING_DURATION, DEFAULT_OMNIGEM_SALE_FEE, DEFAULT_POOL_IMPACT_TAX_MAX, DEFAULT_POOL_IMPACT_TAX_MIN, DEFAULT_POST_FEE, DEFAULT_RAFFLE_COMPOSABLE_PERCENTAGE, DEFAULT_RAFFLE_CREATION_FEE, DEFAULT_RAFFLE_SALE_IMPACT_MAX, DEFAULT_RAFFLE_SALE_IMPACT_TAX_MIN, DEFAULT_REACT_FEE, DEFAULT_REMOVE_ALLOWANCE_APPROVAL, DEFAULT_REMOVE_ALLOWANCE_PARTICIPATION, DEFAULT_REMOVE_ALLOWANCE_PROPOSAL_CREATION, DEFAULT_REMOVE_ALLOWANCE_PROPOSAL_POWER, DEFAULT_REMOVE_ALLOWANCE_VOTING_DURATION, DEFAULT_REMOVE_EXECUTE_PROPOSAL_APPROVAL, DEFAULT_REMOVE_EXECUTE_PROPOSAL_CREATION, DEFAULT_REMOVE_EXECUTE_PROPOSAL_PARTICIPATION, DEFAULT_REMOVE_EXECUTE_PROPOSAL_POWER, DEFAULT_REMOVE_EXECUTE_PROPOSAL_VOTING_DURATION, DEFAULT_REMOVE_PLUGIN_APPROVAL, DEFAULT_REMOVE_PLUGIN_PARTICIPATION, DEFAULT_REMOVE_PLUGIN_PROPOSAL_CREATION, DEFAULT_REMOVE_PLUGIN_PROPOSAL_POWER, DEFAULT_REMOVE_PLUGIN_VOTING_DURATION, DEFAULT_SERVICE_CREATION_FEE, DEFAULT_SHUFFLE_SALE_PERCENTAGE, DEFAULT_SUBSCRIPTION_PAYMENT_PERCENTAGE, DEFAULT_SUBSCRIPTION_TRIGGER_PERCENTAGE, DEFAULT_SWAP_COMPOSABLE_PERCENTAGE, DEFAULT_SWAP_FEE_IMPACT_TAX_MAX, DEFAULT_SWAP_FEE_IMPACT_TAX_MIN, DEFAULT_SWAP_LIQUIDITY_PERCENTAGE, DEFAULT_UPDATE_AKITA_DAO_APP_APPROVAL, DEFAULT_UPDATE_AKITA_DAO_DURATION, DEFAULT_UPDATE_AKITA_DAO_PARTICIPATION, DEFAULT_UPDATE_AKITA_DAO_PROPOSAL_CREATION, DEFAULT_UPDATE_AKITA_DAO_PROPOSAL_POWER, DEFAULT_UPDATE_FIELD_APPROVAL, DEFAULT_UPDATE_FIELD_PARTICIPATION, DEFAULT_UPDATE_FIELD_PROPOSAL_CREATION, DEFAULT_UPDATE_FIELD_PROPOSAL_POWER, DEFAULT_UPDATE_FIELD_VOTING_DURATION, DEFAULT_UPGRADE_APP_APPROVAL, DEFAULT_UPGRADE_APP_PARTICIPATION, DEFAULT_UPGRADE_APP_PROPOSAL_CREATION, DEFAULT_UPGRADE_APP_PROPOSAL_POWER, DEFAULT_UPGRADE_APP_VOTING_DURATION, DEFAULT_WALLET_CREATE_FEE, DEFAULT_WALLET_REFERRER_PERCENTAGE } from '../../smart_contracts/utils/defaults'
import { AkitaDaoSDK, EMPTY_CID, ProposalAction, ProposalActionEnum, UpdateAkitaDAOPluginSDK, WalletFactorySDK } from 'akita-sdk';
import { microAlgo } from '@algorandfoundation/algokit-utils';
import { deployAbstractedAccountFactory } from './abstracted-account';
import { deployUpdateAkitaDaoPlugin } from './plugins/update-akita-dao';
import { deployEscrowFactory } from './escrow';
import { SDKClient } from 'akita-sdk/src/types';
import { deployPayPlugin } from './plugins/pay';
import { getApplicationAddress } from 'algosdk';

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

  client.appClient.fundAppAccount({ amount: microAlgo(1318600n) })

  console.log('Akita DAO deployed with appId:', client.appId, client.appAddress.toString());

  // mint the DAOs ARC58 wallet
  // await client.send.setup({ args: { nickname: 'Akita DAO' }, extraFee: (100_000).microAlgos() })

  return new AkitaDaoSDK({
    algorand,
    factoryParams: {
      appId: client.appId,
      defaultSender: sender,
      defaultSigner: signer,
    }
  });
}

export const deployAndSetupAkitaDAO = async (params: DeployParams): Promise<{ walletFactory: WalletFactorySDK, dao: AkitaDaoSDK, daoUpdatePluginSdk: UpdateAkitaDAOPluginSDK }> => {

  if (!params.sender) {
    throw new Error('Sender is required to deploy and setup Akita DAO');
  }

  const { fixture: localnet } = params;

  const escrowFactory = await deployEscrowFactory({
    fixture: localnet,
    sender: params.sender,
    signer: params.signer
  });

  console.log('Escrow Factory deployed with appId:', escrowFactory.appId, escrowFactory.appAddress.toString());

  const dao = await deployAkitaDAO({ ...params, apps: { ...params.apps, escrow: escrowFactory.appId } });
  const akitaDao = dao.appId;

  const dispenser = await localnet.algorand.account.dispenserFromEnvironment();
  // also make sure the default sender is funded
  await localnet.algorand.account.ensureFunded(params.sender, dispenser, (100).algos());
  await localnet.algorand.account.ensureFunded(dao.readerAccount, dispenser, (1).algos());

  const abstractAccountFactory = (
    await deployAbstractedAccountFactory({
      fixture: localnet,
      sender: params.sender,
      signer: params.signer,
      args: {
        akitaDao,
        version: '0.0.1',
        escrowFactory: escrowFactory.appId,
      }
    })
  );

  console.log('Abstracted Account Factory deployed with appId:', abstractAccountFactory.appId, abstractAccountFactory.client.appAddress.toString());

  let proposalId: bigint | undefined;

  let actions: ProposalAction<SDKClient>[] = [
    {
      type: ProposalActionEnum.UpdateFields,
      field: 'akita_al',
      value: { wallet: abstractAccountFactory.appId }
    }
  ]

  let proposalMbr = await dao.proposalCost({ actions });

  console.log('Wallet Factory Proposal MBR:', proposalMbr.microAlgo());

  await dao.client.appClient.fundAppAccount({
    amount: proposalMbr.microAlgo()
  });

  ({ return: proposalId } = await dao.newProposal({ actions }));

  console.log(`Proposal ID: ${proposalId}`)

  if (proposalId === undefined) {
    throw new Error('Failed to create proposal');
  }

  await dao.executeProposal({ proposalId })

  const { returns } = await dao.setup()

  const [walletID] = returns as unknown as bigint[]

  // get the sdk for the DAO's arc58 wallet
  const wallet = await abstractAccountFactory.get({ appId: walletID });

  console.log('Akita DAO ARC58 Wallet deployed with appId:', wallet.appId, wallet.client.appAddress.toString());

  const walletFactoryRevenueEscrow = 'rev_wallet';
  const auctionFactoryRevenueEscrow = 'rev_auctions';
  const marketplaceFactoryRevenueEscrow = 'rev_marketplace';
  const raffleFactoryRevenueEscrow = 'rev_raffle';
  const socialFactoryRevenueEscrow = 'rev_social';
  const subscriptionsFactoryRevenueEscrow = 'rev_subscriptions';

  const mbrResults = await Promise.allSettled([
    wallet.getMbr({ escrow: walletFactoryRevenueEscrow, methodCount: 0n, plugin: '', groups: 0n }),
    wallet.getMbr({ escrow: auctionFactoryRevenueEscrow, methodCount: 0n, plugin: '', groups: 0n }),
    wallet.getMbr({ escrow: marketplaceFactoryRevenueEscrow, methodCount: 0n, plugin: '', groups: 0n }),
    wallet.getMbr({ escrow: raffleFactoryRevenueEscrow, methodCount: 0n, plugin: '', groups: 0n }),
    wallet.getMbr({ escrow: socialFactoryRevenueEscrow, methodCount: 0n, plugin: '', groups: 0n }),
    wallet.getMbr({ escrow: subscriptionsFactoryRevenueEscrow, methodCount: 0n, plugin: '', groups: 0n }),
  ]);

  let totalMbr = 0n;
  for (const result of mbrResults) {
    if (result.status === 'rejected') {
      throw result.reason;
    }

    totalMbr += result.value.newEscrowMintCost
  }

  actions = [
    {
      type: ProposalActionEnum.NewEscrow,
      escrow: 'rev_wallet'
    },
    {
      type: ProposalActionEnum.NewEscrow,
      escrow: 'rev_auctions'
    },
    {
      type: ProposalActionEnum.NewEscrow,
      escrow: 'rev_marketplace'
    },
    {
      type: ProposalActionEnum.NewEscrow,
      escrow: 'rev_raffle'
    },
    {
      type: ProposalActionEnum.NewEscrow,
      escrow: 'rev_social'
    }
  ]

  await wallet.client.appClient.fundAppAccount({
    amount: totalMbr.microAlgo()
  })

  proposalMbr = await dao.proposalCost({ actions });

  // fund the wallet to cover factory escrows' MBR & proposal box
  await dao.client.appClient.fundAppAccount({
    amount: (proposalMbr).microAlgo()
  });

  // abstract account factory escrow
  ({ return: proposalId } = await dao.newProposal({ actions }));

  console.log(`Proposal ID: ${proposalId}`)

  if (proposalId === undefined) {
    throw new Error('Failed to create proposal');
  }

  await dao.executeProposal({ proposalId })

  actions = [
    {
      type: ProposalActionEnum.NewEscrow,
      escrow: 'rev_subscriptions'
    }
  ]

  proposalMbr = await dao.proposalCost({ actions });

  await dao.client.appClient.fundAppAccount({
    amount: proposalMbr.microAlgo()
  });

  ({ return: proposalId } = await dao.newProposal({ actions }));

  console.log(`Proposal ID: ${proposalId}`)

  if (proposalId === undefined) {
    throw new Error('Failed to create proposal');
  }

  await dao.executeProposal({ proposalId })

  // mint updateAkitaDaoPlugin
  const daoUpdatePluginSdk = await deployUpdateAkitaDaoPlugin({
    fixture: localnet,
    sender: params.sender,
    signer: params.signer
  })

  let mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 2n })

  const paymentAmount = 1_000_000n
  const fundAmount = mbr.plugins + mbr.executions + paymentAmount

  await wallet.client.appClient.fundAppAccount({
    amount: fundAmount.microAlgo()
  })

  // install 'updateAkitaDaoEscrow' caller plugin
  actions = [
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
  ]

  proposalMbr = await dao.proposalCost({ actions });

  console.log('Fetched proposal action costs: ', proposalMbr.microAlgo());

  await dao.client.appClient.fundAppAccount({
    amount: proposalMbr.microAlgo()
  });

  ({ return: proposalId } = await dao.newProposal({ actions }));

  console.log(`Proposal ID: ${proposalId}`)

  if (proposalId === undefined) {
    throw new Error('Failed to create proposal');
  }

  await dao.executeProposal({ proposalId })

  // get rev_wallet escrow info
  const revWallet = await wallet.getEscrow(walletFactoryRevenueEscrow);

  // create the execution with the underlying wallet sdk
  const { lease, firstValid, lastValid, ids: groups, atcs } = await wallet.build.usePlugin({
    sender: params.sender,
    signer: params.signer,
    lease: 'my_lease',
    windowSize: 2000n,
    global: true,
    calls: [
      daoUpdatePluginSdk.updateAkitaDaoEscrowForApp({
        appId: abstractAccountFactory.appId,
        newEscrow: revWallet.id
      })
    ]
  })

  console.log({ firstValid, lastValid });

  // create an execution
  actions = [
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
  ]

  proposalMbr = await dao.proposalCost({ actions });

  await dao.client.appClient.fundAppAccount({
    amount: proposalMbr.microAlgo()
  });

  ({ return: proposalId } = await dao.newProposal({ actions }));

  console.log(`Proposal ID: ${proposalId}`)

  if (proposalId === undefined) {
    throw new Error('Failed to create proposal');
  }

  await dao.executeProposal({ proposalId })

  console.log(await wallet.getExecution(lease))

  const executionTxnIds = await atcs[0].submit(wallet.client.algorand.client.algod)

  console.log('Execution txn ids:', executionTxnIds);

  return { walletFactory: abstractAccountFactory, dao, daoUpdatePluginSdk };
}