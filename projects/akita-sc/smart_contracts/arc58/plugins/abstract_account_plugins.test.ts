import { Config, microAlgo } from '@algorandfoundation/algokit-utils';
import { registerDebugEventHandlers } from '@algorandfoundation/algokit-utils-debug';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { newWallet, OptInPluginSDK, PayPluginSDK, WalletFactorySDK, WalletSDK } from 'akita-sdk/wallet';
import { ALGORAND_ZERO_ADDRESS_STRING } from 'algosdk';
import { deployAbstractedAccountFactory } from '../../../tests/fixtures/abstracted-account';
import { deployAkitaDAO } from '../../../tests/fixtures/dao';
import { deployEscrowFactory } from '../../../tests/fixtures/escrow';
import { deployOptInPlugin } from '../../../tests/fixtures/plugins/optin';
import { deployPayPlugin } from '../../../tests/fixtures/plugins/pay';
import { ERR_PLUGIN_DOES_NOT_EXIST } from '../account/errors';

/**
 * Abstracted Account Plugin Tests
 *
 * Tests for adding, removing, and using plugins with ARC58 abstracted accounts.
 * Covers:
 * - Named plugins (referenced by string name)
 * - Global plugins (any caller can trigger)
 * - Caller-specific plugins (only specific caller can trigger)
 * - Plugin permissions and restrictions
 */
