import { algo, microAlgo } from '@algorandfoundation/algokit-utils';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { ProposalActionEnum } from 'akita-sdk/dao';
import { AkitaDaoDeployableSDK } from 'akita-sdk/dao-deployable';
import { StakingPoolFactorySDK } from 'akita-sdk/staking-pool';
import { SubscriptionsSDK } from 'akita-sdk/subscriptions';
import { RevenueManagerPluginSDK, UpdateAkitaDAOPluginSDK, WalletFactorySDK } from 'akita-sdk/wallet';
import type { TransactionSigner } from 'algosdk';
import { deployAbstractedAccountFactory } from '../../../../../tests/fixtures/abstracted-account';
import { AkitaDAOGlobalStateKeysRevenueSplits, deployAkitaDAO } from '../../../../../tests/fixtures/dao';
import { deployEscrowFactory } from '../../../../../tests/fixtures/escrow';
import { deployRevenueManagerPlugin } from '../../../../../tests/fixtures/plugins/revenue-manager';
import { deployUpdateAkitaDaoPlugin } from '../../../../../tests/fixtures/plugins/update-akita-dao';
import { deployStakingPoolFactory } from '../../../../../tests/fixtures/staking-pool';
import { deploySubscriptions } from '../../../../../tests/fixtures/subscriptions';
import { logger } from '../../../../../tests/utils/logger';
import { EscrowFactoryClient } from '../../../../artifacts/escrow/EscrowFactoryClient';
import {
  DEFAULT_CREATION,
  DEFAULT_UPDATE_AKITA_DAO_APP_APPROVAL,
  DEFAULT_UPDATE_AKITA_DAO_DURATION,
  DEFAULT_UPDATE_AKITA_DAO_PARTICIPATION,
  DEFAULT_UPDATE_AKITA_DAO_PROPOSAL_CREATION,
  DEFAULT_UPDATE_AKITA_DAO_PROPOSAL_POWER,
  DEFAULT_UPGRADE_APP_APPROVAL,
  DEFAULT_UPGRADE_APP_PARTICIPATION,
  DEFAULT_UPGRADE_APP_PROPOSAL_POWER,
  DEFAULT_UPGRADE_APP_VOTING_DURATION,
} from '../../../../utils/defaults';
import { bootstrapDaoTestContext, proposeAndExecute } from '../utils';

const fixture = algorandFixture();

