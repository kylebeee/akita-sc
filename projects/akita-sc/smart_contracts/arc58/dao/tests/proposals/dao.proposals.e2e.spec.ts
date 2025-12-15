import { microAlgo } from '@algorandfoundation/algokit-utils';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { ProposalActionEnum } from 'akita-sdk/dao';
import { logger } from '../../../../../tests/utils/logger';
import {
  bootstrapDaoTestContext,
  proposeAndExecute,
  type DaoTestContext,
} from '../utils';

const fixture = algorandFixture();

/**
 * Tests for the DAO proposal lifecycle.
 *
 * These tests use the full DAO setup (buildAkitaUniverse) because:
 * 1. Proposal creation requires the DAO to have proper app references
 * 2. The SDK simulates transactions which need valid app IDs
 * 3. Full setup ensures all dependencies are properly configured
 */
describe('ARC58 DAO Proposals', () => {
  let context: DaoTestContext;

  beforeAll(async () => {
    logger.setMode('silent');
    // Use full setup to ensure all app references are valid
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

  describe('Proposal Creation', () => {
    test('should create a proposal with UpdateFields action', async () => {
      const { dao } = context;
      const newActionLimit = 10;

      const proposalId = await proposeAndExecute(dao, [
        {
          type: ProposalActionEnum.UpdateFields,
          field: 'proposal_action_limit',
          value: newActionLimit,
        },
      ]);

      expect(proposalId).toBeGreaterThan(0n);

      // Verify the field was updated
      const globalState = await dao.getGlobalState();
      expect(globalState.proposalActionLimit).toBe(BigInt(newActionLimit));
    });

    test('should calculate proposal cost correctly', async () => {
      const { dao } = context;

      const actions = [
        {
          type: ProposalActionEnum.UpdateFields as const,
          field: 'proposal_action_limit' as const,
          value: 5,
        },
      ];

      const costInfo = await dao.proposalCost({ actions });

      expect(costInfo.total).toBeGreaterThan(0n);
      expect(costInfo.mbr).toBeGreaterThan(0n);
      expect(costInfo.duration).toBeGreaterThan(0n);
      expect(costInfo.participation).toBeGreaterThan(0n);
      expect(costInfo.approval).toBeGreaterThan(0n);
    });

    test('should increment proposal IDs sequentially', async () => {
      const { dao } = context;

      // Create first proposal
      const proposalId1 = await proposeAndExecute(dao, [
        {
          type: ProposalActionEnum.UpdateFields,
          field: 'min_rewards_impact',
          value: 100,
        },
      ]);

      // Create second proposal
      const proposalId2 = await proposeAndExecute(dao, [
        {
          type: ProposalActionEnum.UpdateFields,
          field: 'min_rewards_impact',
          value: 200,
        },
      ]);

      expect(proposalId2).toBe(proposalId1 + 1n);
    });
  });

  describe('Proposal Retrieval', () => {
    test('should retrieve proposal details by ID', async () => {
      const { dao } = context;

      const proposalId = await proposeAndExecute(dao, [
        {
          type: ProposalActionEnum.UpdateFields,
          field: 'min_rewards_impact',
          value: 150,
        },
      ]);

      const proposal = await dao.getProposal(proposalId);

      expect(proposal).toBeDefined();
      expect(proposal.status).toBe(50); // ProposalStatusExecuted
      expect(proposal.actions).toHaveLength(1);
      expect(proposal.actions[0].type).toBe(ProposalActionEnum.UpdateFields);
      expect(proposal.created).toBeGreaterThan(0n);
    });

    test('should return empty proposal for non-existent ID', async () => {
      const { dao } = context;

      const proposal = await dao.getProposal(999999n);

      expect(proposal.status).toBe(0);
      expect(proposal.created).toBe(0n);
      expect(proposal.actions).toHaveLength(0);
    });
  });

  describe('UpdateFields Proposals', () => {
    test('should update proposal action limit', async () => {
      const { dao } = context;
      const newLimit = 8;

      await proposeAndExecute(dao, [
        {
          type: ProposalActionEnum.UpdateFields,
          field: 'proposal_action_limit',
          value: newLimit,
        },
      ]);

      const state = await dao.getGlobalState();
      expect(state.proposalActionLimit).toBe(BigInt(newLimit));
    });

    test('should update min rewards impact', async () => {
      const { dao } = context;
      const newImpact = 500;

      await proposeAndExecute(dao, [
        {
          type: ProposalActionEnum.UpdateFields,
          field: 'min_rewards_impact',
          value: newImpact,
        },
      ]);

      const state = await dao.getGlobalState();
      expect(state.minRewardsImpact).toBe(BigInt(newImpact));
    });

    test('should update social fees', async () => {
      const { dao } = context;
      const newPostFee = 50_000n;
      const newReactFee = 10_000n;

      await proposeAndExecute(dao, [
        {
          type: ProposalActionEnum.UpdateFields,
          field: 'social_fees',
          value: {
            postFee: newPostFee,
            reactFee: newReactFee,
          },
        },
      ]);

      const state = await dao.getGlobalState();
      expect(state.socialFees.postFee).toBe(newPostFee);
      expect(state.socialFees.reactFee).toBe(newReactFee);
    });

    test('should update staking fees', async () => {
      const { dao } = context;
      const newCreationFee = 2_000_000n;

      await proposeAndExecute(dao, [
        {
          type: ProposalActionEnum.UpdateFields,
          field: 'staking_fees',
          value: {
            creationFee: newCreationFee,
          },
        },
      ]);

      const state = await dao.getGlobalState();
      expect(state.stakingFees.creationFee).toBe(newCreationFee);
    });

    test('should update subscription fees', async () => {
      const { dao } = context;
      const newServiceFee = 5_000_000n;
      const newPaymentPercentage = 500n;

      await proposeAndExecute(dao, [
        {
          type: ProposalActionEnum.UpdateFields,
          field: 'subscription_fees',
          value: {
            serviceCreationFee: newServiceFee,
            paymentPercentage: newPaymentPercentage,
          },
        },
      ]);

      const state = await dao.getGlobalState();
      expect(state.subscriptionFees.serviceCreationFee).toBe(newServiceFee);
      expect(state.subscriptionFees.paymentPercentage).toBe(newPaymentPercentage);
    });

    test('should update swap fees', async () => {
      const { dao } = context;
      const newImpactTaxMin = 50n;
      const newImpactTaxMax = 500n;

      await proposeAndExecute(dao, [
        {
          type: ProposalActionEnum.UpdateFields,
          field: 'swap_fees',
          value: {
            impactTaxMin: newImpactTaxMin,
            impactTaxMax: newImpactTaxMax,
          },
        },
      ]);

      const state = await dao.getGlobalState();
      expect(state.swapFees.impactTaxMin).toBe(newImpactTaxMin);
      expect(state.swapFees.impactTaxMax).toBe(newImpactTaxMax);
    });
  });

  describe('Escrow Management via Proposals', () => {
    test('should create a new escrow', async () => {
      const { dao } = context;
      // Use short name to avoid "name too long" error (max 64 chars with prefix)
      const escrowName = `esc_${Date.now() % 100000}`;

      // Fund wallet for escrow creation
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
      const escrowName = `lock_${Date.now() % 100000}`;

      // Create escrow first
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

      // Verify unlocked
      const escrowBefore = await dao.wallet.getEscrow(escrowName);
      expect(escrowBefore.locked).toBe(false);

      // Toggle lock
      await proposeAndExecute(dao, [
        { type: ProposalActionEnum.ToggleEscrowLock, escrow: escrowName },
      ]);

      // Verify locked
      const escrowAfter = await dao.wallet.getEscrow(escrowName);
      expect(escrowAfter.locked).toBe(true);
    });
  });

  describe('Proposal Statuses', () => {
    test('should track proposal status as Executed after execution', async () => {
      const { dao } = context;

      const proposalId = await proposeAndExecute(dao, [
        {
          type: ProposalActionEnum.UpdateFields,
          field: 'min_rewards_impact',
          value: 300,
        },
      ]);

      const proposal = await dao.getProposal(proposalId);
      expect(proposal.status).toBe(50); // ProposalStatusExecuted = 50
    });
  });
});