describe('Abstracted Account Plugins', () => {
  const localnet = algorandFixture();

  /** the wallet factory contract sdk */
  let walletFactory: WalletFactorySDK;
  /** the wallet sdk */
  let wallet: WalletSDK;
  /** the opt-in plugin sdk */
  let optInPluginSdk: OptInPluginSDK;
  /** the pay plugin sdk */
  let payPluginSdk: PayPluginSDK;
  /** test asset for opt-in tests */
  let testAsset: bigint;

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

    // Deploy plugins
    optInPluginSdk = await deployOptInPlugin({ fixture: localnet, sender, signer });
    payPluginSdk = await deployPayPlugin({ fixture: localnet, sender, signer });

    // Create a test asset
    const assetResult = await algorand.send.assetCreate({
      sender,
      total: 1_000_000_000_000n,
      decimals: 6,
      defaultFrozen: false,
      assetName: 'Test Asset',
      unitName: 'TEST',
    });
    testAsset = BigInt(assetResult.confirmation.assetIndex!);
  });

  beforeEach(async () => {
    await localnet.newScope();
    const {
      algorand,
      context: { testAccount },
    } = localnet;
    const sender = testAccount.toString();
    const signer = testAccount.signer;

    const dispenser = await algorand.account.dispenserFromEnvironment();
    await algorand.account.ensureFunded(sender, dispenser, (100).algos());

    wallet = await newWallet({
      factoryParams: {
        appId: walletFactory.appId,
        defaultSender: sender,
        defaultSigner: signer,
      },
      readerAccount: sender,
      algorand,
      nickname: 'test_wallet',
    });

    // Fund the wallet with some ALGO
    await wallet.client.appClient.fundAppAccount({
      amount: (5).algos(),
    });
  });

  // ==================================================================================
  // Adding Plugins
  // ==================================================================================

  describe('Adding Plugins', () => {
    test('add global plugin OK', async () => {
      const mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n });
      await wallet.client.appClient.fundAppAccount({ amount: microAlgo(mbr.plugins) });

      await wallet.addPlugin({
        client: payPluginSdk,
        global: true,
      });

      const plugins = await wallet.getPlugins();
      expect(plugins.size).toBe(1);

      // Verify the plugin is registered
      const pluginKey = `${payPluginSdk.appId}${ALGORAND_ZERO_ADDRESS_STRING}`;
      expect(plugins.has({ plugin: payPluginSdk.appId, caller: ALGORAND_ZERO_ADDRESS_STRING, escrow: '' })).toBe(true);
    });

    test('add named plugin OK', async () => {
      const mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n });
      await wallet.client.appClient.fundAppAccount({ amount: microAlgo(mbr.plugins + mbr.namedPlugins) });

      await wallet.addPlugin({
        client: payPluginSdk,
        global: true,
        name: 'payments',
      });

      const namedPlugins = await wallet.getNamedPlugins();
      expect(namedPlugins.has('payments')).toBe(true);
      expect(namedPlugins.get('payments')?.plugin).toBe(payPluginSdk.appId);
    });

    test('add caller-specific plugin OK', async () => {
      const {
        context: { generateAccount },
      } = localnet;

      const allowedCaller = await generateAccount({ initialFunds: (10).algos() });

      const mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n });
      await wallet.client.appClient.fundAppAccount({ amount: microAlgo(mbr.plugins) });

      await wallet.addPlugin({
        client: payPluginSdk,
        global: false,
        caller: allowedCaller.toString(),
      });

      const plugins = await wallet.getPlugins();
      expect(plugins.size).toBe(1);

      // Verify the plugin is registered with the specific caller
      expect(plugins.has({ plugin: payPluginSdk.appId, caller: allowedCaller.toString(), escrow: '' })).toBe(true);
    });

    test('add multiple plugins OK', async () => {
      const mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n });
      // Fund for two plugins
      await wallet.client.appClient.fundAppAccount({ amount: microAlgo(mbr.plugins * 2n) });

      await wallet.addPlugin({
        client: payPluginSdk,
        global: true,
      });

      await wallet.addPlugin({
        client: optInPluginSdk,
        global: true,
      });

      const plugins = await wallet.getPlugins();
      expect(plugins.size).toBe(2);
    });
  });

  // ==================================================================================
  // Using Plugins
  // ==================================================================================

  describe('Using Plugins', () => {
    test('use global plugin OK', async () => {
      const {
        algorand,
        context: { generateAccount },
      } = localnet;

      const mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n });
      await wallet.client.appClient.fundAppAccount({ amount: microAlgo(mbr.plugins) });

      await wallet.addPlugin({
        client: payPluginSdk,
        global: true,
      });

      // Create a receiver account
      const receiver = await generateAccount({ initialFunds: (1).algos() });
      const receiverInfoBefore = await algorand.account.getInformation(receiver.toString());

      const paymentAmount = 500_000n;

      // Use the pay plugin to send ALGO
      await wallet.usePlugin({
        global: true,
        calls: [
          payPluginSdk.pay({
            payments: [
              {
                receiver: receiver.toString(),
                asset: 0n, // ALGO
                amount: paymentAmount,
              },
            ],
          }),
        ],
      });

      // Verify the payment was made
      const receiverInfoAfter = await algorand.account.getInformation(receiver.toString());
      expect(receiverInfoAfter.balance.microAlgos - receiverInfoBefore.balance.microAlgos).toBe(paymentAmount);
    });

    test('use opt-in plugin to opt into asset OK', async () => {
      const { algorand } = localnet;

      const mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n });
      await wallet.client.appClient.fundAppAccount({ amount: microAlgo(mbr.plugins) });

      await wallet.addPlugin({
        client: optInPluginSdk,
        global: true,
      });

      // Use the opt-in plugin
      await wallet.usePlugin({
        global: true,
        calls: [optInPluginSdk.optIn({ assets: [testAsset] })],
      });

      // Verify the wallet is opted into the asset
      const walletInfo = await algorand.account.getInformation(wallet.client.appAddress);
      expect(walletInfo.assets?.length).toBe(1);
      expect(walletInfo.assets?.[0].assetId).toBe(testAsset);
    });

    test('caller-specific plugin only works for allowed caller', async () => {
      const {
        algorand,
        context: { generateAccount },
      } = localnet;

      const allowedCaller = await generateAccount({ initialFunds: (10).algos() });
      const notAllowedCaller = await generateAccount({ initialFunds: (10).algos() });

      const mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n });
      await wallet.client.appClient.fundAppAccount({ amount: microAlgo(mbr.plugins) });

      // Add plugin with specific caller
      await wallet.addPlugin({
        client: optInPluginSdk,
        global: false,
        caller: allowedCaller.toString(),
      });

      // Try to use plugin from non-allowed caller - should fail because plugin doesn't exist for this caller
      let error = 'no error thrown';
      try {
        await wallet.usePlugin({
          global: false,
          sender: notAllowedCaller.toString(),
          signer: notAllowedCaller.signer,
          calls: [optInPluginSdk.optIn({ assets: [testAsset] })],
        });
      } catch (e: any) {
        error = e.message;
      }

      // The error can be either from SDK (box not found) or contract (plugin does not exist)
      expect(error).not.toBe('no error thrown');

      // Verify the allowed caller CAN use the plugin
      await wallet.usePlugin({
        global: false,
        sender: allowedCaller.toString(),
        signer: allowedCaller.signer,
        calls: [optInPluginSdk.optIn({ assets: [testAsset] })],
      });

      // Verify the wallet is opted into the asset
      const walletInfo = await algorand.account.getInformation(wallet.client.appAddress);
      expect(walletInfo.assets?.length).toBe(1);
      expect(walletInfo.assets?.[0].assetId).toBe(testAsset);
    });

    test('use named plugin OK', async () => {
      const {
        algorand,
        context: { generateAccount },
      } = localnet;

      const mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n });
      await wallet.client.appClient.fundAppAccount({ amount: microAlgo(mbr.plugins + mbr.namedPlugins) });

      await wallet.addPlugin({
        client: payPluginSdk,
        global: true,
        name: 'payments',
      });

      // Create a receiver
      const receiver = await generateAccount({ initialFunds: (1).algos() });
      const receiverInfoBefore = await algorand.account.getInformation(receiver.toString());

      const paymentAmount = 250_000n;

      // Use the named plugin (usePlugin with name parameter)
      await wallet.usePlugin({
        name: 'payments',
        global: true,
        calls: [
          payPluginSdk.pay({
            payments: [
              {
                receiver: receiver.toString(),
                asset: 0n,
                amount: paymentAmount,
              },
            ],
          }),
        ],
      });

      // Verify the payment
      const receiverInfoAfter = await algorand.account.getInformation(receiver.toString());
      expect(receiverInfoAfter.balance.microAlgos - receiverInfoBefore.balance.microAlgos).toBe(paymentAmount);
    });
  });

  // ==================================================================================
  // Removing Plugins
  // ==================================================================================

  describe('Removing Plugins', () => {
    test('remove plugin OK', async () => {
      const mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n });
      await wallet.client.appClient.fundAppAccount({ amount: microAlgo(mbr.plugins) });

      await wallet.addPlugin({
        client: payPluginSdk,
        global: true,
      });

      let plugins = await wallet.getPlugins();
      expect(plugins.size).toBe(1);

      // Remove the plugin
      await wallet.removePlugin({
        plugin: payPluginSdk.appId,
        caller: ALGORAND_ZERO_ADDRESS_STRING,
        escrow: '',
      });

      plugins = await wallet.getPlugins();
      expect(plugins.size).toBe(0);
    });

    test('remove caller-specific plugin OK', async () => {
      const {
        context: { generateAccount, testAccount },
      } = localnet;
      const sender = testAccount.toString();

      const allowedCaller = await generateAccount({ initialFunds: (10).algos() });

      const mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n });
      await wallet.client.appClient.fundAppAccount({ amount: microAlgo(mbr.plugins) });

      await wallet.addPlugin({
        client: payPluginSdk,
        global: false,
        caller: allowedCaller.toString(),
      });

      let plugins = await wallet.getPlugins();
      expect(plugins.size).toBe(1);

      // Remove the plugin
      await wallet.removePlugin({
        plugin: payPluginSdk.appId,
        caller: allowedCaller.toString(),
        escrow: '',
      });

      plugins = await wallet.getPlugins();
      expect(plugins.size).toBe(0);
    });

    test('cannot use removed plugin', async () => {
      const mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n });
      await wallet.client.appClient.fundAppAccount({ amount: microAlgo(mbr.plugins) });

      await wallet.addPlugin({
        client: payPluginSdk,
        global: true,
      });

      // Remove the plugin
      await wallet.removePlugin({
        plugin: payPluginSdk.appId,
        caller: ALGORAND_ZERO_ADDRESS_STRING,
        escrow: '',
      });

      // Try to use the removed plugin
      let error = 'no error thrown';
      try {
        await wallet.usePlugin({
          global: true,
          calls: [
            payPluginSdk.pay({
              payments: [
                {
                  receiver: wallet.client.appAddress.toString(),
                  asset: 0n,
                  amount: 100n,
                },
              ],
            }),
          ],
        });
      } catch (e: any) {
        error = e.message;
      }

      expect(error).toContain(ERR_PLUGIN_DOES_NOT_EXIST);
    });
  });

  // ==================================================================================
  // Plugin State
  // ==================================================================================

  describe('Plugin State', () => {
    test('getPlugins returns correct plugin info', async () => {
      const mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n });
      await wallet.client.appClient.fundAppAccount({ amount: microAlgo(mbr.plugins) });

      await wallet.addPlugin({
        client: payPluginSdk,
        global: true,
      });

      const plugins = await wallet.getPlugins();
      const pluginKey = { plugin: payPluginSdk.appId, caller: ALGORAND_ZERO_ADDRESS_STRING, escrow: '' };
      const pluginInfo = plugins.get(pluginKey);

      expect(pluginInfo).toBeDefined();
      expect(pluginInfo?.admin).toBe(false);
    });

    test('getNamedPlugins returns correct info', async () => {
      const mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n });
      await wallet.client.appClient.fundAppAccount({ amount: microAlgo(mbr.plugins + mbr.namedPlugins) });

      await wallet.addPlugin({
        client: payPluginSdk,
        global: true,
        name: 'myPlugin',
      });

      const namedPlugins = await wallet.getNamedPlugins();
      const pluginKey = namedPlugins.get('myPlugin');

      expect(pluginKey).toBeDefined();
      expect(pluginKey?.plugin).toBe(payPluginSdk.appId);
    });
  });

  // ==================================================================================
  // MBR Calculations
  // ==================================================================================

  describe('MBR Calculations', () => {
    test('min balance increases after adding plugin', async () => {
      const { algorand } = localnet;

      const walletInfoBefore = await algorand.account.getInformation(wallet.client.appAddress);
      const minBalanceBefore = walletInfoBefore.minBalance.microAlgos;

      const mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n });
      await wallet.client.appClient.fundAppAccount({ amount: microAlgo(mbr.plugins) });

      await wallet.addPlugin({
        client: payPluginSdk,
        global: true,
      });

      const walletInfoAfter = await algorand.account.getInformation(wallet.client.appAddress);
      // Min balance should have increased due to plugin box storage
      expect(walletInfoAfter.minBalance.microAlgos).toBeGreaterThan(minBalanceBefore);
    });

    test('named plugin requires additional MBR', async () => {
      const mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n });

      // Named plugin requires extra MBR for the name box
      expect(mbr.namedPlugins).toBeGreaterThan(0n);

      // Regular plugin MBR
      expect(mbr.plugins).toBeGreaterThan(0n);
    });
  });
});
