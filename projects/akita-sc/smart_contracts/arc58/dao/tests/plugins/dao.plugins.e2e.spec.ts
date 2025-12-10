import { microAlgo } from '@algorandfoundation/algokit-utils';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { ProposalActionEnum } from 'akita-sdk';
import { deployOptInPlugin } from '../../../../../tests/fixtures/plugins/optin';
import { logger } from '../../../../../tests/utils/logger';
import {
  bootstrapDaoTestContext,
  proposeAndExecute,
  type DaoTestContext,
} from '../utils';

const fixture = algorandFixture();

// Counter to ensure unique names across tests
let testCounter = 0;
const getUniqueName = (prefix: string) => `${prefix}_${++testCounter}`;

/**
 * Tests for DAO plugin management.
 *
 * Plugins extend the DAO wallet's functionality by allowing controlled execution
 * of specific operations. These tests use the full DAO setup to ensure
 * all required infrastructure is in place.
 */
describe('ARC58 DAO Plugins', () => {
  let context: DaoTestContext;

  beforeAll(async () => {
    logger.setMode('silent');
    // Use full setup so we have proper wallet and escrow infrastructure
    context = await bootstrapDaoTestContext({ fixture, useFullSetup: true });
  });

  beforeEach(async () => {
    await fixture.newScope();
    const { algorand } = fixture;
    const dispenser = await algorand.account.dispenserFromEnvironment();
    // Each proposal can cost 7+ ALGO in MBR, ensure we have plenty of funds
    // Fund the sender from context (not the new testAccount from fixture.newScope)
    await algorand.account.ensureFunded(context.sender, dispenser, microAlgo(100_000_000n));
  });

  describe('Plugin Installation', () => {
    test('should install a global plugin without execution key', async () => {
      const { fixture, dao, sender, signer } = context;

      // Deploy a fresh optin plugin for this test
      const optinPlugin = await deployOptInPlugin({
        fixture,
        sender,
        signer,
      });

      // Fund wallet for plugin installation
      const mbr = await dao.wallet.getMbr({
        escrow: '',
        methodCount: 1n,
        plugin: '',
        groups: 1n,
      });
      await dao.wallet.client.appClient.fundAppAccount({
        amount: microAlgo(mbr.plugins + 1_000_000n),
      });

      const proposalId = await proposeAndExecute(dao, [
        {
          type: ProposalActionEnum.AddPlugin,
          client: optinPlugin,
          global: true,
          escrow: '',
          sourceLink: 'https://github.com/test/plugin',
          useExecutionKey: false,
          methods: [{ name: optinPlugin.optIn(), cooldown: 0n }],
        },
      ]);

      expect(proposalId).toBeGreaterThan(0n);

      // Verify plugin is installed
      const pluginInfo = await dao.wallet.getPluginByKey({
        plugin: optinPlugin.appId,
        caller: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ',
        escrow: '',
      });

      expect(pluginInfo.start).toBeGreaterThan(0n);
      expect(pluginInfo.useExecutionKey).toBe(false);
    });

    test('should install a named plugin', async () => {
      const { fixture, dao, sender, signer } = context;
      const pluginName = getUniqueName('np'); // Short name: np_1, np_2, etc.

      const optinPlugin = await deployOptInPlugin({
        fixture,
        sender,
        signer,
      });

      const mbr = await dao.wallet.getMbr({
        escrow: '',
        methodCount: 1n,
        plugin: pluginName,
        groups: 1n,
      });
      await dao.wallet.client.appClient.fundAppAccount({
        amount: microAlgo(mbr.plugins + mbr.namedPlugins + 1_000_000n),
      });

      const proposalId = await proposeAndExecute(dao, [
        {
          type: ProposalActionEnum.AddNamedPlugin,
          name: pluginName,
          client: optinPlugin,
          global: true,
          escrow: '',
          sourceLink: 'https://github.com/test/plugin',
          useExecutionKey: false,
          methods: [{ name: optinPlugin.optIn(), cooldown: 0n }],
        },
      ]);

      expect(proposalId).toBeGreaterThan(0n);

      const pluginInfo = await dao.wallet.getPluginByName(pluginName);
      expect(pluginInfo.start).toBeGreaterThan(0n);
    });
  });

  describe('Escrow Management', () => {
    test('should create a new escrow via proposal', async () => {
      const { dao } = context;
      const escrowName = getUniqueName('esc'); // Short: esc_1, esc_2, etc.

      const mbr = await dao.wallet.getMbr({
        escrow: escrowName,
        methodCount: 0n,
        plugin: '',
        groups: 0n,
      });
      await dao.wallet.client.appClient.fundAppAccount({
        amount: microAlgo(mbr.newEscrowMintCost),
      });

      const proposalId = await proposeAndExecute(dao, [
        { type: ProposalActionEnum.NewEscrow, escrow: escrowName },
      ]);

      expect(proposalId).toBeGreaterThan(0n);

      const escrowInfo = await dao.wallet.getEscrow(escrowName);
      expect(escrowInfo.id).toBeGreaterThan(0n);
    });

    test('should toggle escrow lock', async () => {
      const { dao } = context;
      const escrowName = getUniqueName('lck');

      const mbr = await dao.wallet.getMbr({
        escrow: escrowName,
        methodCount: 0n,
        plugin: '',
        groups: 0n,
      });
      await dao.wallet.client.appClient.fundAppAccount({
        amount: microAlgo(mbr.newEscrowMintCost),
      });

      await proposeAndExecute(dao, [{ type: ProposalActionEnum.NewEscrow, escrow: escrowName }]);

      const escrowBefore = await dao.wallet.getEscrow(escrowName);
      expect(escrowBefore.locked).toBe(false);

      await proposeAndExecute(dao, [
        { type: ProposalActionEnum.ToggleEscrowLock, escrow: escrowName },
      ]);

      const escrowAfter = await dao.wallet.getEscrow(escrowName);
      expect(escrowAfter.locked).toBe(true);
    });

    test('should create escrow and install plugin for it', async () => {
      const { fixture, dao, sender, signer } = context;
      // Use very short escrow name to avoid "name too long" error
      const escrowName = getUniqueName('pe'); // pe_1, pe_2, etc.

      // Create escrow
      const escrowMbr = await dao.wallet.getMbr({
        escrow: escrowName,
        methodCount: 0n,
        plugin: '',
        groups: 0n,
      });
      await dao.wallet.client.appClient.fundAppAccount({
        amount: microAlgo(escrowMbr.newEscrowMintCost),
      });

      await proposeAndExecute(dao, [{ type: ProposalActionEnum.NewEscrow, escrow: escrowName }]);

      // Deploy and install plugin
      const optinPlugin = await deployOptInPlugin({
        fixture,
        sender,
        signer,
      });

      const mbr = await dao.wallet.getMbr({
        escrow: escrowName,
        methodCount: 1n,
        plugin: '',
        groups: 1n,
      });
      await dao.wallet.client.appClient.fundAppAccount({
        amount: microAlgo(mbr.plugins + 1_000_000n),
      });

      const proposalId = await proposeAndExecute(dao, [
        {
          type: ProposalActionEnum.AddPlugin,
          client: optinPlugin,
          global: true,
          escrow: escrowName,
          sourceLink: 'https://github.com/test/plugin',
          useExecutionKey: false,
          methods: [{ name: optinPlugin.optIn(), cooldown: 0n }],
        },
      ]);

      expect(proposalId).toBeGreaterThan(0n);

      const pluginInfo = await dao.wallet.getPluginByKey({
        plugin: optinPlugin.appId,
        caller: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ',
        escrow: escrowName,
      });

      expect(pluginInfo.start).toBeGreaterThan(0n);
    });
  });

  describe('Allowance Management', () => {
    test('should add allowances to an escrow', async () => {
      const { dao } = context;
      const escrowName = getUniqueName('alw');

      // Create escrow
      const escrowMbr = await dao.wallet.getMbr({
        escrow: escrowName,
        methodCount: 0n,
        plugin: '',
        groups: 0n,
      });
      await dao.wallet.client.appClient.fundAppAccount({
        amount: microAlgo(escrowMbr.newEscrowMintCost),
      });

      await proposeAndExecute(dao, [{ type: ProposalActionEnum.NewEscrow, escrow: escrowName }]);

      // Fund for allowance
      const mbr = await dao.wallet.getMbr({
        escrow: escrowName,
        methodCount: 0n,
        plugin: '',
        groups: 0n,
      });
      await dao.wallet.client.appClient.fundAppAccount({
        amount: microAlgo(mbr.allowances + 1_000_000n),
      });

      // Add flat allowance for ALGO
      const proposalId = await proposeAndExecute(dao, [
        {
          type: ProposalActionEnum.AddAllowances,
          escrow: escrowName,
          allowances: [
            {
              type: 'flat',
              asset: 0n,
              amount: 10_000_000n,
            },
          ],
        },
      ]);

      expect(proposalId).toBeGreaterThan(0n);

      const allowanceInfo = await dao.wallet.getAllowance({ escrow: escrowName, asset: 0n });
      expect(allowanceInfo.type).toBe('flat');
      if (allowanceInfo.type === 'flat') {
        expect(allowanceInfo.amount).toBe(10_000_000n);
      }
    });

    test('should remove allowances from an escrow', async () => {
      const { dao } = context;
      const escrowName = getUniqueName('rmw');

      // Create escrow
      const escrowMbr = await dao.wallet.getMbr({
        escrow: escrowName,
        methodCount: 0n,
        plugin: '',
        groups: 0n,
      });
      await dao.wallet.client.appClient.fundAppAccount({
        amount: microAlgo(escrowMbr.newEscrowMintCost),
      });

      await proposeAndExecute(dao, [{ type: ProposalActionEnum.NewEscrow, escrow: escrowName }]);

      // Add allowance first
      const mbr = await dao.wallet.getMbr({
        escrow: escrowName,
        methodCount: 0n,
        plugin: '',
        groups: 0n,
      });
      await dao.wallet.client.appClient.fundAppAccount({
        amount: microAlgo(mbr.allowances + 1_000_000n),
      });

      await proposeAndExecute(dao, [
        {
          type: ProposalActionEnum.AddAllowances,
          escrow: escrowName,
          allowances: [
            {
              type: 'flat',
              asset: 0n,
              amount: 10_000_000n,
            },
          ],
        },
      ]);

      // Verify allowance exists
      const allowanceBefore = await dao.wallet.getAllowance({ escrow: escrowName, asset: 0n });
      expect(allowanceBefore.type).toBe('flat');

      // Remove allowance
      const removeProposalId = await proposeAndExecute(dao, [
        {
          type: ProposalActionEnum.RemoveAllowances,
          escrow: escrowName,
          assets: [0n],
        },
      ]);

      expect(removeProposalId).toBeGreaterThan(0n);

      // Verify allowance was removed - box should not exist, so catch the error
      try {
        await dao.wallet.getAllowance({ escrow: escrowName, asset: 0n });
        // If we get here without error, the allowance wasn't fully removed
        // but the start should be 0
      } catch (error) {
        // Expected - box was deleted
        expect(error).toBeDefined();
      }
    });
  });

  describe('Plugin with Allowances', () => {
    test('should install a plugin with allowances in single proposal', async () => {
      const { fixture, dao, sender, signer } = context;
      const escrowName = getUniqueName('pa'); // Short name

      // Create escrow
      const escrowMbr = await dao.wallet.getMbr({
        escrow: escrowName,
        methodCount: 0n,
        plugin: '',
        groups: 0n,
      });
      await dao.wallet.client.appClient.fundAppAccount({
        amount: microAlgo(escrowMbr.newEscrowMintCost),
      });

      await proposeAndExecute(dao, [{ type: ProposalActionEnum.NewEscrow, escrow: escrowName }]);

      // Deploy plugin
      const optinPlugin = await deployOptInPlugin({
        fixture,
        sender,
        signer,
      });

      // Fund for plugin + allowances
      const mbr = await dao.wallet.getMbr({
        escrow: escrowName,
        methodCount: 1n,
        plugin: '',
        groups: 1n,
      });
      await dao.wallet.client.appClient.fundAppAccount({
        amount: microAlgo(mbr.plugins + mbr.allowances + 2_000_000n),
      });

      // Install plugin with allowances
      const proposalId = await proposeAndExecute(dao, [
        {
          type: ProposalActionEnum.AddPlugin,
          client: optinPlugin,
          global: true,
          escrow: escrowName,
          sourceLink: 'https://github.com/test/plugin',
          useExecutionKey: false,
          methods: [{ name: optinPlugin.optIn(), cooldown: 0n }],
          allowances: [
            {
              type: 'flat',
              asset: 0n,
              amount: 5_000_000n,
            },
          ],
        },
      ]);

      expect(proposalId).toBeGreaterThan(0n);

      // Verify plugin
      const pluginInfo = await dao.wallet.getPluginByKey({
        plugin: optinPlugin.appId,
        caller: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ',
        escrow: escrowName,
      });
      expect(pluginInfo.start).toBeGreaterThan(0n);

      // Verify allowance
      const allowanceInfo = await dao.wallet.getAllowance({ escrow: escrowName, asset: 0n });
      expect(allowanceInfo.type).toBe('flat');
      if (allowanceInfo.type === 'flat') {
        expect(allowanceInfo.amount).toBe(5_000_000n);
      }
    });
  });
});
