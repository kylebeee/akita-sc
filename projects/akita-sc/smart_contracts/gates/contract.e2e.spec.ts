import { Config, microAlgo } from '@algorandfoundation/algokit-utils';
import { registerDebugEventHandlers } from '@algorandfoundation/algokit-utils-debug';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { GateSDK, LogicalOperator, Operator } from 'akita-sdk/gates';
import { AsaMintPluginSDK, newWallet, WalletFactorySDK, WalletSDK } from 'akita-sdk/wallet';
import { ALGORAND_ZERO_ADDRESS_STRING } from 'algosdk';
import { deployAbstractedAccountFactory } from '../../tests/fixtures/abstracted-account';
import { deployAkitaDAO } from '../../tests/fixtures/dao';
import { deployEscrowFactory } from '../../tests/fixtures/escrow';
import { deployGate, deployGateClient } from '../../tests/fixtures/gates/gate';
import { deployAkitaReferrerGate } from '../../tests/fixtures/gates/sub-gates/akita-referrer';
import { deployAssetGate } from '../../tests/fixtures/gates/sub-gates/asset';
import { deployMerkleAddressGate } from '../../tests/fixtures/gates/sub-gates/merkle-address';
import { deployNFDGate } from '../../tests/fixtures/gates/sub-gates/nfd';
import { deployNFDRootGate } from '../../tests/fixtures/gates/sub-gates/nfd-root';
import { deployAsaMintPlugin } from '../../tests/fixtures/plugins/asa-mint';
import { AssetGateClient } from '../artifacts/gates/sub-gates/asset/AssetGateClient';

/**
 * Gate Contract Tests
 *
 * Tests for the main Gate contract and various sub-gate contracts.
 * Sub-gates are modular contracts that implement specific gating logic:
 * - AssetGate: Check asset holdings
 * - NFDGate: Check NFD ownership
 * - NFDRootGate: Check NFD root segment ownership
 * - MerkleAddressGate: Check membership in a merkle tree of addresses
 * - AkitaReferrerGate: Check referrer relationship
 */
