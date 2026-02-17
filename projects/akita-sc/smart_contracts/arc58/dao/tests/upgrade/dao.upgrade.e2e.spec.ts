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
import { AbstractedAccountFactoryFactory } from '../../../../artifacts/arc58/account/AbstractedAccountFactoryClient';
import { MockAbstractedAccountFactoryClient, MockAbstractedAccountFactoryFactory } from '../../../../artifacts/mocks/wallet-factory/MockAbstractedAccountFactoryClient';
import { MockAbstractedAccountClient, MockAbstractedAccountFactory } from '../../../../artifacts/mocks/wallet/MockAbstractedAccountClient';
import { AkitaDaoFactory } from '../../../../artifacts/arc58/dao-deployable/AkitaDAOClient';
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
 * Test ordering:
 * 1. External Contract Upgrades — upgrades each contract to mock (wallet factory does round-trip: mock then back to original)
 * 2. DAO Self-Upgrade — round-trip: upgrades DAO to mock, verifies, restores to original (needs real wallet)
 * 3. Wallet Update — runs last, replaces wallet with mock via rekey migration (needs real DAO + real factory)
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

  // External Contract Upgrades — needs real wallet for plugin execution
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

    test('should upgrade WalletFactory to mock and back to original', async () => {
      await ensureSenderFunded();
      const { fixture, dao, sender, signer, daoUpdatePluginSdk, walletFactory } = context;
      const { algorand } = fixture.context;
      expect(daoUpdatePluginSdk).toBeDefined();
      expect(walletFactory).toBeDefined();

      const wallet = dao.wallet;
      const daoUpdateSdk = daoUpdatePluginSdk!;

      // --- Phase 1: Upgrade to mock ---
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
      const mockExecution = await wallet.build.usePlugin({
        sender,
        signer,
        lease: `wf_upg_mock_${shortTimestamp}`,
        windowSize: 2000n,
        global: true,
        calls: [
          daoUpdateSdk.updateApp({
            sender,
            signer,
            appId: walletFactory!.appId,
            version: '1.0.0-mock',
            data: compiledMock.approvalProgram,
          }),
        ],
      });

      const mockMbr = await wallet.getMbr({
        escrow: '',
        methodCount: 0n,
        plugin: '',
        groups: BigInt(mockExecution.atcs.length),
      });
      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(mockMbr.plugins + mockMbr.executions + 1_000_000n),
      });

      await proposeAndExecute(dao, [{
        type: ProposalActionEnum.UpgradeApp,
        app: walletFactory!.appId,
        executionKey: mockExecution.lease,
        groups: mockExecution.ids,
        firstValid: mockExecution.firstValid,
        lastValid: mockExecution.lastValid,
      }]);
      await mockExecution.atcs[0].submit(wallet.client.algorand.client.algod);

      // Verify mock works
      const mockClient = new MockAbstractedAccountFactoryClient({
        algorand,
        appId: walletFactory!.appId,
        defaultSender: sender,
        defaultSigner: signer,
      });
      const pingResult = await mockClient.send.ping({ args: {} });
      expect(pingResult.return).toBe(4242n);

      // --- Phase 2: Upgrade back to original ---
      const restoreFundMbr = await wallet.getMbr({
        escrow: '',
        methodCount: 0n,
        plugin: '',
        groups: 4n,
      });
      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(restoreFundMbr.plugins + restoreFundMbr.executions + 2_000_000n),
      });

      const originalFactory = new AbstractedAccountFactoryFactory({
        algorand,
        defaultSender: sender,
        defaultSigner: signer,
      });
      const compiledOriginal = await originalFactory.appFactory.compile();

      const restoreTimestamp = (Date.now() + 1) % 1_000_000;
      const restoreExecution = await wallet.build.usePlugin({
        sender,
        signer,
        lease: `wf_upg_restore_${restoreTimestamp}`,
        windowSize: 2000n,
        global: true,
        calls: [
          daoUpdateSdk.updateApp({
            sender,
            signer,
            appId: walletFactory!.appId,
            version: '1.0.0-restored',
            data: compiledOriginal.approvalProgram,
          }),
        ],
      });

      const restoreMbr = await wallet.getMbr({
        escrow: '',
        methodCount: 0n,
        plugin: '',
        groups: BigInt(restoreExecution.atcs.length),
      });
      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(restoreMbr.plugins + restoreMbr.executions + 1_000_000n),
      });

      await proposeAndExecute(dao, [{
        type: ProposalActionEnum.UpgradeApp,
        app: walletFactory!.appId,
        executionKey: restoreExecution.lease,
        groups: restoreExecution.ids,
        firstValid: restoreExecution.firstValid,
        lastValid: restoreExecution.lastValid,
      }]);
      await restoreExecution.atcs[0].submit(wallet.client.algorand.client.algod);
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

  // DAO Self-Upgrade — round-trip: upgrade to mock, verify, restore to original
  // Must run BEFORE Wallet Update (needs real wallet for plugin execution)
  describe('DAO Self-Upgrade', () => {
    test('should verify DAO upgrade plugin is installed', async () => {
      const { daoUpdatePluginSdk } = context;
      expect(daoUpdatePluginSdk).toBeDefined();
      expect(daoUpdatePluginSdk!.appId).toBeGreaterThan(0n);
    });

    test('should upgrade DAO to MockAkitaDAO and restore to original', async () => {
      await ensureSenderFunded();
      const { fixture, dao, sender, signer, daoUpdatePluginSdk } = context;
      const { algorand } = fixture.context;
      expect(daoUpdatePluginSdk).toBeDefined();

      const wallet = dao.wallet;
      const daoUpdateSdk = daoUpdatePluginSdk!;

      // --- Phase 1: Build both executions while DAO is real ---

      const mockDaoFactory = new MockAkitaDaoFactory({
        algorand,
        defaultSender: sender,
        defaultSigner: signer,
      });
      const compiledMockDao = await mockDaoFactory.appFactory.compile();

      const originalDaoFactory = new AkitaDaoFactory({
        algorand,
        defaultSender: sender,
        defaultSigner: signer,
      });
      const compiledOriginalDao = await originalDaoFactory.appFactory.compile();

      // Pre-fund the wallet generously for both executions
      const preFundMbr = await wallet.getMbr({
        escrow: '',
        methodCount: 0n,
        plugin: '',
        groups: 4n,
      });
      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(preFundMbr.plugins + preFundMbr.executions + 5_000_000n),
      });

      // Build upgrade execution (DAO → mock)
      const shortTimestamp = Date.now() % 1_000_000;
      const upgradeExecution = await wallet.build.usePlugin({
        sender,
        signer,
        lease: `dao_upg_mock_${shortTimestamp}`,
        windowSize: 2000n,
        global: true,
        calls: [
          daoUpdateSdk.updateApp({
            sender,
            signer,
            appId: dao.appId,
            version: '1.0.0-mock',
            data: compiledMockDao.approvalProgram,
          }),
        ],
      });

      // Build restore execution (mock → original)
      const restoreTimestamp = (Date.now() + 1) % 1_000_000;
      const restoreExecution = await wallet.build.usePlugin({
        sender,
        signer,
        lease: `dao_upg_restore_${restoreTimestamp}`,
        windowSize: 2000n,
        global: true,
        calls: [
          daoUpdateSdk.updateApp({
            sender,
            signer,
            appId: dao.appId,
            version: '1.0.0-restored',
            data: compiledOriginalDao.approvalProgram,
          }),
        ],
      });

      // --- Phase 2: Register both execution keys (while DAO is real) ---

      const upgradeMbr = await wallet.getMbr({
        escrow: '',
        methodCount: 0n,
        plugin: '',
        groups: BigInt(upgradeExecution.atcs.length),
      });
      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(upgradeMbr.plugins + upgradeMbr.executions + 1_000_000n),
      });

      await proposeAndExecute(dao, [{
        type: ProposalActionEnum.UpgradeApp,
        app: dao.appId,
        executionKey: upgradeExecution.lease,
        groups: upgradeExecution.ids,
        firstValid: upgradeExecution.firstValid,
        lastValid: upgradeExecution.lastValid,
      }]);

      const restoreMbr = await wallet.getMbr({
        escrow: '',
        methodCount: 0n,
        plugin: '',
        groups: BigInt(restoreExecution.atcs.length),
      });
      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(restoreMbr.plugins + restoreMbr.executions + 1_000_000n),
      });

      await proposeAndExecute(dao, [{
        type: ProposalActionEnum.UpgradeApp,
        app: dao.appId,
        executionKey: restoreExecution.lease,
        groups: restoreExecution.ids,
        firstValid: restoreExecution.firstValid,
        lastValid: restoreExecution.lastValid,
      }]);

      // --- Phase 3: Execute upgrade, verify mock, then restore ---

      // Execute upgrade → DAO becomes mock
      await upgradeExecution.atcs[0].submit(dao.client.algorand.client.algod);

      // Verify mock works
      const mockClient = new MockAkitaDaoClient({
        algorand: dao.algorand,
        appId: dao.appId,
        defaultSender: sender,
        defaultSigner: signer,
      });
      const pingResult = await mockClient.send.ping({ args: {} });
      expect(pingResult.return).toBe(1337n);

      // Execute restore → DAO becomes original
      await restoreExecution.atcs[0].submit(dao.client.algorand.client.algod);
    });
  });

  // Wallet Update — runs last, replaces wallet with mock via rekey migration
  // Needs real DAO (for proposals + rekeyDao) and real factory
  describe('Wallet Update', () => {
    test('should update wallet to MockAbstractedAccount using rekey migration flow', async () => {
      await ensureSenderFunded();
      const { fixture, dao, sender, signer, daoUpdatePluginSdk, walletFactory } = context;
      const { algorand } = fixture.context;
      expect(daoUpdatePluginSdk).toBeDefined();
      expect(walletFactory).toBeDefined();

      const wallet = dao.wallet;
      const daoUpdateSdk = daoUpdatePluginSdk!;

      // Step 1: Upload mock wallet bytecode to factory via updateFactoryChildContract
      const mockWalletFactory = new MockAbstractedAccountFactory({
        algorand,
        defaultSender: sender,
        defaultSigner: signer,
      });
      const compiledMockWallet = await mockWalletFactory.appFactory.compile();

      // Pre-fund the wallet for the plugin execution
      const preFundMbr = await wallet.getMbr({
        escrow: '',
        methodCount: 0n,
        plugin: '',
        groups: 4n,
      });
      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(preFundMbr.plugins + preFundMbr.executions + 5_000_000n),
      });

      // Fund the factory for box storage
      await algorand.send.payment({
        sender,
        receiver: walletFactory!.client.appAddress,
        amount: microAlgo(2_000_000n),
        signer,
      });

      const shortTimestamp = Date.now() % 1_000_000;
      const uploadExecution = await wallet.build.usePlugin({
        sender,
        signer,
        lease: `wf_child_${shortTimestamp}`,
        windowSize: 2000n,
        global: true,
        calls: [
          daoUpdateSdk.updateFactoryChildContract({
            sender,
            signer,
            factoryAppId: walletFactory!.appId,
            version: '1.0.0-mock',
            data: compiledMockWallet.approvalProgram,
          }),
        ],
      });

      const uploadMbr = await wallet.getMbr({
        escrow: '',
        methodCount: 0n,
        plugin: '',
        groups: BigInt(uploadExecution.atcs.length),
      });
      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(uploadMbr.plugins + uploadMbr.executions + 2_000_000n),
      });

      const uploadAction: ProposalAction<SDKClient> = {
        type: ProposalActionEnum.UpgradeApp,
        app: walletFactory!.appId,
        executionKey: uploadExecution.lease,
        groups: uploadExecution.ids,
        firstValid: uploadExecution.firstValid,
        lastValid: uploadExecution.lastValid,
      };

      await proposeAndExecute(dao, [uploadAction]);
      await uploadExecution.atcs[0].submit(wallet.client.algorand.client.algod);

      // Step 2: Rekey DAO to factory address
      await dao.client.send.rekeyDao({
        args: { target: walletFactory!.client.appAddress.toString() },
        extraFee: microAlgo(1_000n),
      });

      // Step 3: Call factory.updateWalletForAdmin(wallet, dao.address) — this rekeys DAO back
      // Fund the factory for the inner transaction fees
      await algorand.send.payment({
        sender,
        receiver: walletFactory!.client.appAddress,
        amount: microAlgo(1_000_000n),
        signer,
      });

      await walletFactory!.client.send.updateWalletForAdmin({
        args: {
          wallet: wallet.client.appId,
          admin: dao.client.appClient.appAddress.toString(),
        },
        extraFee: microAlgo(1_000n),
      });

      // Verify wallet was updated - call mock's ping()
      const mockClient = new MockAbstractedAccountClient({
        algorand,
        appId: wallet.client.appId,
        defaultSender: sender,
        defaultSigner: signer,
      });

      const pingResult = await mockClient.send.ping({ args: {} });
      expect(pingResult.return).toBe(4243n);
    });
  });

});
