import { algo, microAlgo } from '@algorandfoundation/algokit-utils';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { AkitaDaoSDK, EMPTY_CID, ProposalActionEnum, WalletFactorySDK } from 'akita-sdk';
import type { TransactionSigner } from 'algosdk';
import { deployAbstractedAccountFactory } from '../../../../../tests/fixtures/abstracted-account';
import { deployAkitaDAO } from '../../../../../tests/fixtures/dao';
import { deployEscrowFactory } from '../../../../../tests/fixtures/escrow';
import { deployStaking } from '../../../../../tests/fixtures/staking';
import { logger } from '../../../../../tests/utils/logger';
import { EscrowFactoryClient } from '../../../../artifacts/escrow/EscrowFactoryClient';
import { StakingClient } from '../../../../artifacts/staking/StakingClient';
import { proposeAndExecute } from '../utils';

const fixture = algorandFixture();

// Vote types match the contract constants
const VOTE_APPROVE = 10;
const VOTE_REJECT = 20;
const VOTE_ABSTAIN = 30;

// Staking type LOCK = 40 (required for voting power)
const STAKING_TYPE_LOCK = 40;

// One year in seconds (max lock time)
const ONE_YEAR = 31_536_000;

// MBR costs from staking constants
const STAKES_MBR = 28_900n;
const TOTALS_MBR = 12_500n;
const ASSET_OPT_IN_MBR = 100_000n;

/**
 * Tests for DAO voting functionality after initialization.
 *
 * The DAO voting lifecycle:
 * 1. Create proposal (Draft status) - requires staking power when initialized
 * 2. Submit proposal (Voting status) - starts the voting period
 * 3. Vote on proposal - users cast approve/reject/abstain votes
 * 4. Finalize proposal - after duration, checks thresholds → Approved/Rejected
 * 5. Execute proposal - if Approved, executes the actions
 *
 * Requirements for voting:
 * - DAO must be initialized
 * - Users must have Bones ASA staked with LOCK type
 * - Lock expiration must be > 1 week in the future
 * - Voting power = stake amount * (remaining days / 365)
 */