describe('Gate Contract', () => {
  const localnet = algorandFixture();

  /** the wallet factory contract sdk */
  let walletFactory: WalletFactorySDK;
  /** the wallet sdk */
  let wallet: WalletSDK;
  /** the asa mint plugin sdk */
  let asaMintSdk: AsaMintPluginSDK;
  /** test asset for asset gate */
  let takta: bigint;

  beforeAll(async () => {
    Config.configure({
      debug: true,
      // traceAll: true,
    });
    registerDebugEventHandlers();

    await localnet.newScope();
    const {
      algorand,
      context: { testAccount },
    } = localnet;
    const sender = testAccount.toString();
    const signer = testAccount.signer;

    const dispenser = await algorand.account.dispenserFromEnvironment();
    await algorand.account.ensureFunded(sender, dispenser, (100).algos());

    const dao = await deployAkitaDAO({
      fixture: localnet,
      sender,
      signer,
      apps: {},
    });

    const escrowFactory = await deployEscrowFactory({
      fixture: localnet,
      sender,
      signer,
    });

    walletFactory = await deployAbstractedAccountFactory({
      fixture: localnet,
      sender,
      signer,
      args: {
        akitaDao: dao.appId,
        escrowFactory: escrowFactory.appId,
      },
    });

    wallet = await newWallet({
      algorand,
      factoryParams: {
        appId: walletFactory.appId,
        defaultSender: sender,
        defaultSigner: signer,
      },
      sender,
      signer,
      nickname: 'Test Wallet',
    });

    asaMintSdk = await deployAsaMintPlugin({ fixture: localnet, sender, signer });

    const mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n });

    let walletInfo = await algorand.account.getInformation(wallet.client.appAddress);
    expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos);

    const fundAmount = mbr.plugins;

    await wallet.client.appClient.fundAppAccount({
      amount: microAlgo(fundAmount),
    });

    await wallet.addPlugin({
      client: asaMintSdk,
      global: true,
    });

    walletInfo = await algorand.account.getInformation(wallet.client.appAddress);
    expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos);

    const results = await wallet.usePlugin({
      global: true,
      calls: [
        asaMintSdk.mint({
          assets: [
            {
              assetName: 'Test Akita',
              unitName: 'TAKTA',
              total: 1_000_000_000_000n,
              decimals: 6n,
              manager: wallet.client.appAddress.toString(),
              reserve: wallet.client.appAddress.toString(),
              freeze: ALGORAND_ZERO_ADDRESS_STRING,
              clawback: ALGORAND_ZERO_ADDRESS_STRING,
              defaultFrozen: false,
              url: 'https://akita.community',
            },
          ],
        }),
      ],
    });

    takta = results.returns[1][0];
  });

  beforeEach(localnet.newScope);

  // ==================================================================================
  // Main Gate Contract Tests
  // ==================================================================================

  describe('Main Gate Contract', () => {
    describe('Deployment', () => {
      test('main gate deploy OK', async () => {
        const {
          context: { testAccount },
        } = localnet;
        const sender = testAccount.toString();
        const signer = testAccount.signer;

        // Deploy asset gate first
        const assetGate = await deployAssetGate({
          fixture: localnet,
          sender,
          signer,
          args: {},
        });

        // Deploy main gate with asset gate in registry
        const gateSDK = await deployGate({
          fixture: localnet,
          sender,
          signer,
          args: {},
          gateRegistry: {
            asset: assetGate.appId,
          },
        });

        expect(gateSDK).toBeDefined();
        expect(gateSDK.appId).toBeGreaterThan(0n);
      });

      test('gate client deploy OK', async () => {
        const {
          context: { testAccount },
        } = localnet;
        const sender = testAccount.toString();
        const signer = testAccount.signer;

        const gateClient = await deployGateClient({
          fixture: localnet,
          sender,
          signer,
          args: {},
        });

        expect(gateClient).toBeDefined();
        expect(gateClient.appId).toBeGreaterThan(0n);
      });
    });

    describe('State', () => {
      test('gate initializes cursor correctly', async () => {
        const {
          context: { testAccount },
        } = localnet;
        const sender = testAccount.toString();
        const signer = testAccount.signer;

        const gateClient = await deployGateClient({
          fixture: localnet,
          sender,
          signer,
          args: {},
        });

        const state = await gateClient.state.global.getAll();

        // Gate cursor should start at 1
        expect(state.gateCursor).toBe(1n);
      });
    });
  });

  // ==================================================================================
  // Asset Gate Tests
  // ==================================================================================

  describe('Asset Gate', () => {
    describe('Deployment', () => {
      test('asset gate deploy OK', async () => {
        const {
          context: { testAccount },
        } = localnet;
        const sender = testAccount.toString();
        const signer = testAccount.signer;

        const assetGate = await deployAssetGate({
          fixture: localnet,
          sender,
          signer,
          args: {},
        });

        expect(assetGate).toBeDefined();
        expect(assetGate.appId).toBeGreaterThan(0n);
      });
    });

    describe('State', () => {
      test('asset gate initializes cursor correctly', async () => {
        const {
          context: { testAccount },
        } = localnet;
        const sender = testAccount.toString();
        const signer = testAccount.signer;

        const assetGate = await deployAssetGate({
          fixture: localnet,
          sender,
          signer,
          args: {},
        });

        const state = await assetGate.state.global.getAll();

        // Registry cursor should start at 1
        expect(state.registryCursor).toBe(1n);
        // Registration shape should be set
        expect(state.registrationShape).toBe('(uint64,uint8,uint64)');
        // Check shape should be empty for asset gates (no check args needed)
        expect(state.checkShape).toBe('');
      });
    });
  });

  // ==================================================================================
  // NFD Gate Tests
  // ==================================================================================

  describe('NFD Gate', () => {
    describe('Deployment', () => {
      test('NFD gate deploy OK', async () => {
        const {
          context: { testAccount },
        } = localnet;
        const sender = testAccount.toString();
        const signer = testAccount.signer;

        const nfdGate = await deployNFDGate({
          fixture: localnet,
          sender,
          signer,
          args: {},
        });

        expect(nfdGate).toBeDefined();
        expect(nfdGate.appId).toBeGreaterThan(0n);
      });
    });

    describe('State', () => {
      test('NFD gate initializes state correctly', async () => {
        const {
          context: { testAccount },
        } = localnet;
        const sender = testAccount.toString();
        const signer = testAccount.signer;

        const nfdGate = await deployNFDGate({
          fixture: localnet,
          sender,
          signer,
          args: {},
        });

        const state = await nfdGate.state.global.getAll();

        // NFD Gate has no registration shape (no register args needed)
        expect(state.registrationShape).toBe('');
        // Check shape should be uint64 (NFD app ID)
        expect(state.checkShape).toBe('uint64');
      });
    });

    describe('Cost', () => {
      test('NFD gate cost is zero (no storage needed)', async () => {
        const {
          context: { testAccount },
        } = localnet;
        const sender = testAccount.toString();
        const signer = testAccount.signer;

        const nfdGate = await deployNFDGate({
          fixture: localnet,
          sender,
          signer,
          args: {},
        });

        const { return: cost } = await nfdGate.send.cost({
          args: {
            args: new Uint8Array(0),
          },
        });

        // NFD gate cost is 0 (no box storage required)
        expect(cost).toBe(0n);
      });
    });
  });

  // ==================================================================================
  // NFD Root Gate Tests
  // ==================================================================================

  describe('NFD Root Gate', () => {
    describe('Deployment', () => {
      test('NFD Root gate deploy OK', async () => {
        const {
          context: { testAccount },
        } = localnet;
        const sender = testAccount.toString();
        const signer = testAccount.signer;

        const nfdRootGate = await deployNFDRootGate({
          fixture: localnet,
          sender,
          signer,
          args: {},
        });

        expect(nfdRootGate).toBeDefined();
        expect(nfdRootGate.appId).toBeGreaterThan(0n);
      });
    });

    describe('State', () => {
      test('NFD Root gate initializes state correctly', async () => {
        const {
          context: { testAccount },
        } = localnet;
        const sender = testAccount.toString();
        const signer = testAccount.signer;

        const nfdRootGate = await deployNFDRootGate({
          fixture: localnet,
          sender,
          signer,
          args: {},
        });

        const state = await nfdRootGate.state.global.getAll();

        // NFD Root Gate has registration shape for root name
        expect(state.registrationShape).toBe('string');
        // Check shape should be uint64 (NFD app ID)
        expect(state.checkShape).toBe('uint64');
        // Registry cursor should start at 1
        expect(state.registryCursor).toBe(1n);
      });
    });
  });

  // ==================================================================================
  // Merkle Address Gate Tests
  // ==================================================================================

  describe('Merkle Address Gate', () => {
    describe('Deployment', () => {
      test('Merkle Address gate deploy OK', async () => {
        const {
          context: { testAccount },
        } = localnet;
        const sender = testAccount.toString();
        const signer = testAccount.signer;

        const merkleAddressGate = await deployMerkleAddressGate({
          fixture: localnet,
          sender,
          signer,
          args: {},
        });

        expect(merkleAddressGate).toBeDefined();
        expect(merkleAddressGate.appId).toBeGreaterThan(0n);
      });
    });

    describe('State', () => {
      test('Merkle Address gate initializes state correctly', async () => {
        const {
          context: { testAccount },
        } = localnet;
        const sender = testAccount.toString();
        const signer = testAccount.signer;

        const merkleAddressGate = await deployMerkleAddressGate({
          fixture: localnet,
          sender,
          signer,
          args: {},
        });

        const state = await merkleAddressGate.state.global.getAll();

        // Registration shape is (address, string) - creator and merkle name
        expect(state.registrationShape).toBe('(address,string)');
        // Check shape is byte[32][] - merkle proof
        expect(state.checkShape).toBe('byte[32][]');
        // Registry cursor should start at 1
        expect(state.registryCursor).toBe(1n);
      });
    });
  });

  // ==================================================================================
  // Akita Referrer Gate Tests
  // ==================================================================================

  describe('Akita Referrer Gate', () => {
    describe('Deployment', () => {
      test('Akita Referrer gate deploy OK', async () => {
        const {
          context: { testAccount },
        } = localnet;
        const sender = testAccount.toString();
        const signer = testAccount.signer;

        const referrerGate = await deployAkitaReferrerGate({
          fixture: localnet,
          sender,
          signer,
          args: {},
        });

        expect(referrerGate).toBeDefined();
        expect(referrerGate.appId).toBeGreaterThan(0n);
      });
    });

    describe('State', () => {
      test('Akita Referrer gate initializes state correctly', async () => {
        const {
          context: { testAccount },
        } = localnet;
        const sender = testAccount.toString();
        const signer = testAccount.signer;

        const referrerGate = await deployAkitaReferrerGate({
          fixture: localnet,
          sender,
          signer,
          args: {},
        });

        const state = await referrerGate.state.global.getAll();

        // Registration shape is address - the referrer address
        expect(state.registrationShape).toBe('address');
        // Check shape is empty - wallet ID is passed as args
        expect(state.checkShape).toBe('');
        // Registry cursor should start at 1
        expect(state.registryCursor).toBe(1n);
      });
    });
  });

  // ==================================================================================
  // Multi-Gate Integration Tests
  // ==================================================================================

  describe('Multi-Gate Registry', () => {
    test('main gate can be deployed with multiple sub-gates in registry', async () => {
      const {
        algorand,
        context: { testAccount },
      } = localnet;
      const sender = testAccount.toString();
      const signer = testAccount.signer;

      // Deploy multiple sub-gates
      const assetGate = await deployAssetGate({
        fixture: localnet,
        sender,
        signer,
        args: {},
      });

      const nfdGate = await deployNFDGate({
        fixture: localnet,
        sender,
        signer,
        args: {},
      });

      const merkleAddressGate = await deployMerkleAddressGate({
        fixture: localnet,
        sender,
        signer,
        args: {},
      });

      // Deploy main gate with all sub-gates in registry
      const gateSDK = await deployGate({
        fixture: localnet,
        sender,
        signer,
        args: {},
        gateRegistry: {
          asset: assetGate.appId,
          nfd: nfdGate.appId,
          merkle_address: merkleAddressGate.appId,
        },
      });

      expect(gateSDK).toBeDefined();
      expect(gateSDK.appId).toBeGreaterThan(0n);

      // Verify all sub-gates are accessible
      expect(assetGate.appId).toBeGreaterThan(0n);
      expect(nfdGate.appId).toBeGreaterThan(0n);
      expect(merkleAddressGate.appId).toBeGreaterThan(0n);
    });
  });

  // ==================================================================================
  // Single Gate Registration and Check Tests
  // ==================================================================================

  describe('Single Gate Registration', () => {
    let assetGate: AssetGateClient;
    let gateSDK: GateSDK;

    beforeAll(async () => {
      const {
        algorand,
        context: { testAccount },
      } = localnet;
      const sender = testAccount.toString();
      const signer = testAccount.signer;

      assetGate = await deployAssetGate({
        fixture: localnet,
        sender,
        signer,
        args: {},
      });

      // Fund the asset gate with additional ALGO for box MBR (needs ~10k per registration)
      await assetGate.appClient.fundAppAccount({ amount: (500_000).microAlgos() });

      gateSDK = await deployGate({
        fixture: localnet,
        sender,
        signer,
        args: {},
        gateRegistry: {
          asset: assetGate.appId,
        },
      });

      // Fund the gate contract with additional ALGO for registration MBR (needs ~10k per registration)
      await gateSDK.client.appClient.fundAppAccount({ amount: (500_000).microAlgos() });
    });

    test('register an asset gate with GreaterThanOrEqualTo operator', async () => {
      const { return: gateId } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: takta,
            op: Operator.GreaterThanOrEqualTo,
            value: 100_000n,
          },
        ],
      });

      expect(gateId).toBeGreaterThan(0n);

      if (!gateId) throw new Error('no gateId');

      const info = await gateSDK.getGate({ gateId });

      expect(info).toBeDefined();
      expect(info.length).toBe(1);
      expect(info[0].type).toBe('asset');
    });

    test('register an asset gate with Equal operator', async () => {
      const { return: gateId } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: takta,
            op: Operator.Equal,
            value: 1_000_000_000_000n, // exact total supply
          },
        ],
      });

      expect(gateId).toBeGreaterThan(0n);
    });

    test('register an asset gate with LessThan operator', async () => {
      const { return: gateId } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: takta,
            op: Operator.LessThan,
            value: 500_000_000_000n,
          },
        ],
      });

      expect(gateId).toBeGreaterThan(0n);
    });

    test('register an asset gate with NotEqual operator', async () => {
      const { return: gateId } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: takta,
            op: Operator.NotEqual,
            value: 0n,
          },
        ],
      });

      expect(gateId).toBeGreaterThan(0n);
    });
  });

  // ==================================================================================
  // Gate Check Tests - Single Gate
  // ==================================================================================

  describe('Single Gate Checks', () => {
    let assetGate: AssetGateClient;
    let gateSDK: GateSDK;

    beforeAll(async () => {
      const {
        algorand,
        context: { testAccount },
      } = localnet;
      const sender = testAccount.toString();
      const signer = testAccount.signer;

      assetGate = await deployAssetGate({
        fixture: localnet,
        sender,
        signer,
        args: {},
      });

      // Fund the asset gate with additional ALGO for box MBR
      await assetGate.appClient.fundAppAccount({ amount: (500_000).microAlgos() });

      gateSDK = await deployGate({
        fixture: localnet,
        sender,
        signer,
        args: {},
        gateRegistry: {
          asset: assetGate.appId,
        },
      });

      // Fund the gate contract with additional ALGO for registration MBR
      await gateSDK.client.appClient.fundAppAccount({ amount: (500_000).microAlgos() });
    });

    test('check gate passes when GreaterThanOrEqualTo condition met', async () => {
      const { return: gateId } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: takta,
            op: Operator.GreaterThanOrEqualTo,
            value: 100_000n,
          },
        ],
      });

      if (!gateId) throw new Error('no gateId');

      // Wallet holds the full supply of takta, so should pass
      const { return: result } = await gateSDK.check({
        caller: wallet.client.appAddress.toString(),
        gateId,
        args: [{ type: 'asset' }],
      });

      expect(result).toBe(true);
    });

    test('check gate fails when user not opted in to asset', async () => {
      const {
        context: { generateAccount },
      } = localnet;

      const emptyAccount = await generateAccount({ initialFunds: (1).algos() });

      const { return: gateId } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: takta,
            op: Operator.GreaterThanOrEqualTo,
            value: 100_000n,
          },
        ],
      });

      if (!gateId) throw new Error('no gateId');

      // Account not opted in to asset
      const { return: result } = await gateSDK.check({
        caller: emptyAccount.toString(),
        gateId,
        args: [{ type: 'asset' }],
      });

      expect(result).toBe(false);
    });

    test('check gate with Equal operator passes when balance matches exactly', async () => {
      const { return: gateId } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: takta,
            op: Operator.Equal,
            value: 1_000_000_000_000n, // exact total supply
          },
        ],
      });

      if (!gateId) throw new Error('no gateId');

      const { return: result } = await gateSDK.check({
        caller: wallet.client.appAddress.toString(),
        gateId,
        args: [{ type: 'asset' }],
      });

      expect(result).toBe(true);
    });

    test('check gate with Equal operator fails when balance does not match', async () => {
      const { return: gateId } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: takta,
            op: Operator.Equal,
            value: 999n, // wrong value
          },
        ],
      });

      if (!gateId) throw new Error('no gateId');

      const { return: result } = await gateSDK.check({
        caller: wallet.client.appAddress.toString(),
        gateId,
        args: [{ type: 'asset' }],
      });

      expect(result).toBe(false);
    });

    test('check gate with LessThan operator fails when balance is not less', async () => {
      // The wallet holds a large supply, so LessThan a small number should fail
      const { return: gateId } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: takta,
            op: Operator.LessThan,
            value: 1000n, // Wallet has much more than 1000
          },
        ],
      });

      if (!gateId) throw new Error('no gateId');

      const { return: result } = await gateSDK.check({
        caller: wallet.client.appAddress.toString(),
        gateId,
        args: [{ type: 'asset' }],
      });

      expect(result).toBe(false);
    });

    test('check gate with LessThan operator passes when condition is met', async () => {
      // The wallet holds the full supply, so LessThan max uint64 should pass
      const { return: gateId } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: takta,
            op: Operator.LessThan,
            value: BigInt('18446744073709551615'), // max uint64
          },
        ],
      });

      if (!gateId) throw new Error('no gateId');

      const { return: result } = await gateSDK.check({
        caller: wallet.client.appAddress.toString(),
        gateId,
        args: [{ type: 'asset' }],
      });

      expect(result).toBe(true);
    });

    test('check gate with GreaterThan operator passes when balance is greater', async () => {
      const { return: gateId } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: takta,
            op: Operator.GreaterThan,
            value: 100n,
          },
        ],
      });

      if (!gateId) throw new Error('no gateId');

      const { return: result } = await gateSDK.check({
        caller: wallet.client.appAddress.toString(),
        gateId,
        args: [{ type: 'asset' }],
      });

      expect(result).toBe(true);
    });

    test('check gate with NotEqual operator passes when balance differs', async () => {
      const { return: gateId } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: takta,
            op: Operator.NotEqual,
            value: 0n,
          },
        ],
      });

      if (!gateId) throw new Error('no gateId');

      const { return: result } = await gateSDK.check({
        caller: wallet.client.appAddress.toString(),
        gateId,
        args: [{ type: 'asset' }],
      });

      expect(result).toBe(true);
    });
  });

  // ==================================================================================
  // Multi-Gate Combination Tests with AND Logic
  // ==================================================================================

  describe('Multi-Gate Combinations with AND Logic', () => {
    let assetGate: AssetGateClient;
    let gateSDK: GateSDK;
    let secondAsset: bigint;

    beforeAll(async () => {
      const {
        algorand,
        context: { testAccount },
      } = localnet;
      const sender = testAccount.toString();
      const signer = testAccount.signer;

      assetGate = await deployAssetGate({
        fixture: localnet,
        sender,
        signer,
        args: {},
      });

      // Fund the asset gate with additional ALGO for box MBR
      await assetGate.appClient.fundAppAccount({ amount: (500_000).microAlgos() });

      gateSDK = await deployGate({
        fixture: localnet,
        sender,
        signer,
        args: {},
        gateRegistry: {
          asset: assetGate.appId,
        },
      });

      // Fund the gate contract with additional ALGO for registration MBR
      await gateSDK.client.appClient.fundAppAccount({ amount: (500_000).microAlgos() });

      // Create a second test asset for combination tests
      const results = await wallet.usePlugin({
        global: true,
        calls: [
          asaMintSdk.mint({
            assets: [
              {
                assetName: 'Second Test Token',
                unitName: 'STT',
                total: 500_000_000n,
                decimals: 6n,
                manager: wallet.client.appAddress.toString(),
                reserve: wallet.client.appAddress.toString(),
                freeze: ALGORAND_ZERO_ADDRESS_STRING,
                clawback: ALGORAND_ZERO_ADDRESS_STRING,
                defaultFrozen: false,
                url: 'https://akita.community/test',
              },
            ],
          }),
        ],
      });

      secondAsset = results.returns[1][0];
    });

    test('AND gate passes when both conditions are met', async () => {
      const { return: gateId } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.And,
            type: 'asset',
            asset: takta,
            op: Operator.GreaterThanOrEqualTo,
            value: 100_000n,
          },
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: secondAsset,
            op: Operator.GreaterThanOrEqualTo,
            value: 1000n,
          },
        ],
      });

      if (!gateId) throw new Error('no gateId');

      const { return: result } = await gateSDK.check({
        caller: wallet.client.appAddress.toString(),
        gateId,
        args: [{ type: 'asset' }, { type: 'asset' }],
      });

      expect(result).toBe(true);
    });

    test('AND gate fails when first condition is not met', async () => {
      const { return: gateId } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.And,
            type: 'asset',
            asset: takta,
            op: Operator.Equal,
            value: 1n, // Wallet has much more than 1
          },
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: secondAsset,
            op: Operator.GreaterThanOrEqualTo,
            value: 1000n,
          },
        ],
      });

      if (!gateId) throw new Error('no gateId');

      const { return: result } = await gateSDK.check({
        caller: wallet.client.appAddress.toString(),
        gateId,
        args: [{ type: 'asset' }, { type: 'asset' }],
      });

      expect(result).toBe(false);
    });

    test('AND gate fails when second condition is not met', async () => {
      const { return: gateId } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.And,
            type: 'asset',
            asset: takta,
            op: Operator.GreaterThanOrEqualTo,
            value: 100_000n,
          },
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: secondAsset,
            op: Operator.Equal,
            value: 999_999_999_999n, // Wallet doesn't have this much of second asset
          },
        ],
      });

      if (!gateId) throw new Error('no gateId');

      const { return: result } = await gateSDK.check({
        caller: wallet.client.appAddress.toString(),
        gateId,
        args: [{ type: 'asset' }, { type: 'asset' }],
      });

      expect(result).toBe(false);
    });

    test('AND gate with three conditions - all pass (using opUp for extra references)', async () => {
      const { return: gateId } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.And,
            type: 'asset',
            asset: takta,
            op: Operator.GreaterThan,
            value: 0n,
          },
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.And,
            type: 'asset',
            asset: secondAsset,
            op: Operator.GreaterThan,
            value: 0n,
          },
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: takta,
            op: Operator.LessThanOrEqualTo,
            value: 2_000_000_000_000n,
          },
        ],
      });

      if (!gateId) throw new Error('no gateId');

      // Use newGroup with opUp to add extra app references for 3+ gate checks
      // Also add extraFee to cover inner transaction fees (3 inner calls = 3000 microAlgos)
      const preppedArgs = [new Uint8Array(), new Uint8Array(), new Uint8Array()];

      const result = await gateSDK.client
        .newGroup()
        .opUp({ args: [], appReferences: [assetGate.appId] })
        .check({
          args: {
            caller: wallet.client.appAddress.toString(),
            gateId,
            args: preppedArgs,
          },
          extraFee: microAlgo(3000),
        })
        .send();

      expect(result.returns[1]).toBe(true);
    });
  });

  // ==================================================================================
  // Multi-Gate Combination Tests with OR Logic
  // ==================================================================================

  describe('Multi-Gate Combinations with OR Logic', () => {
    let assetGate: AssetGateClient;
    let gateSDK: GateSDK;
    let secondAsset: bigint;

    beforeAll(async () => {
      const {
        algorand,
        context: { testAccount },
      } = localnet;
      const sender = testAccount.toString();
      const signer = testAccount.signer;

      assetGate = await deployAssetGate({
        fixture: localnet,
        sender,
        signer,
        args: {},
      });

      // Fund the asset gate with additional ALGO for box MBR
      await assetGate.appClient.fundAppAccount({ amount: (500_000).microAlgos() });

      gateSDK = await deployGate({
        fixture: localnet,
        sender,
        signer,
        args: {},
        gateRegistry: {
          asset: assetGate.appId,
        },
      });

      // Fund the gate contract with additional ALGO for registration MBR
      await gateSDK.client.appClient.fundAppAccount({ amount: (500_000).microAlgos() });

      // Create a second test asset for combination tests
      const results = await wallet.usePlugin({
        global: true,
        calls: [
          asaMintSdk.mint({
            assets: [
              {
                assetName: 'OR Test Token',
                unitName: 'OTT',
                total: 500_000_000n,
                decimals: 6n,
                manager: wallet.client.appAddress.toString(),
                reserve: wallet.client.appAddress.toString(),
                freeze: ALGORAND_ZERO_ADDRESS_STRING,
                clawback: ALGORAND_ZERO_ADDRESS_STRING,
                defaultFrozen: false,
                url: 'https://akita.community/test',
              },
            ],
          }),
        ],
      });

      secondAsset = results.returns[1][0];
    });

    test('OR gate passes when first condition is met', async () => {
      const { return: gateId } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.Or,
            type: 'asset',
            asset: takta,
            op: Operator.GreaterThanOrEqualTo,
            value: 100_000n,
          },
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: secondAsset,
            op: Operator.Equal,
            value: 999_999_999_999n, // impossible amount
          },
        ],
      });

      if (!gateId) throw new Error('no gateId');

      const { return: result } = await gateSDK.check({
        caller: wallet.client.appAddress.toString(),
        gateId,
        args: [{ type: 'asset' }, { type: 'asset' }],
      });

      expect(result).toBe(true);
    });

    test('OR gate passes when second condition is met', async () => {
      const { return: gateId } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.Or,
            type: 'asset',
            asset: takta,
            op: Operator.Equal,
            value: 1n, // wallet has more than 1
          },
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: secondAsset,
            op: Operator.GreaterThan,
            value: 0n,
          },
        ],
      });

      if (!gateId) throw new Error('no gateId');

      const { return: result } = await gateSDK.check({
        caller: wallet.client.appAddress.toString(),
        gateId,
        args: [{ type: 'asset' }, { type: 'asset' }],
      });

      expect(result).toBe(true);
    });

    test('OR gate passes when both conditions are met', async () => {
      const { return: gateId } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.Or,
            type: 'asset',
            asset: takta,
            op: Operator.GreaterThan,
            value: 0n,
          },
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: secondAsset,
            op: Operator.GreaterThan,
            value: 0n,
          },
        ],
      });

      if (!gateId) throw new Error('no gateId');

      const { return: result } = await gateSDK.check({
        caller: wallet.client.appAddress.toString(),
        gateId,
        args: [{ type: 'asset' }, { type: 'asset' }],
      });

      expect(result).toBe(true);
    });

    test('OR gate fails when neither condition is met', async () => {
      const { return: gateId } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.Or,
            type: 'asset',
            asset: takta,
            op: Operator.Equal,
            value: 1n, // wallet has full supply, not 1
          },
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: secondAsset,
            op: Operator.Equal,
            value: 1n, // wallet has full supply, not 1
          },
        ],
      });

      if (!gateId) throw new Error('no gateId');

      const { return: result } = await gateSDK.check({
        caller: wallet.client.appAddress.toString(),
        gateId,
        args: [{ type: 'asset' }, { type: 'asset' }],
      });

      expect(result).toBe(false);
    });
  });

  // ==================================================================================
  // Mixed AND/OR Combination Tests
  // ==================================================================================

  describe('Mixed AND/OR Gate Combinations', () => {
    let assetGate: AssetGateClient;
    let gateSDK: GateSDK;
    let secondAsset: bigint;
    let thirdAsset: bigint;

    beforeAll(async () => {
      const {
        algorand,
        context: { testAccount },
      } = localnet;
      const sender = testAccount.toString();
      const signer = testAccount.signer;

      assetGate = await deployAssetGate({
        fixture: localnet,
        sender,
        signer,
        args: {},
      });

      // Fund the asset gate with additional ALGO for box MBR
      await assetGate.appClient.fundAppAccount({ amount: (500_000).microAlgos() });

      gateSDK = await deployGate({
        fixture: localnet,
        sender,
        signer,
        args: {},
        gateRegistry: {
          asset: assetGate.appId,
        },
      });

      // Fund the gate contract with additional ALGO for registration MBR
      await gateSDK.client.appClient.fundAppAccount({ amount: (500_000).microAlgos() });

      // Create additional test assets for complex combination tests
      const results = await wallet.usePlugin({
        global: true,
        calls: [
          asaMintSdk.mint({
            assets: [
              {
                assetName: 'Mixed Test Token A',
                unitName: 'MTA',
                total: 1_000_000n,
                decimals: 6n,
                manager: wallet.client.appAddress.toString(),
                reserve: wallet.client.appAddress.toString(),
                freeze: ALGORAND_ZERO_ADDRESS_STRING,
                clawback: ALGORAND_ZERO_ADDRESS_STRING,
                defaultFrozen: false,
                url: 'https://akita.community/test-a',
              },
              {
                assetName: 'Mixed Test Token B',
                unitName: 'MTB',
                total: 2_000_000n,
                decimals: 6n,
                manager: wallet.client.appAddress.toString(),
                reserve: wallet.client.appAddress.toString(),
                freeze: ALGORAND_ZERO_ADDRESS_STRING,
                clawback: ALGORAND_ZERO_ADDRESS_STRING,
                defaultFrozen: false,
                url: 'https://akita.community/test-b',
              },
            ],
          }),
        ],
      });

      secondAsset = results.returns[1][0];
      thirdAsset = results.returns[1][1];
    });

    // Note: Tests with 3+ gates need opUp transactions to add extra app references
    // to the atomic group. Each transaction can carry additional foreign app references.

    test('A AND B OR C - passes when A AND B are true (using opUp)', async () => {
      // (A AND B) OR C - should pass because A AND B are both true
      const { return: gateId } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.And,
            type: 'asset',
            asset: takta,
            op: Operator.GreaterThan,
            value: 0n, // A - true
          },
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.Or,
            type: 'asset',
            asset: secondAsset,
            op: Operator.GreaterThan,
            value: 0n, // B - true
          },
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: thirdAsset,
            op: Operator.Equal,
            value: 1n, // C - false
          },
        ],
      });

      if (!gateId) throw new Error('no gateId');

      // Use newGroup with opUp to add extra app references for 3+ gate checks
      // Also add extraFee to cover inner transaction fees (3 inner calls = 3000 microAlgos)
      const preppedArgs = [new Uint8Array(), new Uint8Array(), new Uint8Array()];

      const result = await gateSDK.client
        .newGroup()
        .opUp({ args: [], appReferences: [assetGate.appId] })
        .check({
          args: {
            caller: wallet.client.appAddress.toString(),
            gateId,
            args: preppedArgs,
          },
          extraFee: microAlgo(3000),
        })
        .send();

      expect(result.returns[1]).toBe(true);
    });

    test('A OR B AND C - passes when A is true (using opUp)', async () => {
      // A OR (B AND C) - should pass because A is true
      const { return: gateId } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.Or,
            type: 'asset',
            asset: takta,
            op: Operator.GreaterThan,
            value: 0n, // A - true
          },
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.And,
            type: 'asset',
            asset: secondAsset,
            op: Operator.Equal,
            value: 1n, // B - false
          },
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: thirdAsset,
            op: Operator.GreaterThan,
            value: 0n, // C - true
          },
        ],
      });

      if (!gateId) throw new Error('no gateId');

      const preppedArgs = [new Uint8Array(), new Uint8Array(), new Uint8Array()];

      const result = await gateSDK.client
        .newGroup()
        .opUp({ args: [], appReferences: [assetGate.appId] })
        .check({
          args: {
            caller: wallet.client.appAddress.toString(),
            gateId,
            args: preppedArgs,
          },
          extraFee: microAlgo(3000),
        })
        .send();

      expect(result.returns[1]).toBe(true);
    });

    test('Complex gate: A AND B AND C - all must pass (using opUp)', async () => {
      const { return: gateId } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.And,
            type: 'asset',
            asset: takta,
            op: Operator.GreaterThan,
            value: 0n,
          },
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.And,
            type: 'asset',
            asset: secondAsset,
            op: Operator.GreaterThan,
            value: 0n,
          },
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: thirdAsset,
            op: Operator.GreaterThan,
            value: 0n,
          },
        ],
      });

      if (!gateId) throw new Error('no gateId');

      const preppedArgs = [new Uint8Array(), new Uint8Array(), new Uint8Array()];

      const result = await gateSDK.client
        .newGroup()
        .opUp({ args: [], appReferences: [assetGate.appId] })
        .check({
          args: {
            caller: wallet.client.appAddress.toString(),
            gateId,
            args: preppedArgs,
          },
          extraFee: microAlgo(3000),
        })
        .send();

      expect(result.returns[1]).toBe(true);
    });

    test('Complex gate: A OR B OR C - at least one must pass (using opUp)', async () => {
      const { return: gateId } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.Or,
            type: 'asset',
            asset: takta,
            op: Operator.Equal,
            value: 1n, // false
          },
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.Or,
            type: 'asset',
            asset: secondAsset,
            op: Operator.Equal,
            value: 1n, // false
          },
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: thirdAsset,
            op: Operator.GreaterThan,
            value: 0n, // true
          },
        ],
      });

      if (!gateId) throw new Error('no gateId');

      const preppedArgs = [new Uint8Array(), new Uint8Array(), new Uint8Array()];

      const result = await gateSDK.client
        .newGroup()
        .opUp({ args: [], appReferences: [assetGate.appId] })
        .check({
          args: {
            caller: wallet.client.appAddress.toString(),
            gateId,
            args: preppedArgs,
          },
          extraFee: microAlgo(3000),
        })
        .send();

      expect(result.returns[1]).toBe(true);
    });
  });

  // ==================================================================================
  // Edge Case Tests
  // ==================================================================================

  describe('Edge Cases', () => {
    let assetGate: AssetGateClient;
    let gateSDK: GateSDK;

    beforeAll(async () => {
      const {
        algorand,
        context: { testAccount },
      } = localnet;
      const sender = testAccount.toString();
      const signer = testAccount.signer;

      assetGate = await deployAssetGate({
        fixture: localnet,
        sender,
        signer,
        args: {},
      });

      // Fund the asset gate with additional ALGO for box MBR
      await assetGate.appClient.fundAppAccount({ amount: (500_000).microAlgos() });

      gateSDK = await deployGate({
        fixture: localnet,
        sender,
        signer,
        args: {},
        gateRegistry: {
          asset: assetGate.appId,
        },
      });

      // Fund the gate contract with additional ALGO for registration MBR
      await gateSDK.client.appClient.fundAppAccount({ amount: (500_000).microAlgos() });
    });

    test('gate check with zero value threshold', async () => {
      const { return: gateId } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: takta,
            op: Operator.GreaterThan,
            value: 0n,
          },
        ],
      });

      if (!gateId) throw new Error('no gateId');

      const { return: result } = await gateSDK.check({
        caller: wallet.client.appAddress.toString(),
        gateId,
        args: [{ type: 'asset' }],
      });

      expect(result).toBe(true);
    });

    test('gate check with maximum value threshold', async () => {
      const { return: gateId } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: takta,
            op: Operator.LessThanOrEqualTo,
            value: BigInt('18446744073709551615'), // max uint64
          },
        ],
      });

      if (!gateId) throw new Error('no gateId');

      const { return: result } = await gateSDK.check({
        caller: wallet.client.appAddress.toString(),
        gateId,
        args: [{ type: 'asset' }],
      });

      expect(result).toBe(true);
    });

    test('LessThanOrEqualTo with exact balance matches', async () => {
      const { return: gateId } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: takta,
            op: Operator.LessThanOrEqualTo,
            value: 1_000_000_000_000n, // exact supply
          },
        ],
      });

      if (!gateId) throw new Error('no gateId');

      const { return: result } = await gateSDK.check({
        caller: wallet.client.appAddress.toString(),
        gateId,
        args: [{ type: 'asset' }],
      });

      expect(result).toBe(true);
    });

    test('GreaterThanOrEqualTo with exact balance matches', async () => {
      const { return: gateId } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: takta,
            op: Operator.GreaterThanOrEqualTo,
            value: 1_000_000_000_000n, // exact supply
          },
        ],
      });

      if (!gateId) throw new Error('no gateId');

      const { return: result } = await gateSDK.check({
        caller: wallet.client.appAddress.toString(),
        gateId,
        args: [{ type: 'asset' }],
      });

      expect(result).toBe(true);
    });
  });

  // ==================================================================================
  // Getters and State Verification Tests
  // ==================================================================================

  describe('Gate State and Getters', () => {
    let assetGate: AssetGateClient;
    let gateSDK: GateSDK;

    beforeAll(async () => {
      const {
        algorand,
        context: { testAccount },
      } = localnet;
      const sender = testAccount.toString();
      const signer = testAccount.signer;

      assetGate = await deployAssetGate({
        fixture: localnet,
        sender,
        signer,
        args: {},
      });

      // Fund the asset gate with additional ALGO for box MBR
      await assetGate.appClient.fundAppAccount({ amount: (500_000).microAlgos() });

      gateSDK = await deployGate({
        fixture: localnet,
        sender,
        signer,
        args: {},
        gateRegistry: {
          asset: assetGate.appId,
        },
      });

      // Fund the gate contract with additional ALGO for registration MBR
      await gateSDK.client.appClient.fundAppAccount({ amount: (500_000).microAlgos() });
    });

    test('getGate returns correct gate info for single gate', async () => {
      const { return: gateId } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: takta,
            op: Operator.GreaterThanOrEqualTo,
            value: 100_000n,
          },
        ],
      });

      if (!gateId) throw new Error('no gateId');

      const info = await gateSDK.getGate({ gateId });

      expect(info).toBeDefined();
      expect(info.length).toBe(1);
      expect(info[0].type).toBe('asset');
      expect(info[0].asset).toBe(takta);
      expect(info[0].op).toBe(Operator.GreaterThanOrEqualTo);
      expect(info[0].value).toBe(100_000n);
    });

    test('getGate returns correct info for multi-gate', async () => {
      const { return: gateId } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.And,
            type: 'asset',
            asset: takta,
            op: Operator.GreaterThan,
            value: 50_000n,
          },
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: takta,
            op: Operator.LessThan,
            value: 2_000_000_000_000n,
          },
        ],
      });

      if (!gateId) throw new Error('no gateId');

      const info = await gateSDK.getGate({ gateId });

      expect(info).toBeDefined();
      expect(info.length).toBe(2);
      expect(info[0].type).toBe('asset');
      expect(info[0].op).toBe(Operator.GreaterThan);
      expect(info[1].type).toBe('asset');
      expect(info[1].op).toBe(Operator.LessThan);
    });

    test('gate cursor increments correctly with multiple registrations', async () => {
      const { return: gateId1 } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: takta,
            op: Operator.GreaterThan,
            value: 0n,
          },
        ],
      });

      const { return: gateId2 } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: takta,
            op: Operator.GreaterThan,
            value: 100n,
          },
        ],
      });

      const { return: gateId3 } = await gateSDK.register({
        args: [
          {
            layer: 0n,
            appId: assetGate.appId,
            logicalOperator: LogicalOperator.None,
            type: 'asset',
            asset: takta,
            op: Operator.GreaterThan,
            value: 1000n,
          },
        ],
      });

      expect(gateId1).toBeDefined();
      expect(gateId2).toBeDefined();
      expect(gateId3).toBeDefined();

      // Each gate should have a unique, incrementing ID
      expect(gateId2! > gateId1!).toBe(true);
      expect(gateId3! > gateId2!).toBe(true);
    });
  });
});
