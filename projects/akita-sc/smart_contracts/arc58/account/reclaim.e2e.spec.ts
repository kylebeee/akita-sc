import { Config, microAlgo } from '@algorandfoundation/algokit-utils';
import { registerDebugEventHandlers } from '@algorandfoundation/algokit-utils-debug';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { AkitaDaoSDK } from 'akita-sdk/dao';
import { newWallet, OptInPluginSDK, PayPluginSDK, WalletFactorySDK, WalletSDK } from 'akita-sdk/wallet';
import { ALGORAND_ZERO_ADDRESS_STRING, getApplicationAddress } from 'algosdk';
import { buildAkitaUniverse } from '../../../tests/fixtures/dao';
import { deployOptInPlugin } from '../../../tests/fixtures/plugins/optin';
import { deployPayPlugin } from '../../../tests/fixtures/plugins/pay';
import {
  ERR_ESCROW_DOES_NOT_EXIST,
  ERR_FORBIDDEN,
  ERR_PLUGIN_DOES_NOT_EXIST,
} from './errors';

describe('ARC58 Reclaim', () => {
  const localnet = algorandFixture();

  let dao: AkitaDaoSDK;
  let walletFactory: WalletFactorySDK;
  let wallet: WalletSDK;
  let payPluginSdk: PayPluginSDK;
  let optInPluginSdk: OptInPluginSDK;

  beforeAll(async () => {
    Config.configure({ debug: true });
    registerDebugEventHandlers();

    await localnet.newScope();
    const { algorand, context: { testAccount } } = localnet;
    const sender = testAccount.toString();
    const signer = testAccount.signer;

    ({ dao, walletFactory } = await buildAkitaUniverse({
      fixture: localnet,
      sender,
      signer,
      apps: {},
    }));

    payPluginSdk = await deployPayPlugin({ fixture: localnet, sender, signer });
    optInPluginSdk = await deployOptInPlugin({ fixture: localnet, sender, signer });
  });

  beforeEach(async () => {
    await localnet.newScope();
    const { algorand, context: { testAccount } } = localnet;
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
  });

  // ==================================================================================
  // Admin Reclaim Tests (arc58_reclaim)
  // ==================================================================================

  describe('arc58_reclaim (Admin)', () => {
    test('admin can reclaim ALGO from escrow', async () => {
      const { algorand, context: { testAccount } } = localnet;
      const sender = testAccount.toString();

      const escrow = 'reclaim_algo';
      const mbr = await wallet.getMbr({ escrow, methodCount: 0n, plugin: '', groups: 0n });

      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(mbr.plugins + mbr.newEscrowMintCost),
      });

      await wallet.addPlugin({
        client: payPluginSdk,
        global: true,
        escrow,
      });

      const escrowInfo = await wallet.getEscrow(escrow);
      const escrowAddress = getApplicationAddress(escrowInfo.id).toString();

      const reclaimAmount = 1_000_000n;
      await algorand.send.payment({
        sender,
        receiver: escrowAddress,
        amount: microAlgo(reclaimAmount),
      });

      const walletBefore = await algorand.account.getInformation(wallet.client.appAddress);

      await wallet.client.send.arc58Reclaim({
        sender,
        extraFee: microAlgo(1_000n),
        args: {
          escrow,
          reclaims: [[0n, reclaimAmount, false]],
        },
      });

      const walletAfter = await algorand.account.getInformation(wallet.client.appAddress);
      expect(walletAfter.balance.microAlgos).toBe(
        walletBefore.balance.microAlgos + reclaimAmount
      );
    });

    test('non-admin cannot reclaim', async () => {
      const { context: { testAccount, generateAccount } } = localnet;
      const sender = testAccount.toString();

      const escrow = 'reclaim_nonadmin';
      const mbr = await wallet.getMbr({ escrow, methodCount: 0n, plugin: '', groups: 0n });

      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(mbr.plugins + mbr.newEscrowMintCost),
      });

      await wallet.addPlugin({
        client: payPluginSdk,
        global: true,
        escrow,
      });

      const attacker = await generateAccount({ initialFunds: (10).algos() });

      let error = 'no error thrown';
      try {
        await wallet.client.send.arc58Reclaim({
          sender: attacker.toString(),
          signer: attacker.signer,
          extraFee: microAlgo(1_000n),
          args: {
            escrow,
            reclaims: [[0n, 0n, false]],
          },
        });
      } catch (e: any) {
        error = e.message;
      }

      expect(error).toContain(ERR_FORBIDDEN);
    });

    test('fails for non-existent escrow', async () => {
      const { context: { testAccount } } = localnet;
      const sender = testAccount.toString();

      let error = 'no error thrown';
      try {
        await wallet.client.send.arc58Reclaim({
          sender,
          extraFee: microAlgo(1_000n),
          args: {
            escrow: 'does_not_exist',
            reclaims: [[0n, 0n, false]],
          },
        });
      } catch (e: any) {
        error = e.message;
      }

      expect(error).toContain(ERR_ESCROW_DOES_NOT_EXIST);
    });
  });

  // ==================================================================================
  // Plugin Reclaim Tests (arc58_pluginReclaim)
  // ==================================================================================

  describe('arc58_pluginReclaim', () => {
    test('global plugin with canReclaim=true can reclaim ALGO', async () => {
      const { algorand, context: { testAccount } } = localnet;
      const sender = testAccount.toString();

      const escrow = 'plugin_reclaim';
      const mbr = await wallet.getMbr({ escrow, methodCount: 0n, plugin: '', groups: 0n });

      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(mbr.plugins + mbr.newEscrowMintCost),
      });

      await wallet.addPlugin({
        client: payPluginSdk,
        global: true,
        escrow,
        canReclaim: true,
      });

      const escrowInfo = await wallet.getEscrow(escrow);
      const escrowAddress = getApplicationAddress(escrowInfo.id).toString();

      const reclaimAmount = 1_000_000n;
      await algorand.send.payment({
        sender,
        receiver: escrowAddress,
        amount: microAlgo(reclaimAmount),
      });

      const walletBefore = await algorand.account.getInformation(wallet.client.appAddress);

      await wallet.client.send.arc58PluginReclaim({
        sender,
        extraFee: microAlgo(1_000n),
        args: {
          plugin: payPluginSdk.appId,
          caller: ALGORAND_ZERO_ADDRESS_STRING,
          escrow,
          reclaims: [[0n, reclaimAmount, false]],
        },
      });

      const walletAfter = await algorand.account.getInformation(wallet.client.appAddress);
      expect(walletAfter.balance.microAlgos).toBe(
        walletBefore.balance.microAlgos + reclaimAmount
      );
    });

    test('caller-specific plugin can reclaim', async () => {
      const { algorand, context: { testAccount } } = localnet;
      const sender = testAccount.toString();

      const escrow = 'caller_reclaim';
      const mbr = await wallet.getMbr({ escrow, methodCount: 0n, plugin: '', groups: 0n });

      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(mbr.plugins + mbr.newEscrowMintCost),
      });

      await wallet.addPlugin({
        client: payPluginSdk,
        caller: sender,
        escrow,
        canReclaim: true,
      });

      const escrowInfo = await wallet.getEscrow(escrow);
      const escrowAddress = getApplicationAddress(escrowInfo.id).toString();

      const reclaimAmount = 1_000_000n;
      await algorand.send.payment({
        sender,
        receiver: escrowAddress,
        amount: microAlgo(reclaimAmount),
      });

      const walletBefore = await algorand.account.getInformation(wallet.client.appAddress);

      await wallet.client.send.arc58PluginReclaim({
        sender,
        extraFee: microAlgo(1_000n),
        args: {
          plugin: payPluginSdk.appId,
          caller: sender,
          escrow,
          reclaims: [[0n, reclaimAmount, false]],
        },
      });

      const walletAfter = await algorand.account.getInformation(wallet.client.appAddress);
      expect(walletAfter.balance.microAlgos).toBe(
        walletBefore.balance.microAlgos + reclaimAmount
      );
    });

    test('fails when canReclaim=false', async () => {
      const { context: { testAccount } } = localnet;
      const sender = testAccount.toString();

      const escrow = 'no_reclaim';
      const mbr = await wallet.getMbr({ escrow, methodCount: 0n, plugin: '', groups: 0n });

      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(mbr.plugins + mbr.newEscrowMintCost),
      });

      await wallet.addPlugin({
        client: payPluginSdk,
        global: true,
        escrow,
        canReclaim: false,
      });

      let error = 'no error thrown';
      try {
        await wallet.client.send.arc58PluginReclaim({
          sender,
          extraFee: microAlgo(1_000n),
          args: {
            plugin: payPluginSdk.appId,
            caller: ALGORAND_ZERO_ADDRESS_STRING,
            escrow,
            reclaims: [[0n, 0n, false]],
          },
        });
      } catch (e: any) {
        error = e.message;
      }

      expect(error).toContain(ERR_FORBIDDEN);
    });

    test('fails for non-existent plugin', async () => {
      const { context: { testAccount } } = localnet;
      const sender = testAccount.toString();

      const escrow = 'orphan_escrow';
      const mbr = await wallet.getMbr({ escrow, methodCount: 0n, plugin: '', groups: 0n });

      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(mbr.plugins + mbr.newEscrowMintCost),
      });

      // Add plugin as global to create the escrow
      await wallet.addPlugin({
        client: payPluginSdk,
        global: true,
        escrow,
      });

      let error = 'no error thrown';
      try {
        // Use sender as caller — this plugin key was never registered
        await wallet.client.send.arc58PluginReclaim({
          sender,
          extraFee: microAlgo(1_000n),
          args: {
            plugin: payPluginSdk.appId,
            caller: sender,
            escrow,
            reclaims: [[0n, 0n, false]],
          },
        });
      } catch (e: any) {
        error = e.message;
      }

      expect(error).toContain(ERR_PLUGIN_DOES_NOT_EXIST);
    });

    test('fails for unauthorized sender', async () => {
      const { context: { testAccount, generateAccount } } = localnet;
      const sender = testAccount.toString();

      const escrow = 'unauth_reclaim';
      const mbr = await wallet.getMbr({ escrow, methodCount: 0n, plugin: '', groups: 0n });

      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(mbr.plugins + mbr.newEscrowMintCost),
      });

      // Add plugin with specific caller (sender)
      await wallet.addPlugin({
        client: payPluginSdk,
        caller: sender,
        escrow,
        canReclaim: true,
      });

      // Try to call from a different account
      const attacker = await generateAccount({ initialFunds: (10).algos() });

      let error = 'no error thrown';
      try {
        await wallet.client.send.arc58PluginReclaim({
          sender: attacker.toString(),
          signer: attacker.signer,
          extraFee: microAlgo(1_000n),
          args: {
            plugin: payPluginSdk.appId,
            caller: sender,
            escrow,
            reclaims: [[0n, 0n, false]],
          },
        });
      } catch (e: any) {
        error = e.message;
      }

      expect(error).toContain(ERR_FORBIDDEN);
    });
  });

  // ==================================================================================
  // ASA Reclaim & CloseOut Tests
  // ==================================================================================

  describe('ASA Reclaim & CloseOut', () => {

    /**
     * Helper: sets up a wallet with optInPlugin + payPlugin (with escrow),
     * creates a test ASA, opts the wallet and escrow into it, and sends ASA to the escrow.
     */
    async function setupAsaEscrow(opts: {
      escrow: string;
      canReclaim?: boolean;
      global?: boolean;
      caller?: string;
    }) {
      const { algorand, context: { testAccount } } = localnet;
      const sender = testAccount.toString();

      const { escrow, canReclaim = true, global: isGlobal = true, caller } = opts;

      const escrowMbr = await wallet.getMbr({ escrow, methodCount: 0n, plugin: '', groups: 0n });
      const noEscrowMbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n });

      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(
          escrowMbr.plugins + escrowMbr.newEscrowMintCost +
          noEscrowMbr.plugins +
          escrowMbr.allowances + // MBR for the asset allowance on the escrow
          500_000n // buffer for wallet asset opt-in MBR & fees
        ),
      });

      // Install optInPlugin (global, no escrow) to opt wallet into ASAs
      await wallet.addPlugin({
        client: optInPluginSdk,
        global: true,
      });

      // Install payPlugin with escrow
      const pluginOpts: any = {
        client: payPluginSdk,
        escrow,
        canReclaim,
      };
      if (isGlobal) {
        pluginOpts.global = true;
      } else {
        pluginOpts.caller = caller;
      }
      await wallet.addPlugin(pluginOpts);

      // Create a test ASA
      const assetCreateResult = await algorand.send.assetCreate({
        sender,
        total: 1_000_000n,
        decimals: 0,
        assetName: `Test ${escrow}`,
        unitName: 'TRCL',
      });
      const testAssetId = BigInt(assetCreateResult.confirmation.assetIndex!);
      const asaAmount = 100_000n;

      // Add allowance for the test ASA on the escrow (required before escrow opt-in)
      await wallet.addAllowances({
        escrow,
        allowances: [{
          asset: testAssetId,
          type: 'flat',
          amount: asaAmount,
        }],
      });

      // Opt wallet into ASA via optInPlugin
      await wallet.usePlugin({
        global: true,
        calls: [
          optInPluginSdk.optIn({ assets: [testAssetId] }),
        ],
      });

      // Get escrow address and fund it for asset opt-in MBR
      const escrowInfo = await wallet.getEscrow(escrow);
      const escrowAddress = getApplicationAddress(escrowInfo.id).toString();

      await algorand.send.payment({
        sender,
        receiver: escrowAddress,
        amount: microAlgo(200_000n),
      });

      // Opt escrow into ASA (2 inner txns: payment + asset transfer)
      await wallet.client.send.arc58OptInEscrow({
        sender,
        extraFee: microAlgo(2_000n),
        args: {
          escrow,
          assets: [testAssetId],
        },
      });

      // Send ASA to escrow
      await algorand.send.assetTransfer({
        sender,
        receiver: escrowAddress,
        assetId: testAssetId,
        amount: asaAmount,
      });

      return { testAssetId, asaAmount, escrowAddress, escrowInfo };
    }

    test('admin can reclaim ASA with closeOut', async () => {
      const { algorand, context: { testAccount } } = localnet;
      const sender = testAccount.toString();

      const escrow = 'asa_reclaim';
      const { testAssetId, asaAmount, escrowAddress } = await setupAsaEscrow({ escrow });

      await wallet.client.send.arc58Reclaim({
        sender,
        extraFee: microAlgo(1_000n),
        args: {
          escrow,
          reclaims: [[testAssetId, asaAmount, true]],
        },
      });

      // Wallet should have received the ASA
      const walletAssets = (await algorand.account.getInformation(wallet.client.appAddress)).assets ?? [];
      const walletAsset = walletAssets.find(a => a.assetId === testAssetId);
      expect(walletAsset).toBeDefined();
      expect(walletAsset!.amount).toBe(asaAmount);

      // Escrow should no longer hold the ASA (closed out)
      const escrowAssets = (await algorand.account.getInformation(escrowAddress)).assets ?? [];
      const escrowAsset = escrowAssets.find(a => a.assetId === testAssetId);
      expect(escrowAsset).toBeUndefined();
    });

    test('pluginReclaim closeOut allowed when escrow is unlocked', async () => {
      const { algorand, context: { testAccount } } = localnet;
      const sender = testAccount.toString();

      const escrow = 'unlocked_closeout';
      const { testAssetId, asaAmount, escrowAddress } = await setupAsaEscrow({ escrow });

      // Escrow is unlocked by default — closeOut should work
      await wallet.client.send.arc58PluginReclaim({
        sender,
        extraFee: microAlgo(1_000n),
        args: {
          plugin: payPluginSdk.appId,
          caller: ALGORAND_ZERO_ADDRESS_STRING,
          escrow,
          reclaims: [[testAssetId, asaAmount, true]],
        },
      });

      // Wallet should have received the ASA
      const walletAssets = (await algorand.account.getInformation(wallet.client.appAddress)).assets ?? [];
      const walletAsset = walletAssets.find(a => a.assetId === testAssetId);
      expect(walletAsset).toBeDefined();
      expect(walletAsset!.amount).toBe(asaAmount);

      // Escrow should no longer hold the ASA (closed out)
      const escrowAssets = (await algorand.account.getInformation(escrowAddress)).assets ?? [];
      const escrowAsset = escrowAssets.find(a => a.assetId === testAssetId);
      expect(escrowAsset).toBeUndefined();
    });

    test('pluginReclaim closeOut blocked when escrow is locked', async () => {
      const { algorand, context: { testAccount } } = localnet;
      const sender = testAccount.toString();

      const escrow = 'locked_closeout';
      const { testAssetId, asaAmount, escrowAddress } = await setupAsaEscrow({ escrow });

      // Lock the escrow
      await wallet.toggleEscrowLock({ escrow });

      // Plugin reclaim with closeOut=true — should be blocked due to lock
      await wallet.client.send.arc58PluginReclaim({
        sender,
        extraFee: microAlgo(1_000n),
        args: {
          plugin: payPluginSdk.appId,
          caller: ALGORAND_ZERO_ADDRESS_STRING,
          escrow,
          reclaims: [[testAssetId, asaAmount, true]],
        },
      });

      // Wallet should have received the ASA
      const walletAssets = (await algorand.account.getInformation(wallet.client.appAddress)).assets ?? [];
      const walletAsset = walletAssets.find(a => a.assetId === testAssetId);
      expect(walletAsset).toBeDefined();
      expect(walletAsset!.amount).toBe(asaAmount);

      // Escrow should still be opted in (closeOut was blocked)
      const escrowAssets = (await algorand.account.getInformation(escrowAddress)).assets ?? [];
      const escrowAsset = escrowAssets.find(a => a.assetId === testAssetId);
      expect(escrowAsset).toBeDefined();
      expect(escrowAsset!.amount).toBe(0n);
    });
  });
});
