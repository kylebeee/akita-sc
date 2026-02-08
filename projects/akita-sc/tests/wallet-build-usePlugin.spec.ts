import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { setCurrentNetwork } from 'akita-sdk';
import { WalletSDK, WalletFactorySDK, PayPluginSDK, OptInPluginSDK } from 'akita-sdk/wallet';
import { microAlgo } from '@algorandfoundation/algokit-utils';
import { describe, beforeAll, beforeEach, test, expect } from 'vitest';
import algosdk from 'algosdk';
import { deployAbstractedAccountFactory } from './fixtures/abstracted-account';
import { deployPayPlugin } from './fixtures/plugins/pay';
import { deployOptInPlugin } from './fixtures/plugins/optin';
import { deployEscrowFactory } from './fixtures/escrow';
import { deployAkitaDAO } from './fixtures/dao';
import { deployTestCloseOutPlugin, TestCloseOutPluginSDK } from './fixtures/plugins/test-close-out';
import { deployTestProxyRekeyPlugin, TestProxyRekeyPluginSDK } from './fixtures/plugins/test-proxy-rekey';

/**
 * Helper to get account balance (ALGO and assets)
 */
async function getAccountBalances(
  algod: algosdk.Algodv2,
  address: string
): Promise<{ algo: bigint; assets: Map<bigint, bigint> }> {
  const info = await algod.accountInformation(address).do();
  const algo = BigInt(info.amount ?? 0);
  const assets = new Map<bigint, bigint>();
  
  if (info.assets && Array.isArray(info.assets)) {
    for (const asset of info.assets) {
      // Handle both camelCase and kebab-case field names
      const assetId = asset['asset-id'] ?? asset.assetId;
      const amount = asset.amount;
      if (assetId !== undefined && amount !== undefined) {
        assets.set(BigInt(assetId), BigInt(amount));
      }
    }
  }
  
  return { algo, assets };
}

/**
 * Integration tests for WalletSDK.build.usePlugin cost calculation accuracy
 * 
 * These tests verify that expectedCost calculations from build.usePlugin
 * accurately predict the actual on-chain balance changes after execution.
 * 
 * For each scenario, we:
 * 1. Call build.usePlugin to get expectedCost
 * 2. Capture wallet balance BEFORE execution
 * 3. Execute with send()
 * 4. Capture wallet balance AFTER execution
 * 5. Compare actual cost with expectedCost
 */
