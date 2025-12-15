import { algo, Config } from '@algorandfoundation/algokit-utils';
import { registerDebugEventHandlers } from '@algorandfoundation/algokit-utils-debug';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { AlgorandFixture } from '@algorandfoundation/algokit-utils/types/testing';
import { AuctionFactorySDK } from 'akita-sdk/auction';
import { AkitaDaoSDK, ProposalAction, ProposalActionEnum } from 'akita-sdk/dao';
import { MarketplaceSDK } from 'akita-sdk/marketplace';
import { PollFactorySDK } from 'akita-sdk/poll';
import { PrizeBoxFactorySDK } from 'akita-sdk/prize-box';
import { RaffleFactorySDK } from 'akita-sdk/raffle';
import { SocialSDK } from 'akita-sdk/social';
import { StakingPoolFactorySDK } from 'akita-sdk/staking-pool';
import { SubscriptionsSDK } from 'akita-sdk/subscriptions';
import { SDKClient } from 'akita-sdk/types';
import { type UpdateAkitaDAOPluginSDK, type WalletAddPluginParams, type WalletFactorySDK } from 'akita-sdk/wallet';
import type { TransactionSigner } from 'algosdk';
import { buildAkitaUniverse, deployAkitaDAO } from '../../../../../tests/fixtures/dao';
import type { AkitaDaoApps } from '../../../../artifacts/arc58/dao/AkitaDAOClient';

export interface BootstrapDaoTestContextOptions {
  fixture?: AlgorandFixture;
  configure?: boolean;
  apps?: Partial<AkitaDaoApps>;
  fundAmount?: number;
  useFullSetup?: boolean;
}

export interface DaoTestContext {
  fixture: AlgorandFixture;
  dao: AkitaDaoSDK;
  sender: string;
  signer: TransactionSigner;
  walletFactory?: WalletFactorySDK;
  daoUpdatePluginSdk?: UpdateAkitaDAOPluginSDK;
  escrowFactory?: bigint;
  // Additional upgradeable apps
  auctionFactory?: AuctionFactorySDK;
  marketplace?: MarketplaceSDK;
  raffleFactory?: RaffleFactorySDK;
  pollFactory?: PollFactorySDK;
  prizeBoxFactory?: PrizeBoxFactorySDK;
  stakingPoolFactory?: StakingPoolFactorySDK;
  subscriptions?: SubscriptionsSDK;
  social?: SocialSDK;
}

let configured = false;

const ensureConfigured = (debug = true) => {
  if (!configured) {
    Config.configure({ debug });
    registerDebugEventHandlers();
    configured = true;
  }
};

export const bootstrapDaoTestContext = async (options: BootstrapDaoTestContextOptions = {}): Promise<DaoTestContext> => {
  const fixture = options.fixture ?? algorandFixture();

  if (options.configure ?? true) {
    ensureConfigured();
  }

  await fixture.newScope();

  const { algorand, context: { testAccount } } = fixture;
  const sender = testAccount.toString();
  const signer = testAccount.signer;

  const dispenser = await algorand.account.dispenserFromEnvironment();
  await algorand.account.ensureFunded(sender, dispenser, algo(options.fundAmount ?? 200));

  if (options.useFullSetup) {
    const {
      dao,
      walletFactory,
      updatePlugin,
      escrowFactory,
      auctionFactory,
      marketplace,
      raffleFactory,
      pollFactory,
      prizeBoxFactory,
      stakingPoolFactory,
      subscriptions,
      social,
    } = await buildAkitaUniverse({
      fixture,
      sender,
      signer,
      apps: options.apps ?? {}
    });

    return {
      fixture,
      dao,
      sender,
      signer,
      walletFactory,
      daoUpdatePluginSdk: updatePlugin,
      escrowFactory: escrowFactory.appId,
      auctionFactory,
      marketplace,
      raffleFactory,
      pollFactory,
      prizeBoxFactory,
      stakingPoolFactory,
      subscriptions,
      social,
    };
  }

  const dao = await deployAkitaDAO({
    fixture,
    sender,
    signer,
    apps: options.apps ?? {}
  });

  return { fixture, dao, sender, signer };
};

export const proposeAndExecute = async <TClient extends SDKClient>(dao: AkitaDaoSDK, actions: ProposalAction<TClient>[]) => {
  const info = await dao.proposalCost({ actions });

  await dao.client.appClient.fundAppAccount({ amount: info.total.microAlgo() });

  const { return: proposalId } = await dao.newProposal({ actions });

  if (proposalId === undefined) {
    throw new Error('Failed to create proposal');
  }

  await dao.executeProposal({ proposalId });

  return proposalId;
};

export interface BuildAddPluginActionOptions<TClient extends SDKClient> extends Omit<WalletAddPluginParams<TClient>, 'sender' | 'signer'> {
  governance?: {
    fee?: bigint;
    power?: bigint;
    duration?: bigint;
    participation?: bigint;
    approval?: bigint;
  };
  sourceLink?: string;
  name?: string;
}

export const buildAddPluginAction = <TClient extends SDKClient>({
  governance,
  sourceLink = '',
  name,
  ...walletParams
}: BuildAddPluginActionOptions<TClient>): ProposalAction<TClient> => {
  const { fee = 0n, power = 0n, duration = 0n, participation = 0n, approval = 0n } = governance ?? {};

  if (name) {
    return {
      type: ProposalActionEnum.AddNamedPlugin,
      name,
      ...walletParams,
      fee,
      power,
      duration,
      participation,
      approval,
      sourceLink,
    } as ProposalAction<TClient>;
  }

  return {
    type: ProposalActionEnum.AddPlugin,
    ...walletParams,
    fee,
    power,
    duration,
    participation,
    approval,
    sourceLink,
  } as ProposalAction<TClient>;
};

export interface BuildUpgradeActionParams {
  app: bigint;
  groups: Uint8Array[];
  firstValid: bigint;
  lastValid: bigint;
  executionKey?: Uint8Array;
}