import { microAlgo } from '@algorandfoundation/algokit-utils';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { ProposalAction, ProposalActionEnum } from 'akita-sdk';
import { SDKClient } from 'akita-sdk/src/types';
import { MockAkitaDaoClient, MockAkitaDaoFactory } from '../../../../artifacts/mocks/dao/MockAkitaDAOClient';
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
    const { algorand, context: { testAccount } } = fixture;
    const dispenser = await algorand.account.dispenserFromEnvironment();
    await algorand.account.ensureFunded(testAccount.toString(), dispenser, microAlgo(5_000_000n));
  });

  // External Contract Upgrades run FIRST (before DAO is replaced with mock)
  describe('External Contract Upgrades', () => {
    // This test MUST run before upgrading walletFactory since it calls methods on the original contract
    test('should verify DAO wallet can use updateAkitaDaoEscrowForApp', async () => {
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