describe('WalletSDK.build.usePlugin cost accuracy', () => {
  const fixture = algorandFixture();
  
  let walletFactory: WalletFactorySDK;
  let wallet: WalletSDK;
  let payPlugin: PayPluginSDK;
  let optInPlugin: OptInPluginSDK;
  let testCloseOutPlugin: TestCloseOutPluginSDK;
  let testProxyRekeyPlugin: TestProxyRekeyPluginSDK;
  let sender: string;
  let signer: algosdk.TransactionSigner;
  let receiverAddress: string;
  let receiverSigner: algosdk.TransactionSigner;
  let testAssetId: bigint;

  beforeAll(async () => {
    await fixture.beforeEach();
    const { algorand, context: { testAccount } } = fixture;
    
    sender = testAccount.addr.toString();
    signer = testAccount.signer;
    
    // Set network for SDK initialization
    setCurrentNetwork('localnet');
    
    // Get dispenser for funding
    const dispenser = await algorand.account.dispenserFromEnvironment();
    
    // Fund test account generously
    await algorand.account.ensureFunded(testAccount, dispenser, (500).algos());
    
    // Create a separate receiver account for payment tests
    const receiverAccount = algorand.account.random();
    receiverAddress = receiverAccount.addr.toString();
    receiverSigner = receiverAccount.signer;
    await algorand.account.ensureFunded(receiverAccount, dispenser, (10).algos());
    
    // Deploy escrow factory first
    const escrowFactory = await deployEscrowFactory({
      fixture,
      sender,
      signer,
    });
    
    // Deploy minimal DAO for wallet factory
    const dao = await deployAkitaDAO({
      fixture,
      sender,
      signer,
      apps: { escrow: escrowFactory.appId },
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
      }
    });
    
    // Fund wallet factory
    await algorand.account.ensureFunded(walletFactory.client.appAddress, dispenser, (10).algos());
    
    // Create a wallet using factory.new()
    const createWalletCost = await walletFactory.cost();
    await walletFactory.client.appClient.fundAppAccount({ amount: createWalletCost.microAlgo() });
    
    wallet = await walletFactory.new({
      sender,
      signer,
      nickname: 'test-wallet',
    });
    
    // Fund the wallet generously
    await algorand.account.ensureFunded(wallet.client.appAddress, dispenser, (100).algos());
    
    // Deploy pay plugin
    payPlugin = await deployPayPlugin({
      fixture,
      sender,
      signer,
    });
    
    // Deploy opt-in plugin
    optInPlugin = await deployOptInPlugin({
      fixture,
      sender,
      signer,
    });
    
    // Deploy test close-out plugin
    testCloseOutPlugin = await deployTestCloseOutPlugin({
      fixture,
      sender,
      signer,
    });
    
    // Deploy test proxy-rekey plugin
    testProxyRekeyPlugin = await deployTestProxyRekeyPlugin({
      fixture,
      sender,
      signer,
    });
    
    // Install plugins on wallet (global)
    await wallet.addPlugin({
      client: payPlugin,
      global: true,
      sender,
      signer,
    });
    
    await wallet.addPlugin({
      client: optInPlugin,
      global: true,
      sender,
      signer,
    });
    
    await wallet.addPlugin({
      client: testCloseOutPlugin,
      global: true,
      sender,
      signer,
    });
    
    await wallet.addPlugin({
      client: testProxyRekeyPlugin,
      global: true,
      sender,
      signer,
    });
    
    // Create a test asset owned by sender
    const suggestedParams = await algorand.client.algod.getTransactionParams().do();
    const createAssetTxn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      sender,
      total: 1_000_000_000_000n, // 1M tokens with 6 decimals
      decimals: 6,
      defaultFrozen: false,
      unitName: 'TEST',
      assetName: 'Test Asset',
      suggestedParams,
    });
    
    const signedTxn = await signer([createAssetTxn], [0]);
    const { txid } = await algorand.client.algod.sendRawTransaction(signedTxn[0]).do();
    const result = await algosdk.waitForConfirmation(algorand.client.algod, txid, 4);
    testAssetId = BigInt(result.assetIndex!);
    
    // Opt wallet into test asset using the opt-in plugin
    await wallet.usePlugin({
      sender,
      signer,
      global: true,
      calls: [
        optInPlugin.optIn({ assets: [testAssetId] }),
      ],
    });
    
    // Send some test assets to the wallet
    await algorand.send.assetTransfer({
      sender,
      signer,
      receiver: wallet.client.appAddress.toString(),
      assetId: testAssetId,
      amount: 500_000_000_000n, // 500K tokens
    });
    
    // Opt receiver into test asset
    await algorand.send.assetOptIn({
      sender: receiverAddress,
      signer: receiverSigner,
      assetId: testAssetId,
    });
  });

  beforeEach(fixture.newScope);

  describe('ALGO payment cost accuracy', () => {
    test('expectedCost.totalAlgo matches actual wallet ALGO cost for single payment', async () => {
      const paymentAmount = 5_000_000n; // 5 ALGO
      
      // Build to get expected cost
      const buildResult = await wallet.build.usePlugin({
        sender,
        signer,
        lease: 'test_algo_cost_1',
        windowSize: 2000n,
        global: true,
        skipSignatures: false,
        calls: [
          payPlugin.pay({
            payments: [{
              receiver: receiverAddress,
              asset: 0n,
              amount: paymentAmount,
            }],
          }),
        ],
      });
      
      const expectedTotalAlgo = buildResult.expectedCost.totalAlgo;
      const expectedNetworkFees = buildResult.expectedCost.networkFees;
      
      console.log('Expected cost breakdown:', {
        totalAlgo: expectedTotalAlgo,
        networkFees: expectedNetworkFees,
        payments: buildResult.expectedCost.payments,
        subtotals: buildResult.expectedCost.subtotals,
        paymentAmount,
      });
      
      // Get wallet balance BEFORE
      const walletBefore = await getAccountBalances(fixture.algorand.client.algod, wallet.client.appAddress.toString());
      
      // Execute
      await buildResult.send();
      
      // Get wallet balance AFTER
      const walletAfter = await getAccountBalances(fixture.algorand.client.algod, wallet.client.appAddress.toString());
      
      // Calculate actual cost
      const actualAlgoCost = walletBefore.algo - walletAfter.algo;
      
      console.log('Cost comparison:', {
        expectedTotalAlgo,
        actualAlgoCost,
        difference: actualAlgoCost - expectedTotalAlgo,
        missingPaymentAmount: paymentAmount,
      });
      
      // Verify expected matches actual
      // expectedCost.totalAlgo should include: network fees + ALGO payments
      expect(expectedTotalAlgo, 
        `expectedCost.totalAlgo (${expectedTotalAlgo}) should equal actual cost (${actualAlgoCost})`
      ).toBe(actualAlgoCost);
    });

    test('expectedCost.totalAlgo matches actual cost for multiple ALGO payments', async () => {
      const payment1 = 1_000_000n; // 1 ALGO
      const payment2 = 2_000_000n; // 2 ALGO
      
      // Create a second receiver
      const receiver2 = fixture.algorand.account.random();
      const dispenser = await fixture.algorand.account.dispenserFromEnvironment();
      await fixture.algorand.account.ensureFunded(receiver2, dispenser, (1).algos());
      
      // Build to get expected cost
      const buildResult = await wallet.build.usePlugin({
        sender,
        signer,
        lease: 'test_multi_algo_cost',
        windowSize: 2000n,
        global: true,
        skipSignatures: false,
        calls: [
          payPlugin.pay({
            payments: [
              { receiver: receiverAddress, asset: 0n, amount: payment1 },
              { receiver: receiver2.addr.toString(), asset: 0n, amount: payment2 },
            ],
          }),
        ],
      });
      
      const expectedTotalAlgo = buildResult.expectedCost.totalAlgo;
      
      // Get wallet balance BEFORE
      const walletBefore = await getAccountBalances(fixture.algorand.client.algod, wallet.client.appAddress.toString());
      
      // Execute
      await buildResult.send();
      
      // Get wallet balance AFTER
      const walletAfter = await getAccountBalances(fixture.algorand.client.algod, wallet.client.appAddress.toString());
      
      // Calculate actual cost
      const actualAlgoCost = walletBefore.algo - walletAfter.algo;
      
      // Verify expected matches actual
      expect(expectedTotalAlgo).toBe(actualAlgoCost);
      
      // Verify the cost includes both payments
      expect(actualAlgoCost).toBeGreaterThanOrEqual(payment1 + payment2);
    });
  });

  describe('asset transfer cost accuracy', () => {
    test('expectedCost.assets matches actual asset transfer amounts', async () => {
      const assetAmount = 10_000_000n; // 10 tokens
      
      // Build to get expected cost
      const buildResult = await wallet.build.usePlugin({
        sender,
        signer,
        lease: 'test_asset_cost',
        windowSize: 2000n,
        global: true,
        skipSignatures: false,
        calls: [
          payPlugin.pay({
            payments: [{
              receiver: receiverAddress,
              asset: testAssetId,
              amount: assetAmount,
            }],
          }),
        ],
      });
      
      const expectedSubtotals = buildResult.expectedCost.subtotals;
      
      console.log('Expected subtotals:', {
        subtotals: expectedSubtotals,
        payments: buildResult.expectedCost.payments,
        testAssetId,
        assetAmount,
      });
      
      // Get wallet balance BEFORE
      const walletBefore = await getAccountBalances(fixture.algorand.client.algod, wallet.client.appAddress.toString());
      
      // Execute
      await buildResult.send();
      
      // Get wallet balance AFTER
      const walletAfter = await getAccountBalances(fixture.algorand.client.algod, wallet.client.appAddress.toString());
      
      // Calculate actual asset cost
      const walletAssetBefore = walletBefore.assets.get(testAssetId) ?? 0n;
      const walletAssetAfter = walletAfter.assets.get(testAssetId) ?? 0n;
      const actualAssetCost = walletAssetBefore - walletAssetAfter;
      
      // Get expected asset cost from expectedCost.subtotals
      const expectedAssetCost = expectedSubtotals.find(a => a.asset === testAssetId)?.amount ?? 0n;
      
      console.log('Asset cost comparison:', {
        expectedAssetCost,
        actualAssetCost,
        difference: actualAssetCost - expectedAssetCost,
      });
      
      // Verify expected matches actual
      expect(BigInt(expectedAssetCost)).toBe(actualAssetCost);
      expect(actualAssetCost).toBe(assetAmount);
    });

    test('expectedCost includes both ALGO and asset costs for mixed payments', async () => {
      const algoAmount = 2_000_000n; // 2 ALGO
      const assetAmount = 5_000_000n; // 5 tokens
      
      // Build to get expected cost
      const buildResult = await wallet.build.usePlugin({
        sender,
        signer,
        lease: 'test_mixed_cost',
        windowSize: 2000n,
        global: true,
        skipSignatures: false,
        calls: [
          payPlugin.pay({
            payments: [
              { receiver: receiverAddress, asset: 0n, amount: algoAmount },
              { receiver: receiverAddress, asset: testAssetId, amount: assetAmount },
            ],
          }),
        ],
      });
      
      const expectedTotalAlgo = buildResult.expectedCost.totalAlgo;
      const expectedSubtotals = buildResult.expectedCost.subtotals;
      
      // Get wallet balance BEFORE
      const walletBefore = await getAccountBalances(fixture.algorand.client.algod, wallet.client.appAddress.toString());
      
      // Execute
      await buildResult.send();
      
      // Get wallet balance AFTER
      const walletAfter = await getAccountBalances(fixture.algorand.client.algod, wallet.client.appAddress.toString());
      
      // Calculate actual ALGO cost
      const actualAlgoCost = walletBefore.algo - walletAfter.algo;
      
      // Calculate actual asset cost
      const walletAssetBefore = walletBefore.assets.get(testAssetId) ?? 0n;
      const walletAssetAfter = walletAfter.assets.get(testAssetId) ?? 0n;
      const actualAssetCost = walletAssetBefore - walletAssetAfter;
      
      // Verify ALGO expected matches actual
      expect(expectedTotalAlgo).toBe(actualAlgoCost);
      
      // Get expected asset cost from expectedCost.subtotals
      const expectedAssetCost = expectedSubtotals.find(a => a.asset === testAssetId)?.amount ?? 0n;
      
      // Verify asset expected matches actual
      expect(expectedAssetCost).toBe(actualAssetCost);
      expect(actualAssetCost).toBe(assetAmount);
    });
  });

  describe('asset close-out cost accuracy', () => {
    test('expectedCost.subtotals accounts for full balance on close-out', async () => {
      // Create a new asset for this test to avoid interference
      const suggestedParams = await fixture.algorand.client.algod.getTransactionParams().do();
      const createAssetTxn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        sender,
        total: 100_000_000n,
        decimals: 6,
        defaultFrozen: false,
        unitName: 'CLO',
        assetName: 'Close Test Asset',
        suggestedParams,
      });
      
      const signedTxn = await signer([createAssetTxn], [0]);
      const { txid } = await fixture.algorand.client.algod.sendRawTransaction(signedTxn[0]).do();
      const result = await algosdk.waitForConfirmation(fixture.algorand.client.algod, txid, 4);
      const closeTestAssetId = BigInt(result.assetIndex!);
      
      // Opt wallet into the asset
      await wallet.usePlugin({
        sender,
        signer,
        global: true,
        calls: [
          optInPlugin.optIn({ assets: [closeTestAssetId] }),
        ],
      });
      
      // Send assets to the wallet
      const assetAmount = 50_000_000n;
      await fixture.algorand.send.assetTransfer({
        sender,
        signer,
        receiver: wallet.client.appAddress.toString(),
        assetId: closeTestAssetId,
        amount: assetAmount,
      });
      
      // Opt receiver into the asset
      await fixture.algorand.send.assetOptIn({
        sender: receiverAddress,
        signer: receiverSigner,
        assetId: closeTestAssetId,
      });
      
      // Build to get expected cost for close-out
      const buildResult = await wallet.build.usePlugin({
        sender,
        signer,
        lease: 'test_closeout_cost',
        windowSize: 2000n,
        global: true,
        skipSignatures: false,
        calls: [
          testCloseOutPlugin.closeOutAsset({
            asset: closeTestAssetId,
            receiver: receiverAddress,
            assetCloseTo: receiverAddress,
          }),
        ],
      });
      
      const expectedSubtotals = buildResult.expectedCost.subtotals;
      
      // Get wallet balance BEFORE
      const walletBefore = await getAccountBalances(fixture.algorand.client.algod, wallet.client.appAddress.toString());
      const walletAssetBefore = walletBefore.assets.get(closeTestAssetId) ?? 0n;
      
      // Execute
      await buildResult.send();
      
      // Get wallet balance AFTER
      const walletAfter = await getAccountBalances(fixture.algorand.client.algod, wallet.client.appAddress.toString());
      
      // Wallet should no longer have the asset (closed out)
      const walletAssetAfter = walletAfter.assets.get(closeTestAssetId);
      expect(walletAssetAfter).toBeUndefined();
      
      // Get expected asset cost from expectedCost.subtotals
      const expectedAssetCost = expectedSubtotals.find(a => a.asset === closeTestAssetId)?.amount ?? 0n;
      
      // expectedCost should account for the full balance being closed out
      expect(expectedAssetCost).toBe(walletAssetBefore);
    });

    /**
     * ALGO close-out with external controlled address should fail.
     * 
     * When the controlled account is different from the smart contract account,
     * closing out would undo the rekey on the account. The closeRemainderTo
     * operation clears the auth-addr, meaning the wallet would lose control
     * of the external account.
     * 
     * The wallet contract correctly rejects this operation.
     */
    test('ALGO close-out fails for external controlled account (would undo rekey)', async () => {
      // Create a fresh external account that will be controlled by a new wallet
      const externalAccount = fixture.algorand.account.random();
      const externalAddress = externalAccount.addr.toString();
      
      // Fund the external account with ALGO
      const dispenser = await fixture.algorand.account.dispenserFromEnvironment();
      const externalFundAmount = 10_000_000n; // 10 ALGO
      await fixture.algorand.send.payment({
        sender: dispenser.addr,
        signer: dispenser.signer,
        receiver: externalAddress,
        amount: microAlgo(externalFundAmount),
      });
      
      // Create wallet cost payment
      const createWalletCost = await walletFactory.cost();
      await walletFactory.client.appClient.fundAppAccount({ amount: createWalletCost.microAlgo() });
      
      // Create a new wallet with the external account as the controlled address
      const externalControlWallet = await walletFactory.new({
        sender,
        signer,
        nickname: 'external-control-wallet',
        controlledAddress: externalAddress,
      });
      
      // Register the wallet
      await externalControlWallet.register({ sender, signer, escrow: '' });
      
      // Fund the new wallet generously so it can pay for inner transaction fees
      await fixture.algorand.send.payment({
        sender: dispenser.addr,
        signer: dispenser.signer,
        receiver: externalControlWallet.client.appAddress.toString(),
        amount: microAlgo(100_000_000n), // 100 ALGO
      });
      
      // Rekey the external account to the wallet
      await fixture.algorand.send.payment({
        sender: externalAddress,
        signer: externalAccount.signer,
        receiver: externalAddress,
        amount: (0).microAlgo(),
        rekeyTo: externalControlWallet.client.appAddress,
      });
      
      // Add plugin globally (zero address caller)
      await externalControlWallet.addPlugin({
        client: testCloseOutPlugin,
        global: true,
        sender,
        signer,
      });
      
      // Attempting to close out the external controlled account should fail
      // because closeRemainderTo clears the auth-addr (rekey), which would
      // cause the wallet to lose control of the account
      await expect(
        externalControlWallet.build.usePlugin({
          sender,
          signer,
          lease: 'test_external_algo_closeout',
          windowSize: 2000n,
          global: true,
          skipSignatures: false,
          calls: [
            testCloseOutPlugin.closeOutAlgo({
              receiver: receiverAddress,
              amount: 0n,
              closeTo: receiverAddress,
            }),
          ],
        })
      ).rejects.toThrow();
    });

    /**
     * ALGO close-out with escrow should fail.
     * 
     * Escrows are application accounts that are rekeyed to allow the wallet
     * to control them. Closing out an escrow would undo the rekey, similar
     * to external controlled accounts.
     * 
     * The wallet contract correctly rejects this operation.
     */
    test('ALGO close-out fails for escrow (would undo rekey)', async () => {
      // Create an escrow specifically for this test
      const escrowName = 'algoclose';
      
      // Add the test close-out plugin to this escrow (creates the escrow automatically)
      await wallet.addPlugin({
        client: testCloseOutPlugin,
        escrow: escrowName,
        caller: sender,
        sender,
        signer,
      });
      
      // Get escrow info to get the app address
      const escrowInfo = await wallet.getEscrow(escrowName);
      const escrowAddress = algosdk.getApplicationAddress(escrowInfo.id).toString();
      
      // Fund the escrow with ALGO
      const escrowFundAmount = 5_000_000n; // 5 ALGO
      const dispenser = await fixture.algorand.account.dispenserFromEnvironment();
      await fixture.algorand.send.payment({
        sender: dispenser.addr,
        signer: dispenser.signer,
        receiver: escrowAddress,
        amount: microAlgo(escrowFundAmount),
      });
      
      // Attempting to close out the escrow should fail because
      // closeRemainderTo would undo the rekey on the escrow account
      await expect(
        wallet.build.usePlugin({
          sender,
          signer,
          lease: 'test_escrow_algo_closeout',
          windowSize: 2000n,
          escrow: escrowName,
          skipSignatures: false,
          calls: [
            testCloseOutPlugin.closeOutAlgo({
              receiver: receiverAddress,
              amount: 0n,
              closeTo: receiverAddress,
            }),
          ],
        })
      ).rejects.toThrow();
    });
  });

  describe('double rekey cost accuracy', () => {
    test('expectedCost.totalAlgo matches actual cost for proxy ALGO payment', async () => {
      const paymentAmount = 1_000_000n; // 1 ALGO
      
      // Build to get expected cost
      const buildResult = await wallet.build.usePlugin({
        sender,
        signer,
        lease: 'test_proxy_algo_cost',
        windowSize: 2000n,
        global: true,
        skipSignatures: false,
        calls: [
          testProxyRekeyPlugin.proxyPay({
            payPlugin: payPlugin.appId,
            receiver: receiverAddress,
            asset: 0n,
            amount: paymentAmount,
          }),
        ],
      });
      
      const expectedTotalAlgo = buildResult.expectedCost.totalAlgo;
      const expectedNetworkFees = buildResult.expectedCost.networkFees;
      
      console.log('Proxy ALGO payment cost breakdown:', {
        expectedTotalAlgo,
        expectedNetworkFees,
        paymentAmount,
      });
      
      // Get wallet balance BEFORE
      const walletBefore = await getAccountBalances(fixture.algorand.client.algod, wallet.client.appAddress.toString());
      
      // Execute
      await buildResult.send();
      
      // Get wallet balance AFTER
      const walletAfter = await getAccountBalances(fixture.algorand.client.algod, wallet.client.appAddress.toString());
      
      // Calculate actual ALGO spent
      const actualAlgoCost = walletBefore.algo - walletAfter.algo;
      
      console.log('Proxy ALGO payment comparison:', {
        expectedTotalAlgo,
        actualAlgoCost,
        paymentAmount,
      });
      
      // Verify network fees account for multiple inner transactions
      // Proxy plugin does: 1 rekey payment + 1 abiCall to PayPlugin + PayPlugin inner payment
      expect(expectedNetworkFees, 
        'Network fees should account for inner transactions'
      ).toBeGreaterThan(1000n);
      
      // expectedCost.totalAlgo should match actual ALGO spent
      expect(expectedTotalAlgo).toBe(actualAlgoCost);
    });

    test('expectedCost.subtotals matches actual cost for proxy ASA payment', async () => {
      const assetAmount = 2_000_000n; // 2 units of test asset
      
      // Build to get expected cost
      const buildResult = await wallet.build.usePlugin({
        sender,
        signer,
        lease: 'test_proxy_asa_cost',
        windowSize: 2000n,
        global: true,
        skipSignatures: false,
        calls: [
          testProxyRekeyPlugin.proxyPay({
            payPlugin: payPlugin.appId,
            receiver: receiverAddress,
            asset: testAssetId,
            amount: assetAmount,
          }),
        ],
      });
      
      const expectedSubtotals = buildResult.expectedCost.subtotals;
      const expectedNetworkFees = buildResult.expectedCost.networkFees;
      
      // Get expected asset cost from subtotals
      const expectedAssetCost = expectedSubtotals.find(s => s.asset === testAssetId)?.amount ?? 0n;
      
      console.log('Proxy ASA payment cost breakdown:', {
        expectedAssetCost,
        expectedNetworkFees,
        assetAmount,
      });
      
      // Get wallet balance BEFORE
      const walletBefore = await getAccountBalances(fixture.algorand.client.algod, wallet.client.appAddress.toString());
      const walletAssetBefore = walletBefore.assets.get(testAssetId) ?? 0n;
      
      // Execute
      await buildResult.send();
      
      // Get wallet balance AFTER
      const walletAfter = await getAccountBalances(fixture.algorand.client.algod, wallet.client.appAddress.toString());
      const walletAssetAfter = walletAfter.assets.get(testAssetId) ?? 0n;
      
      // Calculate actual asset spent
      const actualAssetCost = walletAssetBefore - walletAssetAfter;
      
      console.log('Proxy ASA payment comparison:', {
        expectedAssetCost,
        actualAssetCost,
        assetAmount,
      });
      
      // Verify network fees account for multiple inner transactions
      expect(expectedNetworkFees, 
        'Network fees should account for inner transactions'
      ).toBeGreaterThan(1000n);
      
      // expectedCost.subtotals should match actual asset spent
      expect(expectedAssetCost).toBe(actualAssetCost);
    });
  });
});