describe('ARC58 DAO Setup', () => {
  // Shared state across all tests
  let sender: string;
  let signer: TransactionSigner;

  // Phase 1: Core Contracts
  let escrowFactory: EscrowFactoryClient;
  let dao: AkitaDaoDeployableSDK;
  let walletFactory: WalletFactorySDK;
  let subscriptions: SubscriptionsSDK;
  let stakingPoolFactory: StakingPoolFactorySDK;

  // Phase 3: Plugins
  let revenueManagerPlugin: RevenueManagerPluginSDK;
  let updatePlugin: UpdateAkitaDAOPluginSDK;

  beforeAll(async () => {
    // Silence fixture logs for this test - we verify via assertions, not build logs
    logger.setMode('silent');
    const context = await bootstrapDaoTestContext({ fixture, configure: true, fundAmount: 500 });
    sender = context.sender;
    signer = context.signer;
  });

  afterAll(() => {
    logger.setMode('full');
  });

  describe('Phase 1: Deploy Core Contracts', () => {
    test('should deploy EscrowFactory', async () => {
      escrowFactory = await deployEscrowFactory({
        fixture,
        sender,
        signer,
      });

      expect(escrowFactory.appId).toBeGreaterThan(0n);
      expect(escrowFactory.appAddress).toBeDefined();
    });

    test('should deploy AkitaDAO', async () => {
      dao = await deployAkitaDAO({
        fixture,
        sender,
        signer,
        apps: { escrow: escrowFactory.appId },
      });

      expect(dao.appId).toBeGreaterThan(0n);
      expect(dao.client.appAddress).toBeDefined();
    });

    test('should fund DAO reader account', async () => {
      const { algorand } = fixture.context;
      const dispenser = await algorand.account.dispenserFromEnvironment();
      await algorand.account.ensureFunded(dao.readerAccount, dispenser, algo(1));

      const info = await algorand.account.getInformation(dao.readerAccount);
      expect(info.balance.microAlgo).toBeGreaterThanOrEqual(1_000_000n);
    });

    test('should deploy AbstractedAccountFactory (WalletFactory)', async () => {
      walletFactory = await deployAbstractedAccountFactory({
        fixture,
        sender,
        signer,
        args: {
          akitaDao: dao.appId,
          version: '0.0.1',
          escrowFactory: escrowFactory.appId,
        },
      });

      expect(walletFactory.appId).toBeGreaterThan(0n);
      expect(walletFactory.client.appAddress).toBeDefined();
    });

    test('should deploy Subscriptions', async () => {
      subscriptions = await deploySubscriptions({
        fixture,
        sender,
        signer,
        args: {
          akitaDao: dao.appId,
          version: '0.0.1',
          akitaDaoEscrow: 0n,
        },
      });

      expect(subscriptions.appId).toBeGreaterThan(0n);
    });

    test('should deploy StakingPoolFactory', async () => {
      stakingPoolFactory = await deployStakingPoolFactory({
        fixture,
        sender,
        signer,
        args: {
          akitaDao: dao.appId,
          akitaDaoEscrow: 0n,
        },
      });

      expect(stakingPoolFactory.appId).toBeGreaterThan(0n);
    });
  });

  describe('Phase 2: Configure DAO', () => {
    test('should update DAO fields to set wallet factory', async () => {
      const proposalId = await proposeAndExecute(dao, [
        {
          type: ProposalActionEnum.UpdateFields,
          field: 'aal',
          value: { wallet: walletFactory.appId },
        },
      ]);

      expect(proposalId).toBeGreaterThan(0n);
    });

    test('should fund DAO for wallet setup', async () => {
      const setupCost = await dao.setupCost();
      await dao.client.appClient.fundAppAccount({ amount: setupCost.microAlgo() });

      const info = await fixture.algorand.account.getInformation(dao.client.appAddress);
      expect(info.balance.microAlgo).toBeGreaterThanOrEqual(setupCost);
    });

    test('should setup DAO wallet (create ARC58 wallet)', async () => {
      await dao.setup();

      expect(dao.wallet.client.appId).toBeGreaterThan(0n);
      expect(dao.wallet.client.appAddress).toBeDefined();
    });
  });

  describe('Phase 3: Deploy & Install Plugins', () => {
    test('should deploy RevenueManagerPlugin', async () => {
      revenueManagerPlugin = await deployRevenueManagerPlugin({
        fixture,
        sender,
        signer,
        args: {
          akitaDao: dao.appId,
          version: '0.0.1',
        }
      });

      expect(revenueManagerPlugin.appId).toBeGreaterThan(0n);

      // Fund the plugin with enough for box storage
      const dispenser = await fixture.algorand.account.dispenserFromEnvironment();
      await fixture.algorand.account.ensureFunded(
        revenueManagerPlugin.client.appAddress,
        dispenser,
        algo(2)
      );
    });

    test('should deploy UpdateAkitaDAOPlugin', async () => {
      updatePlugin = await deployUpdateAkitaDaoPlugin({
        fixture,
        sender,
        signer,
        args: {
          akitaDao: dao.appId,
        },
      });

      expect(updatePlugin.appId).toBeGreaterThan(0n);
    });

    test('should fund wallet for plugin installations', async () => {
      // Fund wallet with enough for multiple plugin installations
      const mbr = await dao.wallet.getMbr({
        escrow: '',
        methodCount: 0n,
        plugin: '',
        groups: 4n, // Enough for multiple plugin installs
      });

      const paymentAmount = 2_000_000n;
      const fundAmount = mbr.plugins + mbr.executions + paymentAmount;

      await dao.wallet.client.appClient.fundAppAccount({
        amount: microAlgo(fundAmount),
      });
    });

    test('should install RevenueManagerPlugin globally', async () => {
      const proposalId = await proposeAndExecute(dao, [
        {
          type: ProposalActionEnum.AddPlugin,
          client: revenueManagerPlugin,
          global: true,
          escrow: '',
          sourceLink: 'https://github.com/kylebee/akita-sc',
          useExecutionKey: true,
          fee: DEFAULT_CREATION,
          power: DEFAULT_UPGRADE_APP_PROPOSAL_POWER,
          duration: DEFAULT_UPGRADE_APP_VOTING_DURATION,
          participation: DEFAULT_UPGRADE_APP_PARTICIPATION,
          approval: DEFAULT_UPGRADE_APP_APPROVAL,
        },
      ]);

      expect(proposalId).toBeGreaterThan(0n);
    });

    test('should install UpdateAkitaDAOPlugin globally', async () => {
      const proposalId = await proposeAndExecute(dao, [
        {
          type: ProposalActionEnum.AddPlugin,
          fee: DEFAULT_UPDATE_AKITA_DAO_PROPOSAL_CREATION,
          power: DEFAULT_UPDATE_AKITA_DAO_PROPOSAL_POWER,
          duration: DEFAULT_UPDATE_AKITA_DAO_DURATION,
          participation: DEFAULT_UPDATE_AKITA_DAO_PARTICIPATION,
          approval: DEFAULT_UPDATE_AKITA_DAO_APP_APPROVAL,
          sourceLink: 'https://github.com/kylebee/akita-sc',
          client: updatePlugin,
          global: true,
          useExecutionKey: true,
        },
      ]);

      expect(proposalId).toBeGreaterThan(0n);
    });

    test('should update wallet factory escrow using UpdateAkitaDAOPlugin', async () => {
      const walletFactoryRevenueEscrow = 'rev_wallet';

      // Create the escrow first
      await proposeAndExecute(dao, [
        { type: ProposalActionEnum.NewEscrow, escrow: walletFactoryRevenueEscrow },
      ]);

      // Get the escrow info
      const revWallet = await dao.wallet.getEscrow(walletFactoryRevenueEscrow);

      // Build the plugin execution
      const execution = await dao.wallet.build.usePlugin({
        sender,
        signer,
        lease: 'update_escrow_app',
        windowSize: 2000n,
        global: true,
        calls: [
          updatePlugin.updateAkitaDaoEscrowForApp({
            appId: walletFactory.appId,
            newEscrow: revWallet.id,
          }),
        ],
      });

      // Propose and execute
      const proposalId = await proposeAndExecute(dao, [
        {
          type: ProposalActionEnum.ExecutePlugin,
          plugin: updatePlugin.appId,
          caller: sender,
          escrow: '',
          executionKey: execution.lease,
          groups: execution.ids,
          firstValid: execution.firstValid,
          lastValid: execution.lastValid,
        },
      ]);

      await execution.atcs[0].submit(dao.wallet.client.algorand.client.algod);

      expect(proposalId).toBeGreaterThan(0n);
    });
  });

  describe('Phase 4: Setup Revenue Escrows', () => {
    const escrowNames = ['rev_subscriptions', 'rev_pool'];

    test('should fund wallet for escrow creation', async () => {
      const mbrResults = await Promise.all(
        escrowNames.map((escrow) =>
          dao.wallet.getMbr({ escrow, methodCount: 0n, plugin: '', groups: 0n })
        )
      );

      let totalMbr = 0n;
      for (const result of mbrResults) {
        totalMbr += result.newEscrowMintCost;
      }

      await dao.wallet.client.appClient.fundAppAccount({
        amount: microAlgo(totalMbr),
      });
    });

    test.each(escrowNames)('should create and configure revenue escrow: %s', async (escrowName) => {
      // Create the escrow
      await proposeAndExecute(dao, [
        { type: ProposalActionEnum.NewEscrow, escrow: escrowName },
      ]);

      // Configure the escrow with revenue manager plugin
      const newReceiveEscrowPluginBuild = await dao.wallet.build.usePlugin({
        lease: `new_${escrowName}_lease`,
        global: true,
        windowSize: 2000n,
        calls: [
          revenueManagerPlugin.newReceiveEscrowWithRef({
            escrow: escrowName,
            source: walletFactory.client.appAddress.toString(),
            allocatable: true,
            optinAllowed: true,
            splitRef: {
              app: dao.appId,
              key: new Uint8Array(Buffer.from(AkitaDAOGlobalStateKeysRevenueSplits)),
            },
          }),
        ],
      });

      await proposeAndExecute(dao, [
        {
          type: ProposalActionEnum.ExecutePlugin,
          plugin: revenueManagerPlugin.appId,
          caller: sender,
          escrow: '',
          executionKey: newReceiveEscrowPluginBuild.lease,
          groups: newReceiveEscrowPluginBuild.ids,
          firstValid: newReceiveEscrowPluginBuild.firstValid,
          lastValid: newReceiveEscrowPluginBuild.lastValid,
        },
        {
          type: ProposalActionEnum.AddPlugin,
          client: revenueManagerPlugin,
          global: true,
          escrow: escrowName,
          sourceLink: 'https://github.com/kylebee/akita-sc',
          useExecutionKey: false,
          methods: [
            { name: revenueManagerPlugin.optIn(), cooldown: 0n },
            { name: revenueManagerPlugin.startEscrowDisbursement(), cooldown: 0n },
            { name: revenueManagerPlugin.processEscrowAllocation(), cooldown: 0n },
          ],
        },
        { type: ProposalActionEnum.ToggleEscrowLock, escrow: escrowName },
      ]);

      await newReceiveEscrowPluginBuild.atcs[0].submit(dao.wallet.client.algorand.client.algod);
    });
  });

  describe('Phase 5: Finalize & Verify', () => {
    test('should verify DAO has an ARC58 wallet', async () => {
      expect(dao.wallet.client).toBeDefined();
      expect(dao.wallet.client.appId).toBeGreaterThan(0n);
    });

    test('should verify wallet factory is configured', async () => {
      expect(walletFactory.appId).toBeGreaterThan(0n);
    });

    test('should verify plugins are installed', async () => {
      expect(revenueManagerPlugin.appId).toBeGreaterThan(0n);
      expect(updatePlugin.appId).toBeGreaterThan(0n);
    });

    test('should initialize DAO', async () => {
      await dao.initialize();
    });
  });
});
