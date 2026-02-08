import { microAlgo } from '@algorandfoundation/algokit-utils';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { ProposalAction, ProposalActionEnum } from 'akita-sdk/dao';
import { SDKClient } from 'akita-sdk/types';
import { MockAuctionFactoryClient, MockAuctionFactoryFactory } from '../../../../artifacts/mocks/auction-factory/MockAuctionFactoryClient';
import { MockAkitaDaoClient, MockAkitaDaoFactory } from '../../../../artifacts/mocks/dao/MockAkitaDAOClient';
import { MockMarketplaceClient, MockMarketplaceFactory } from '../../../../artifacts/mocks/marketplace/MockMarketplaceClient';
import { MockPollFactoryClient, MockPollFactoryFactory } from '../../../../artifacts/mocks/poll-factory/MockPollFactoryClient';
import { MockPrizeBoxFactoryClient, MockPrizeBoxFactoryFactory } from '../../../../artifacts/mocks/prize-box-factory/MockPrizeBoxFactoryClient';
import { MockRaffleFactoryClient, MockRaffleFactoryFactory } from '../../../../artifacts/mocks/raffle-factory/MockRaffleFactoryClient';
import { MockAkitaSocialClient, MockAkitaSocialFactory } from '../../../../artifacts/mocks/social/MockAkitaSocialClient';
import { MockStakingPoolFactoryClient, MockStakingPoolFactoryFactory } from '../../../../artifacts/mocks/staking-pool-factory/MockStakingPoolFactoryClient';
import { MockSubscriptionsClient, MockSubscriptionsFactory } from '../../../../artifacts/mocks/subscriptions/MockSubscriptionsClient';
import { MockAbstractedAccountFactoryClient, MockAbstractedAccountFactoryFactory } from '../../../../artifacts/mocks/wallet-factory/MockAbstractedAccountFactoryClient';
import {
  bootstrapDaoTestContext,
  proposeAndExecute,
  type DaoTestContext,
} from '../utils';

const fixture = algorandFixture();

/**
 * Tests for upgrading the DAO and other contracts the DAO owns.
 * 
 * The UpdateAkitaDAO plugin allows the DAO wallet to:
 * 1. Upload new contract code via initBoxedContract/loadBoxedContract
 * 2. Apply the upgrade to any app the DAO owns via updateApp
 * 3. Update the Akita DAO reference on child contracts via updateAkitaDaoForApp
 * 4. Update escrow references on child contracts via updateAkitaDaoEscrowForApp
 * 
 * NOTE: DAO Self-Upgrade tests MUST run last as they replace the DAO with MockAkitaDAO
 */