describe('ARC58 DAO Voting', () => {
    // Core contracts
    let sender: string;
    let signer: TransactionSigner;
    let escrowFactory: EscrowFactoryClient;
    let dao: AkitaDaoSDK;
    let walletFactory: WalletFactorySDK;
    let staking: StakingClient;

    // Governance token (Bones)
    let bonesAssetId: bigint;

    // Additional voter accounts
    let voter1: string;
    let voter1Signer: TransactionSigner;
    let voter2: string;
    let voter2Signer: TransactionSigner;

    beforeAll(async () => {
        logger.setMode('silent');

        await fixture.newScope();
        const {
            algorand,
            context: { testAccount },
        } = fixture;
        sender = testAccount.toString();
        signer = testAccount.signer;

        const dispenser = await algorand.account.dispenserFromEnvironment();
        await algorand.account.ensureFunded(sender, dispenser, algo(500));

        // Create additional voter accounts
        const voter1Account = await algorand.account.random();
        voter1 = voter1Account.addr.toString();
        voter1Signer = voter1Account.signer;
        await algorand.account.ensureFunded(voter1, dispenser, algo(100));

        const voter2Account = await algorand.account.random();
        voter2 = voter2Account.addr.toString();
        voter2Signer = voter2Account.signer;
        await algorand.account.ensureFunded(voter2, dispenser, algo(100));

        // Deploy escrow factory
        escrowFactory = await deployEscrowFactory({ fixture, sender, signer });

        // Deploy DAO
        dao = await deployAkitaDAO({
            fixture,
            sender,
            signer,
            apps: { escrow: escrowFactory.appId },
        });

        // Fund DAO reader account
        await algorand.account.ensureFunded(dao.readerAccount, dispenser, algo(1));

        // Deploy staking contract
        staking = await deployStaking({
            fixture,
            sender,
            signer,
            args: { akitaDao: dao.appId },
        });

        // Create Bones governance token
        const bonesResult = await algorand.send.assetCreate({
            sender,
            signer,
            total: 1_000_000_000_000n, // 1 trillion with 6 decimals
            decimals: 6,
            assetName: 'Bones',
            unitName: 'BONES',
            defaultFrozen: false,
        });
        bonesAssetId = BigInt(bonesResult.confirmation.assetIndex!);

        // Fund staking contract to cover inner transaction fees
        await algorand.account.ensureFunded(staking.appAddress, dispenser, algo(1));

        // Opt staking contract into Bones and initialize totals box
        const optInPayment = await algorand.createTransaction.payment({
            sender,
            signer,
            receiver: staking.appAddress.toString(),
            amount: microAlgo(TOTALS_MBR + ASSET_OPT_IN_MBR),
        });

        await staking.send.optIn({
            sender,
            signer,
            args: {
                payment: optInPayment,
                asset: bonesAssetId,
            },
            extraFee: microAlgo(1000), // Extra fee to cover inner transaction via fee pooling
        });

        // Deploy wallet factory
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

        // Configure DAO with wallet factory and staking
        await proposeAndExecute(dao, [
            {
                type: ProposalActionEnum.UpdateFields,
                field: 'aal',
                value: {
                    wallet: walletFactory.appId,
                    staking: staking.appId,
                },
            },
        ]);

        // Configure DAO with Bones asset
        await proposeAndExecute(dao, [
            {
                type: ProposalActionEnum.UpdateFields,
                field: 'akita_assets',
                value: {
                    bones: bonesAssetId,
                },
            },
        ]);

        // Fund DAO and setup wallet
        const setupCost = await dao.setupCost();
        await dao.client.appClient.fundAppAccount({ amount: setupCost.microAlgo() });
        await dao.setup();

        // Voters opt into Bones
        await algorand.send.assetOptIn({
            sender: voter1,
            signer: voter1Signer,
            assetId: bonesAssetId,
        });

        await algorand.send.assetOptIn({
            sender: voter2,
            signer: voter2Signer,
            assetId: bonesAssetId,
        });

        // Distribute Bones to voters
        await algorand.send.assetTransfer({
            sender,
            signer,
            assetId: bonesAssetId,
            receiver: voter1,
            amount: 100_000_000_000n, // 100,000 BONES
        });

        await algorand.send.assetTransfer({
            sender,
            signer,
            assetId: bonesAssetId,
            receiver: voter2,
            amount: 100_000_000_000n, // 100,000 BONES
        });
    });

    afterAll(() => {
        logger.setMode('full');
    });

    describe('Pre-Initialization (Creator Only)', () => {
        test('should allow creator to create and execute proposals without voting', async () => {
            // Before initialization, only creator can create proposals
            // and they are immediately approved (no voting required)
            const proposalId = await proposeAndExecute(dao, [
                {
                    type: ProposalActionEnum.UpdateFields,
                    field: 'min_rewards_impact',
                    value: 100,
                },
            ]);

            expect(proposalId).toBeGreaterThan(0n);

            const proposal = await dao.getProposal(proposalId);
            expect(proposal.status).toBe(50); // Executed
        });
    });

    describe('DAO Initialization', () => {
        test('should initialize the DAO', async () => {
            // Initialize the DAO - after this, proposals require voting
            await dao.initialize();

            const { state } = await dao.getGlobalState();
            expect(state).toBe(2);
        });
    });

    describe('Post-Initialization Voting', () => {
        test('should setup voting power for voters by staking Bones', async () => {
            const { algorand } = fixture.context;

            // Stake Bones with LOCK type for voter1 (1 year lock)
            const stakeAmount = 50_000_000_000n; // 50,000 BONES
            // Use blockchain timestamp instead of Date.now() since localnet timestamp differs from wall-clock time
            const status = await algorand.client.algod.status().do();
            const block = await algorand.client.algod.block(status.lastRound).do();
            const blockTimestamp = BigInt(block.block.header.timestamp);
            const expiration = blockTimestamp + BigInt(ONE_YEAR);

            // Create MBR payment for stake box
            const stakePayment = await algorand.createTransaction.payment({
                sender: voter1,
                signer: voter1Signer,
                receiver: staking.appAddress.toString(),
                amount: microAlgo(STAKES_MBR),
            });

            // Create asset transfer for the stake
            const assetXfer = await algorand.createTransaction.assetTransfer({
                sender: voter1,
                signer: voter1Signer,
                assetId: bonesAssetId,
                receiver: staking.appAddress.toString(),
                amount: stakeAmount,
            });

            await staking.send.stakeAsa({
                sender: voter1,
                signer: voter1Signer,
                args: {
                    payment: stakePayment,
                    assetXfer,
                    type: STAKING_TYPE_LOCK,
                    amount: stakeAmount,
                    expiration,
                },
            });

            // Verify stake was created
            const stakeInfo = await staking.getInfo({
                args: {
                    address: voter1,
                    stake: { asset: bonesAssetId, type: STAKING_TYPE_LOCK },
                },
            });

            expect(stakeInfo?.amount).toBe(stakeAmount);
        });

        test('should create a proposal as initialized DAO member', async () => {
            // Now that DAO is initialized, creating proposals requires staking power
            const { algorand } = fixture.context;

            // Stake for the sender to have voting power
            const stakeAmount = 10_000_000_000n; // 10,000 BONES
            // Use blockchain timestamp instead of Date.now() since localnet timestamp differs from wall-clock time
            const status = await algorand.client.algod.status().do();
            const block = await algorand.client.algod.block(status.lastRound).do();
            const blockTimestamp = BigInt(block.block.header.timestamp);
            const expiration = blockTimestamp + BigInt(ONE_YEAR);

            // Sender needs to opt into Bones first
            try {
                await algorand.send.assetOptIn({
                    sender,
                    signer,
                    assetId: bonesAssetId,
                });
            } catch {
                // Already opted in
            }

            // Transfer some Bones to sender
            // Note: sender is the creator, they already have Bones from creation

            const stakePayment = await algorand.createTransaction.payment({
                sender,
                signer,
                receiver: staking.appAddress.toString(),
                amount: microAlgo(STAKES_MBR),
            });

            const assetXfer = await algorand.createTransaction.assetTransfer({
                sender,
                signer,
                assetId: bonesAssetId,
                receiver: staking.appAddress.toString(),
                amount: stakeAmount,
            });

            await staking.send.stakeAsa({
                sender,
                signer,
                args: {
                    payment: stakePayment,
                    assetXfer,
                    type: STAKING_TYPE_LOCK,
                    amount: stakeAmount,
                    expiration,
                },
            });

            // Now create a proposal
            const costInfo = await dao.proposalCost({
                actions: [
                    {
                        type: ProposalActionEnum.UpdateFields,
                        field: 'min_rewards_impact',
                        value: 200,
                    },
                ],
            });

            await dao.client.appClient.fundAppAccount({ amount: costInfo.total.microAlgo() });

            const { return: proposalId } = await dao.newProposal({
                cid: EMPTY_CID,
                actions: [
                    {
                        type: ProposalActionEnum.UpdateFields,
                        field: 'min_rewards_impact',
                        value: 200,
                    },
                ],
            });

            expect(proposalId).toBeGreaterThan(0n);

            // Proposal should be in Draft status
            const proposal = await dao.getProposal(proposalId!);
            expect(proposal.status).toBe(0); // Draft
        });

        test('should submit proposal to voting', async () => {
            // Create a new proposal
            const costInfo = await dao.proposalCost({
                actions: [
                    {
                        type: ProposalActionEnum.UpdateFields,
                        field: 'min_rewards_impact',
                        value: 300,
                    },
                ],
            });

            await dao.client.appClient.fundAppAccount({ amount: costInfo.total.microAlgo() });

            const { return: proposalId } = await dao.newProposal({
                cid: EMPTY_CID,
                actions: [
                    {
                        type: ProposalActionEnum.UpdateFields,
                        field: 'min_rewards_impact',
                        value: 300,
                    },
                ],
            });

            expect(proposalId).toBeDefined();

            // Submit to voting
            await dao.submitProposal({ proposalId: proposalId! });

            // Verify status changed to Voting
            const proposal = await dao.getProposal(proposalId!);
            expect(proposal.status).toBe(20); // Voting
            expect(proposal.votingTs).toBeGreaterThan(0n);
        });

        test('should cast votes on a proposal', async () => {
            // Create and submit a proposal
            const costInfo = await dao.proposalCost({
                actions: [
                    {
                        type: ProposalActionEnum.UpdateFields,
                        field: 'min_rewards_impact',
                        value: 400,
                    },
                ],
            });

            await dao.client.appClient.fundAppAccount({ amount: costInfo.total.microAlgo() });

            const { return: proposalId } = await dao.newProposal({
                cid: EMPTY_CID,
                actions: [
                    {
                        type: ProposalActionEnum.UpdateFields,
                        field: 'min_rewards_impact',
                        value: 400,
                    },
                ],
            });

            await dao.submitProposal({ proposalId: proposalId! });

            // Vote approve as voter1 (who has staked)
            await dao.voteProposal({
                sender: voter1,
                signer: voter1Signer,
                proposalId: proposalId!,
                vote: VOTE_APPROVE,
            } as Parameters<typeof dao.voteProposal>[0]);

            // Check vote was recorded
            const proposalAfterVote = await dao.getProposal(proposalId!);
            expect(proposalAfterVote.votes.approvals).toBeGreaterThan(0n);
        });

        test('should allow changing vote', async () => {
            // Create and submit proposal
            const costInfo = await dao.proposalCost({
                actions: [
                    {
                        type: ProposalActionEnum.UpdateFields,
                        field: 'min_rewards_impact',
                        value: 450,
                    },
                ],
            });

            await dao.client.appClient.fundAppAccount({ amount: costInfo.total.microAlgo() });

            const { return: proposalId } = await dao.newProposal({
                cid: EMPTY_CID,
                actions: [
                    {
                        type: ProposalActionEnum.UpdateFields,
                        field: 'min_rewards_impact',
                        value: 450,
                    },
                ],
            });

            await dao.submitProposal({ proposalId: proposalId! });

            // First vote approve
            await dao.voteProposal({
                sender: voter1,
                signer: voter1Signer,
                proposalId: proposalId!,
                vote: VOTE_APPROVE,
            } as Parameters<typeof dao.voteProposal>[0]);

            const proposalAfterApprove = await dao.getProposal(proposalId!);
            const approvalsBeforeChange = proposalAfterApprove.votes.approvals;

            // Change vote to reject
            await dao.voteProposal({
                sender: voter1,
                signer: voter1Signer,
                proposalId: proposalId!,
                vote: VOTE_REJECT,
            } as Parameters<typeof dao.voteProposal>[0]);

            const proposalAfterReject = await dao.getProposal(proposalId!);

            // Approvals should decrease, rejections should increase
            expect(proposalAfterReject.votes.approvals).toBeLessThan(approvalsBeforeChange);
            expect(proposalAfterReject.votes.rejections).toBeGreaterThan(0n);
        });

        test('should count abstain votes', async () => {
            // Create and submit proposal
            const costInfo = await dao.proposalCost({
                actions: [
                    {
                        type: ProposalActionEnum.UpdateFields,
                        field: 'min_rewards_impact',
                        value: 500,
                    },
                ],
            });

            await dao.client.appClient.fundAppAccount({ amount: costInfo.total.microAlgo() });

            const { return: proposalId } = await dao.newProposal({
                cid: EMPTY_CID,
                actions: [
                    {
                        type: ProposalActionEnum.UpdateFields,
                        field: 'min_rewards_impact',
                        value: 500,
                    },
                ],
            });

            await dao.submitProposal({ proposalId: proposalId! });

            // Vote abstain
            await dao.voteProposal({
                sender: voter1,
                signer: voter1Signer,
                proposalId: proposalId!,
                vote: VOTE_ABSTAIN,
            } as Parameters<typeof dao.voteProposal>[0]);

            const proposal = await dao.getProposal(proposalId!);
            expect(proposal.votes.abstains).toBeGreaterThan(0n);
        });
    });

    describe('Proposal Status Transitions', () => {
        test('should verify proposal status flow: Draft → Voting', async () => {
            const costInfo = await dao.proposalCost({
                actions: [
                    {
                        type: ProposalActionEnum.UpdateFields,
                        field: 'min_rewards_impact',
                        value: 600,
                    },
                ],
            });

            await dao.client.appClient.fundAppAccount({ amount: costInfo.total.microAlgo() });

            const { return: proposalId } = await dao.newProposal({
                cid: EMPTY_CID,
                actions: [
                    {
                        type: ProposalActionEnum.UpdateFields,
                        field: 'min_rewards_impact',
                        value: 600,
                    },
                ],
            });

            // Verify Draft status
            let proposal = await dao.getProposal(proposalId!);
            expect(proposal.status).toBe(0); // Draft

            // Submit to voting
            await dao.submitProposal({ proposalId: proposalId! });

            // Verify Voting status
            proposal = await dao.getProposal(proposalId!);
            expect(proposal.status).toBe(20); // Voting
        });
    });

    describe('Vote Power Calculation', () => {
        test('should weight votes by staking power', async () => {
            const { algorand } = fixture.context;

            // Setup voter2 with a different stake amount (smaller than voter1)
            const stakeAmount2 = 25_000_000_000n; // 25,000 BONES (half of voter1's 50,000)
            // Use blockchain timestamp instead of Date.now() since localnet timestamp differs from wall-clock time
            const status = await algorand.client.algod.status().do();
            const block = await algorand.client.algod.block(status.lastRound).do();
            const blockTimestamp = BigInt(block.block.header.timestamp);
            const expiration2 = blockTimestamp + BigInt(ONE_YEAR);

            const stakePayment2 = await algorand.createTransaction.payment({
                sender: voter2,
                signer: voter2Signer,
                receiver: staking.appAddress.toString(),
                amount: microAlgo(STAKES_MBR),
            });

            const assetXfer2 = await algorand.createTransaction.assetTransfer({
                sender: voter2,
                signer: voter2Signer,
                assetId: bonesAssetId,
                receiver: staking.appAddress.toString(),
                amount: stakeAmount2,
            });

            await staking.send.stakeAsa({
                sender: voter2,
                signer: voter2Signer,
                args: {
                    payment: stakePayment2,
                    assetXfer: assetXfer2,
                    type: STAKING_TYPE_LOCK,
                    amount: stakeAmount2,
                    expiration: expiration2,
                },
            });

            // Create and submit proposal
            const costInfo = await dao.proposalCost({
                actions: [
                    {
                        type: ProposalActionEnum.UpdateFields,
                        field: 'min_rewards_impact',
                        value: 700,
                    },
                ],
            });

            await dao.client.appClient.fundAppAccount({ amount: costInfo.total.microAlgo() });

            const { return: proposalId } = await dao.newProposal({
                cid: EMPTY_CID,
                actions: [
                    {
                        type: ProposalActionEnum.UpdateFields,
                        field: 'min_rewards_impact',
                        value: 700,
                    },
                ],
            });

            await dao.submitProposal({ proposalId: proposalId! });

            // Both voters vote approve
            await dao.voteProposal({
                sender: voter1,
                signer: voter1Signer,
                proposalId: proposalId!,
                vote: VOTE_APPROVE,
            } as Parameters<typeof dao.voteProposal>[0]);

            const proposalAfterVoter1 = await dao.getProposal(proposalId!);
            const voter1Power = proposalAfterVoter1.votes.approvals;

            await dao.voteProposal({
                sender: voter2,
                signer: voter2Signer,
                proposalId: proposalId!,
                vote: VOTE_APPROVE,
            } as Parameters<typeof dao.voteProposal>[0]);

            const proposalAfterVoter2 = await dao.getProposal(proposalId!);
            const totalApprovals = proposalAfterVoter2.votes.approvals;

            // Voter1 (50,000 BONES stake) should have more power than voter2 (25,000 BONES stake)
            const voter2Power = totalApprovals - voter1Power;
            expect(voter1Power).toBeGreaterThan(voter2Power);
        });
    });
});