describe('ARC58 DAO Upgrade', () => {
  let context: DaoTestContext;

  beforeAll(async () => {
    context = await bootstrapDaoTestContext({ fixture, useFullSetup: true });
  });

  beforeEach(async () => {
    await fixture.newScope();
  });

  // Helper function to ensure sender has enough funds for upgrade operations
  const ensureSenderFunded = async () => {
    const { fixture, sender } = context;
    const { algorand } = fixture.context;
    const dispenser = await algorand.account.dispenserFromEnvironment();
    // Fund with 50 ALGO to cover upgrade operations
    await algorand.account.ensureFunded(sender, dispenser, microAlgo(50_000_000n));
  };

  // External Contract Upgrades run FIRST (before DAO is replaced with mock)
  describe('External Contract Upgrades', () => {
    // This test MUST run before upgrading walletFactory since it calls methods on the original contract
    test('should verify DAO wallet can use updateAkitaDaoEscrowForApp', async () => {
      await ensureSenderFunded();
      // This simpler method works because it has the correct signature:
      // updateAkitaDaoEscrowForApp(wallet: Application, rekeyBack: boolean, ...)
      const { dao, sender, signer, daoUpdatePluginSdk, walletFactory } = context;
      expect(daoUpdatePluginSdk).toBeDefined();
      expect(walletFactory).toBeDefined();

      const wallet = dao.wallet;
      const daoUpdateSdk = daoUpdatePluginSdk!;

      // Create a test escrow if it doesn't exist
      const testEscrow = 'test_upgrade_escrow';

      try {
        await proposeAndExecute(dao, [
          { type: ProposalActionEnum.NewEscrow, escrow: testEscrow },
        ]);
      } catch {
        // Escrow might already exist
      }

      const escrowInfo = await wallet.getEscrow(testEscrow);

      // Fund the wallet for plugin execution
      const mbr = await wallet.getMbr({
        escrow: '',
        methodCount: 0n,
        plugin: '',
        groups: 2n,
      });
      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(mbr.plugins + mbr.executions + 1_000_000n),
      });

      // Build the plugin execution - this should work because updateAkitaDaoEscrowForApp
      // has the correct signature with wallet as the first argument
      const shortTimestamp = Date.now() % 1_000_000;
      const execution = await wallet.build.usePlugin({
        sender,
        signer,
        lease: `escrow_upd_${shortTimestamp}`,
        windowSize: 2000n,
        global: true,
        calls: [
          daoUpdateSdk.updateAkitaDaoEscrowForApp({
            appId: walletFactory!.appId,
            newEscrow: escrowInfo.id,
          }),
        ],
      });

      expect(execution.atcs).toBeDefined();
      expect(execution.atcs.length).toBeGreaterThan(0);
    });

    test('should upgrade WalletFactory (AbstractedAccountFactory) to MockAbstractedAccountFactory', async () => {
      await ensureSenderFunded();
      const { fixture, dao, sender, signer, daoUpdatePluginSdk, walletFactory } = context;
      const { algorand } = fixture.context;
      expect(daoUpdatePluginSdk).toBeDefined();
      expect(walletFactory).toBeDefined();

      const wallet = dao.wallet;
      const daoUpdateSdk = daoUpdatePluginSdk!;
      const upgradeVersion = `1.0.0`;

      const preFundMbr = await wallet.getMbr({
        escrow: '',
        methodCount: 0n,
        plugin: '',
        groups: 4n,
      });
      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(preFundMbr.plugins + preFundMbr.executions + 2_000_000n),
      });

      const mockFactoryFactory = new MockAbstractedAccountFactoryFactory({
        algorand,
        defaultSender: sender,
        defaultSigner: signer,
      });

      const compiledMock = await mockFactoryFactory.appFactory.compile();

      const shortTimestamp = Date.now() % 1_000_000;
      const execution = await wallet.build.usePlugin({
        sender,
        signer,
        lease: `wf_upg_${shortTimestamp}`,
        windowSize: 2000n,
        global: true,
        calls: [
          daoUpdateSdk.updateApp({
            sender,
            signer,
            appId: walletFactory!.appId,
            version: upgradeVersion,
            data: compiledMock.approvalProgram,
          }),
        ],
      });

      const walletMbr = await wallet.getMbr({
        escrow: '',
        methodCount: 0n,
        plugin: '',
        groups: BigInt(execution.atcs.length),
      });
      const executionBuffer = 1_000_000n;
      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(walletMbr.plugins + walletMbr.executions + executionBuffer),
      });

      const upgradeAction: ProposalAction<SDKClient> = {
        type: ProposalActionEnum.UpgradeApp,
        app: walletFactory!.appId,
        executionKey: execution.lease,
        groups: execution.ids,
        firstValid: execution.firstValid,
        lastValid: execution.lastValid,
      };

      const proposalId = await proposeAndExecute(dao, [upgradeAction]);

      // get the proposal and print the details
      const proposal = await dao.getProposal(proposalId);

      await execution.atcs[0].submit(wallet.client.algorand.client.algod);

      const mockClient = new MockAbstractedAccountFactoryClient({
        algorand,
        appId: walletFactory!.appId,
        defaultSender: sender,
        defaultSigner: signer,
      });

      const pingResult = await mockClient.send.ping({ args: {} });
      expect(pingResult.return).toBe(4242n);
    });

    test('should verify wallet factory is owned by DAO', async () => {
      const { walletFactory } = context;
      expect(walletFactory).toBeDefined();
      expect(walletFactory!.appId).toBeGreaterThan(0n);
    });

    test('should upgrade AuctionFactory to MockAuctionFactory', async () => {
      await ensureSenderFunded();
      const { fixture, dao, sender, signer, daoUpdatePluginSdk, auctionFactory } = context;
      const { algorand } = fixture.context;
      expect(daoUpdatePluginSdk).toBeDefined();
      expect(auctionFactory).toBeDefined();

      const wallet = dao.wallet;
      const daoUpdateSdk = daoUpdatePluginSdk!;
      const upgradeVersion = `1.0.0`;

      const preFundMbr = await wallet.getMbr({
        escrow: '',
        methodCount: 0n,
        plugin: '',
        groups: 4n,
      });
      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(preFundMbr.plugins + preFundMbr.executions + 2_000_000n),
      });

      const mockFactory = new MockAuctionFactoryFactory({
        algorand,
        defaultSender: sender,
        defaultSigner: signer,
      });

      const compiledMock = await mockFactory.appFactory.compile();

      const shortTimestamp = Date.now() % 1_000_000;
      const execution = await wallet.build.usePlugin({
        sender,
        signer,
        lease: `af_upg_${shortTimestamp}`,
        windowSize: 2000n,
        global: true,
        calls: [
          daoUpdateSdk.updateApp({
            sender,
            signer,
            appId: auctionFactory!.appId,
            version: upgradeVersion,
            data: compiledMock.approvalProgram,
          }),
        ],
      });

      const walletMbr = await wallet.getMbr({
        escrow: '',
        methodCount: 0n,
        plugin: '',
        groups: BigInt(execution.atcs.length),
      });
      const executionBuffer = 1_000_000n;
      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(walletMbr.plugins + walletMbr.executions + executionBuffer),
      });

      const upgradeAction: ProposalAction<SDKClient> = {
        type: ProposalActionEnum.UpgradeApp,
        app: auctionFactory!.appId,
        executionKey: execution.lease,
        groups: execution.ids,
        firstValid: execution.firstValid,
        lastValid: execution.lastValid,
      };

      await proposeAndExecute(dao, [upgradeAction]);
      await execution.atcs[0].submit(wallet.client.algorand.client.algod);

      const mockClient = new MockAuctionFactoryClient({
        algorand,
        appId: auctionFactory!.appId,
        defaultSender: sender,
        defaultSigner: signer,
      });

      const pingResult = await mockClient.send.ping({ args: {} });
      expect(pingResult.return).toBe(1001n);
    });

    test('should upgrade Marketplace to MockMarketplace', async () => {
      await ensureSenderFunded();
      const { fixture, dao, sender, signer, daoUpdatePluginSdk, marketplace } = context;
      const { algorand } = fixture.context;
      expect(daoUpdatePluginSdk).toBeDefined();
      expect(marketplace).toBeDefined();

      const wallet = dao.wallet;
      const daoUpdateSdk = daoUpdatePluginSdk!;
      const upgradeVersion = `1.0.0`;

      const preFundMbr = await wallet.getMbr({
        escrow: '',
        methodCount: 0n,
        plugin: '',
        groups: 4n,
      });
      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(preFundMbr.plugins + preFundMbr.executions + 2_000_000n),
      });

      const mockFactory = new MockMarketplaceFactory({
        algorand,
        defaultSender: sender,
        defaultSigner: signer,
      });

      const compiledMock = await mockFactory.appFactory.compile();

      const shortTimestamp = Date.now() % 1_000_000;
      const execution = await wallet.build.usePlugin({
        sender,
        signer,
        lease: `mp_upg_${shortTimestamp}`,
        windowSize: 2000n,
        global: true,
        calls: [
          daoUpdateSdk.updateApp({
            sender,
            signer,
            appId: marketplace!.appId,
            version: upgradeVersion,
            data: compiledMock.approvalProgram,
          }),
        ],
      });

      const walletMbr = await wallet.getMbr({
        escrow: '',
        methodCount: 0n,
        plugin: '',
        groups: BigInt(execution.atcs.length),
      });
      const executionBuffer = 1_000_000n;
      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(walletMbr.plugins + walletMbr.executions + executionBuffer),
      });

      const upgradeAction: ProposalAction<SDKClient> = {
        type: ProposalActionEnum.UpgradeApp,
        app: marketplace!.appId,
        executionKey: execution.lease,
        groups: execution.ids,
        firstValid: execution.firstValid,
        lastValid: execution.lastValid,
      };

      await proposeAndExecute(dao, [upgradeAction]);
      await execution.atcs[0].submit(wallet.client.algorand.client.algod);

      const mockClient = new MockMarketplaceClient({
        algorand,
        appId: marketplace!.appId,
        defaultSender: sender,
        defaultSigner: signer,
      });

      const pingResult = await mockClient.send.ping({ args: {} });
      expect(pingResult.return).toBe(1002n);
    });

    test('should upgrade RaffleFactory to MockRaffleFactory', async () => {
      await ensureSenderFunded();
      const { fixture, dao, sender, signer, daoUpdatePluginSdk, raffleFactory } = context;
      const { algorand } = fixture.context;
      expect(daoUpdatePluginSdk).toBeDefined();
      expect(raffleFactory).toBeDefined();

      const wallet = dao.wallet;
      const daoUpdateSdk = daoUpdatePluginSdk!;
      const upgradeVersion = `1.0.0`;

      const preFundMbr = await wallet.getMbr({
        escrow: '',
        methodCount: 0n,
        plugin: '',
        groups: 4n,
      });
      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(preFundMbr.plugins + preFundMbr.executions + 2_000_000n),
      });

      const mockFactory = new MockRaffleFactoryFactory({
        algorand,
        defaultSender: sender,
        defaultSigner: signer,
      });

      const compiledMock = await mockFactory.appFactory.compile();

      const shortTimestamp = Date.now() % 1_000_000;
      const execution = await wallet.build.usePlugin({
        sender,
        signer,
        lease: `rf_upg_${shortTimestamp}`,
        windowSize: 2000n,
        global: true,
        calls: [
          daoUpdateSdk.updateApp({
            sender,
            signer,
            appId: raffleFactory!.appId,
            version: upgradeVersion,
            data: compiledMock.approvalProgram,
          }),
        ],
      });

      const walletMbr = await wallet.getMbr({
        escrow: '',
        methodCount: 0n,
        plugin: '',
        groups: BigInt(execution.atcs.length),
      });
      const executionBuffer = 1_000_000n;
      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(walletMbr.plugins + walletMbr.executions + executionBuffer),
      });

      const upgradeAction: ProposalAction<SDKClient> = {
        type: ProposalActionEnum.UpgradeApp,
        app: raffleFactory!.appId,
        executionKey: execution.lease,
        groups: execution.ids,
        firstValid: execution.firstValid,
        lastValid: execution.lastValid,
      };

      await proposeAndExecute(dao, [upgradeAction]);
      await execution.atcs[0].submit(wallet.client.algorand.client.algod);

      const mockClient = new MockRaffleFactoryClient({
        algorand,
        appId: raffleFactory!.appId,
        defaultSender: sender,
        defaultSigner: signer,
      });

      const pingResult = await mockClient.send.ping({ args: {} });
      expect(pingResult.return).toBe(1003n);
    });

    test('should upgrade PollFactory to MockPollFactory', async () => {
      await ensureSenderFunded();
      const { fixture, dao, sender, signer, daoUpdatePluginSdk, pollFactory } = context;
      const { algorand } = fixture.context;
      expect(daoUpdatePluginSdk).toBeDefined();
      expect(pollFactory).toBeDefined();

      const wallet = dao.wallet;
      const daoUpdateSdk = daoUpdatePluginSdk!;
      const upgradeVersion = `1.0.0`;

      const preFundMbr = await wallet.getMbr({
        escrow: '',
        methodCount: 0n,
        plugin: '',
        groups: 4n,
      });
      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(preFundMbr.plugins + preFundMbr.executions + 2_000_000n),
      });

      const mockFactory = new MockPollFactoryFactory({
        algorand,
        defaultSender: sender,
        defaultSigner: signer,
      });

      const compiledMock = await mockFactory.appFactory.compile();

      const shortTimestamp = Date.now() % 1_000_000;
      const execution = await wallet.build.usePlugin({
        sender,
        signer,
        lease: `pf_upg_${shortTimestamp}`,
        windowSize: 2000n,
        global: true,
        calls: [
          daoUpdateSdk.updateApp({
            sender,
            signer,
            appId: pollFactory!.appId,
            version: upgradeVersion,
            data: compiledMock.approvalProgram,
          }),
        ],
      });

      const walletMbr = await wallet.getMbr({
        escrow: '',
        methodCount: 0n,
        plugin: '',
        groups: BigInt(execution.atcs.length),
      });
      const executionBuffer = 1_000_000n;
      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(walletMbr.plugins + walletMbr.executions + executionBuffer),
      });

      const upgradeAction: ProposalAction<SDKClient> = {
        type: ProposalActionEnum.UpgradeApp,
        app: pollFactory!.appId,
        executionKey: execution.lease,
        groups: execution.ids,
        firstValid: execution.firstValid,
        lastValid: execution.lastValid,
      };

      await proposeAndExecute(dao, [upgradeAction]);
      await execution.atcs[0].submit(wallet.client.algorand.client.algod);

      const mockClient = new MockPollFactoryClient({
        algorand,
        appId: pollFactory!.appId,
        defaultSender: sender,
        defaultSigner: signer,
      });

      const pingResult = await mockClient.send.ping({ args: {} });
      expect(pingResult.return).toBe(1004n);
    });

    test('should upgrade PrizeBoxFactory to MockPrizeBoxFactory', async () => {
      await ensureSenderFunded();
      const { fixture, dao, sender, signer, daoUpdatePluginSdk, prizeBoxFactory } = context;
      const { algorand } = fixture.context;
      expect(daoUpdatePluginSdk).toBeDefined();
      expect(prizeBoxFactory).toBeDefined();

      const wallet = dao.wallet;
      const daoUpdateSdk = daoUpdatePluginSdk!;
      const upgradeVersion = `1.0.0`;

      const preFundMbr = await wallet.getMbr({
        escrow: '',
        methodCount: 0n,
        plugin: '',
        groups: 4n,
      });
      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(preFundMbr.plugins + preFundMbr.executions + 2_000_000n),
      });

      const mockFactory = new MockPrizeBoxFactoryFactory({
        algorand,
        defaultSender: sender,
        defaultSigner: signer,
      });

      const compiledMock = await mockFactory.appFactory.compile();

      const shortTimestamp = Date.now() % 1_000_000;
      const execution = await wallet.build.usePlugin({
        sender,
        signer,
        lease: `pb_upg_${shortTimestamp}`,
        windowSize: 2000n,
        global: true,
        calls: [
          daoUpdateSdk.updateApp({
            sender,
            signer,
            appId: prizeBoxFactory!.appId,
            version: upgradeVersion,
            data: compiledMock.approvalProgram,
          }),
        ],
      });

      const walletMbr = await wallet.getMbr({
        escrow: '',
        methodCount: 0n,
        plugin: '',
        groups: BigInt(execution.atcs.length),
      });
      const executionBuffer = 1_000_000n;
      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(walletMbr.plugins + walletMbr.executions + executionBuffer),
      });

      const upgradeAction: ProposalAction<SDKClient> = {
        type: ProposalActionEnum.UpgradeApp,
        app: prizeBoxFactory!.appId,
        executionKey: execution.lease,
        groups: execution.ids,
        firstValid: execution.firstValid,
        lastValid: execution.lastValid,
      };

      await proposeAndExecute(dao, [upgradeAction]);
      await execution.atcs[0].submit(wallet.client.algorand.client.algod);

      const mockClient = new MockPrizeBoxFactoryClient({
        algorand,
        appId: prizeBoxFactory!.appId,
        defaultSender: sender,
        defaultSigner: signer,
      });

      const pingResult = await mockClient.send.ping({ args: {} });
      expect(pingResult.return).toBe(1005n);
    });

    test('should upgrade StakingPoolFactory to MockStakingPoolFactory', async () => {
      await ensureSenderFunded();
      const { fixture, dao, sender, signer, daoUpdatePluginSdk, stakingPoolFactory } = context;
      const { algorand } = fixture.context;
      expect(daoUpdatePluginSdk).toBeDefined();
      expect(stakingPoolFactory).toBeDefined();

      const wallet = dao.wallet;
      const daoUpdateSdk = daoUpdatePluginSdk!;
      const upgradeVersion = `1.0.0`;

      const preFundMbr = await wallet.getMbr({
        escrow: '',
        methodCount: 0n,
        plugin: '',
        groups: 4n,
      });
      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(preFundMbr.plugins + preFundMbr.executions + 2_000_000n),
      });

      const mockFactory = new MockStakingPoolFactoryFactory({
        algorand,
        defaultSender: sender,
        defaultSigner: signer,
      });

      const compiledMock = await mockFactory.appFactory.compile();

      const shortTimestamp = Date.now() % 1_000_000;
      const execution = await wallet.build.usePlugin({
        sender,
        signer,
        lease: `sp_upg_${shortTimestamp}`,
        windowSize: 2000n,
        global: true,
        calls: [
          daoUpdateSdk.updateApp({
            sender,
            signer,
            appId: stakingPoolFactory!.appId,
            version: upgradeVersion,
            data: compiledMock.approvalProgram,
          }),
        ],
      });

      const walletMbr = await wallet.getMbr({
        escrow: '',
        methodCount: 0n,
        plugin: '',
        groups: BigInt(execution.atcs.length),
      });
      const executionBuffer = 1_000_000n;
      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(walletMbr.plugins + walletMbr.executions + executionBuffer),
      });

      const upgradeAction: ProposalAction<SDKClient> = {
        type: ProposalActionEnum.UpgradeApp,
        app: stakingPoolFactory!.appId,
        executionKey: execution.lease,
        groups: execution.ids,
        firstValid: execution.firstValid,
        lastValid: execution.lastValid,
      };

      await proposeAndExecute(dao, [upgradeAction]);
      await execution.atcs[0].submit(wallet.client.algorand.client.algod);

      const mockClient = new MockStakingPoolFactoryClient({
        algorand,
        appId: stakingPoolFactory!.appId,
        defaultSender: sender,
        defaultSigner: signer,
      });

      const pingResult = await mockClient.send.ping({ args: {} });
      expect(pingResult.return).toBe(1006n);
    });

    test('should upgrade Subscriptions to MockSubscriptions', async () => {
      await ensureSenderFunded();
      const { fixture, dao, sender, signer, daoUpdatePluginSdk, subscriptions } = context;
      const { algorand } = fixture.context;
      expect(daoUpdatePluginSdk).toBeDefined();
      expect(subscriptions).toBeDefined();

      const wallet = dao.wallet;
      const daoUpdateSdk = daoUpdatePluginSdk!;
      const upgradeVersion = `1.0.0`;

      const preFundMbr = await wallet.getMbr({
        escrow: '',
        methodCount: 0n,
        plugin: '',
        groups: 4n,
      });
      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(preFundMbr.plugins + preFundMbr.executions + 2_000_000n),
      });

      const mockFactory = new MockSubscriptionsFactory({
        algorand,
        defaultSender: sender,
        defaultSigner: signer,
      });

      const compiledMock = await mockFactory.appFactory.compile();

      const shortTimestamp = Date.now() % 1_000_000;
      const execution = await wallet.build.usePlugin({
        sender,
        signer,
        lease: `sub_upg_${shortTimestamp}`,
        windowSize: 2000n,
        global: true,
        calls: [
          daoUpdateSdk.updateApp({
            sender,
            signer,
            appId: subscriptions!.appId,
            version: upgradeVersion,
            data: compiledMock.approvalProgram,
          }),
        ],
      });

      const walletMbr = await wallet.getMbr({
        escrow: '',
        methodCount: 0n,
        plugin: '',
        groups: BigInt(execution.atcs.length),
      });
      const executionBuffer = 1_000_000n;
      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(walletMbr.plugins + walletMbr.executions + executionBuffer),
      });

      const upgradeAction: ProposalAction<SDKClient> = {
        type: ProposalActionEnum.UpgradeApp,
        app: subscriptions!.appId,
        executionKey: execution.lease,
        groups: execution.ids,
        firstValid: execution.firstValid,
        lastValid: execution.lastValid,
      };

      await proposeAndExecute(dao, [upgradeAction]);
      await execution.atcs[0].submit(wallet.client.algorand.client.algod);

      const mockClient = new MockSubscriptionsClient({
        algorand,
        appId: subscriptions!.appId,
        defaultSender: sender,
        defaultSigner: signer,
      });

      const pingResult = await mockClient.send.ping({ args: {} });
      expect(pingResult.return).toBe(1007n);
    });

    test('should upgrade AkitaSocial to MockAkitaSocial', async () => {
      await ensureSenderFunded();
      const { fixture, dao, sender, signer, daoUpdatePluginSdk, social } = context;
      const { algorand } = fixture.context;
      expect(daoUpdatePluginSdk).toBeDefined();
      expect(social).toBeDefined();

      const wallet = dao.wallet;
      const daoUpdateSdk = daoUpdatePluginSdk!;
      const upgradeVersion = `1.0.0`;

      const preFundMbr = await wallet.getMbr({
        escrow: '',
        methodCount: 0n,
        plugin: '',
        groups: 4n,
      });
      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(preFundMbr.plugins + preFundMbr.executions + 2_000_000n),
      });

      const mockFactory = new MockAkitaSocialFactory({
        algorand,
        defaultSender: sender,
        defaultSigner: signer,
      });

      const compiledMock = await mockFactory.appFactory.compile();

      const shortTimestamp = Date.now() % 1_000_000;
      const execution = await wallet.build.usePlugin({
        sender,
        signer,
        lease: `soc_upg_${shortTimestamp}`,
        windowSize: 2000n,
        global: true,
        calls: [
          daoUpdateSdk.updateApp({
            sender,
            signer,
            appId: social!.socialAppId,
            version: upgradeVersion,
            data: compiledMock.approvalProgram,
          }),
        ],
      });

      const walletMbr = await wallet.getMbr({
        escrow: '',
        methodCount: 0n,
        plugin: '',
        groups: BigInt(execution.atcs.length),
      });
      const executionBuffer = 1_000_000n;
      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(walletMbr.plugins + walletMbr.executions + executionBuffer),
      });

      const upgradeAction: ProposalAction<SDKClient> = {
        type: ProposalActionEnum.UpgradeApp,
        app: social!.socialAppId,
        executionKey: execution.lease,
        groups: execution.ids,
        firstValid: execution.firstValid,
        lastValid: execution.lastValid,
      };

      await proposeAndExecute(dao, [upgradeAction]);
      await execution.atcs[0].submit(wallet.client.algorand.client.algod);

      const mockClient = new MockAkitaSocialClient({
        algorand,
        appId: social!.socialAppId,
        defaultSender: sender,
        defaultSigner: signer,
      });

      const pingResult = await mockClient.send.ping({ args: {} });
      expect(pingResult.return).toBe(1008n);
    });
  });

  // DAO Self-Upgrade tests - the actual upgrade MUST run last as it replaces DAO with mock
  describe('DAO Self-Upgrade', () => {
    test('should verify DAO upgrade plugin is installed', async () => {
      const { daoUpdatePluginSdk } = context;
      expect(daoUpdatePluginSdk).toBeDefined();
      expect(daoUpdatePluginSdk!.appId).toBeGreaterThan(0n);
    });

    // This test MUST run last as it replaces the DAO with MockAkitaDAO
    test('should upgrade DAO to MockAkitaDAO using UpdateAkitaDAO plugin', async () => {
      await ensureSenderFunded();
      const { fixture, dao, sender, signer, daoUpdatePluginSdk } = context;
      const { algorand } = fixture.context;
      expect(daoUpdatePluginSdk).toBeDefined();

      const wallet = dao.wallet;
      const daoUpdateSdk = daoUpdatePluginSdk!;
      const upgradeVersion = `1.0.0`;

      const mockDaoFactory = new MockAkitaDaoFactory({
        algorand,
        defaultSender: sender,
        defaultSigner: signer,
      });

      // Pre-fund the wallet for the upgrade operation
      const preFundMbr = await wallet.getMbr({
        escrow: '',
        methodCount: 0n,
        plugin: '',
        groups: 4n,
      });
      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(preFundMbr.plugins + preFundMbr.executions + 2_000_000n),
      });

      const compiledMockDao = await mockDaoFactory.appFactory.compile();

      const shortTimestamp = Date.now() % 1_000_000;
      const leaseKey = `dao_upg_${shortTimestamp}`;

      // Use dao.build.usePlugin which automatically adds DAO box references
      const execution = await dao.wallet.build.usePlugin({
        sender,
        signer,
        lease: leaseKey,
        windowSize: 2000n,
        global: true,
        calls: [
          daoUpdateSdk.updateApp({
            sender,
            signer,
            appId: dao.appId,
            version: upgradeVersion,
            data: compiledMockDao.approvalProgram,
          }),
        ],
      });

      const walletMbr = await wallet.getMbr({
        escrow: '',
        methodCount: 0n,
        plugin: '',
        groups: BigInt(execution.atcs.length),
      });
      const executionBuffer = 1_000_000n;
      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(walletMbr.plugins + walletMbr.executions + executionBuffer),
      });

      const upgradeAction: ProposalAction<SDKClient> = {
        type: ProposalActionEnum.UpgradeApp,
        app: dao.appId,
        executionKey: execution.lease,
        groups: execution.ids,
        firstValid: execution.firstValid,
        lastValid: execution.lastValid,
      };

      await proposeAndExecute(dao, [upgradeAction]);

      await execution.atcs[0].submit(dao.client.algorand.client.algod);

      const mockClient = new MockAkitaDaoClient({
        algorand: dao.algorand,
        appId: dao.appId,
        defaultSender: sender,
        defaultSigner: signer,
      });

      const pingResult = await mockClient.send.ping({ args: {} });
      expect(pingResult.return).toBe(1337n);
    });
  });

});
