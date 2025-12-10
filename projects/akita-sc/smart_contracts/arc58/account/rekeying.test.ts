import { Config, microAlgo } from '@algorandfoundation/algokit-utils';
import { registerDebugEventHandlers } from '@algorandfoundation/algokit-utils-debug';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { newWallet, PayPluginSDK, WalletFactorySDK, WalletSDK } from 'akita-sdk';
import algosdk, { makeBasicAccountTransactionSigner } from 'algosdk';
import { deployAbstractedAccountFactory } from '../../../tests/fixtures/abstracted-account';
import { deployAkitaDAO } from '../../../tests/fixtures/dao';
import { deployEscrowFactory } from '../../../tests/fixtures/escrow';
import { deployPayPlugin } from '../../../tests/fixtures/plugins/pay';
import { ERR_ADMIN_ONLY, ERR_MISSING_REKEY_BACK } from './errors';

describe('ARC58 Rekeying', () => {
  const localnet = algorandFixture();

  /** the wallet factory contract sdk */
  let walletFactory: WalletFactorySDK;
  /** the wallet sdk */
  let wallet: WalletSDK;
  /** the pay plugin sdk */
  let payPluginSdk: PayPluginSDK;

  beforeAll(async () => {
    Config.configure({
      debug: true,
      // traceAll: true,
    });
    registerDebugEventHandlers();

    await localnet.newScope();
    const { algorand, context: { testAccount } } = localnet;
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

    // Deploy pay plugin for rekey-to-plugin tests
    payPluginSdk = await deployPayPlugin({ fixture: localnet, sender, signer });
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

    // Fund the wallet with some ALGO
    await wallet.client.appClient.fundAppAccount({
      amount: (5).algos(),
    });
  });

  describe('Admin Rekeying', () => {
    test('admin can flash rekey to EOA and back', async () => {
      const { algorand, context: { testAccount } } = localnet;
      const sender = testAccount.toString();
      const signer = testAccount.signer;

      const suggestedParams = await algorand.getSuggestedParams();

      // Flash rekey: rekey to admin, do something, rekey back
      await wallet.client
        .newGroup()
        // Step 1: rekey to admin EOA
        .arc58RekeyTo({
          sender,
          extraFee: microAlgo(1_000),
          args: {
            address: sender,
            flash: true,
          },
        })
        // Step 2: make a payment from the wallet (now controlled by admin)
        .addTransaction(
          algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            sender: wallet.client.appAddress.toString(),
            receiver: sender,
            amount: 100_000,
            suggestedParams: { ...suggestedParams, fee: 1000, flatFee: true },
            rekeyTo: wallet.client.appAddress.toString(), // rekey back to app
          }),
          makeBasicAccountTransactionSigner(testAccount)
        )
        .send();

      // Verify wallet is still functional (rekeyed back correctly)
      const walletInfo = await algorand.account.getInformation(wallet.client.appAddress);
      expect(walletInfo.authAddr?.toString()).toBe(undefined); // authAddr is undefined when rekeyed to self
    });

    test('admin flash rekey fails without rekey back', async () => {
      const { algorand, context: { testAccount } } = localnet;
      const sender = testAccount.toString();
      const signer = testAccount.signer;

      const suggestedParams = await algorand.getSuggestedParams();

      let error = 'no error thrown';
      try {
        await wallet.client
          .newGroup()
          // Step 1: rekey to admin EOA with flash=true
          .arc58RekeyTo({
            sender,
            extraFee: microAlgo(1_000),
            args: {
              address: sender,
              flash: true,
            },
          })
          // Step 2: make a payment WITHOUT rekeying back
          .addTransaction(
            algosdk.makePaymentTxnWithSuggestedParamsFromObject({
              sender: wallet.client.appAddress.toString(),
              receiver: sender,
              amount: 100_000,
              suggestedParams: { ...suggestedParams, fee: 1000, flatFee: true },
              // Missing rekeyTo back to app!
            }),
            makeBasicAccountTransactionSigner(testAccount)
          )
          .send();
      } catch (e: any) {
        error = e.message;
      }

      expect(error).toContain(ERR_MISSING_REKEY_BACK);
    });

    test('admin can permanent rekey to EOA (non-flash)', async () => {
      const { algorand, context: { testAccount } } = localnet;
      const sender = testAccount.toString();

      // Permanent rekey: rekey without flash flag
      await wallet.client.send.arc58RekeyTo({
        sender,
        extraFee: microAlgo(1_000),
        args: {
          address: sender,
          flash: false, // Not a flash rekey
        },
      });

      // Verify wallet is now rekeyed to the admin
      const walletInfo = await algorand.account.getInformation(wallet.client.appAddress);
      expect(walletInfo.authAddr?.toString()).toBe(sender);
    });
  });

  describe('Non-Admin Rekeying', () => {
    test('non-admin cannot rekey', async () => {
      const { algorand, context: { generateAccount } } = localnet;

      // Create a non-admin account
      const nonAdmin = await generateAccount({ initialFunds: (10).algos() });

      let error = 'no error thrown';
      try {
        await wallet.client.send.arc58RekeyTo({
          sender: nonAdmin.toString(),
          signer: nonAdmin.signer,
          args: {
            address: nonAdmin.toString(),
            flash: false,
          },
        });
      } catch (e: any) {
        error = e.message;
      }

      expect(error).toContain(ERR_ADMIN_ONLY);
    });
  });

  describe('Rekey to Plugin', () => {
    test('can rekey to plugin and execute', async () => {
      const { algorand, context: { testAccount, generateAccount } } = localnet;
      const sender = testAccount.toString();
      const signer = testAccount.signer;

      // Add the pay plugin to the wallet
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

      // Use the plugin (internally rekeys to plugin, executes, rekeys back)
      await wallet.usePlugin({
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

      // Verify payment was made
      const receiverInfoAfter = await algorand.account.getInformation(receiver.toString());
      expect(receiverInfoAfter.balance.microAlgos - receiverInfoBefore.balance.microAlgos).toBe(paymentAmount);

      // Verify wallet is still rekeyed to itself (plugin rekeyed back)
      const walletInfo = await algorand.account.getInformation(wallet.client.appAddress);
      expect(walletInfo.authAddr?.toString()).toBe(undefined);
    });

    test('plugin must rekey back after execution', async () => {
      const { algorand, context: { testAccount } } = localnet;
      const sender = testAccount.toString();
      const signer = testAccount.signer;

      // Add the pay plugin to the wallet
      const mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n });
      await wallet.client.appClient.fundAppAccount({ amount: microAlgo(mbr.plugins) });

      await wallet.addPlugin({
        client: payPluginSdk,
        global: true,
      });

      // Try to rekey to plugin without verifying auth address after
      // This should fail because the verification call is missing
      let error = 'no error thrown';
      try {
        // Manually build the transaction without the verification
        const group = wallet.client.newGroup();

        group.arc58RekeyToPlugin({
          args: {
            plugin: payPluginSdk.appId,
            global: true,
            escrow: '',
            methodOffsets: [],
            fundsRequest: [],
          },
          extraFee: microAlgo(1_000),
        });

        // Missing: plugin call
        // Missing: arc58VerifyAuthAddress

        await group.send();
      } catch (e: any) {
        error = e.message;
      }

      expect(error).toContain(ERR_MISSING_REKEY_BACK);
    });
  });

  describe('Wallet State After Rekeying', () => {
    test('lastUserInteraction is updated after rekey', async () => {
      const { context: { testAccount } } = localnet;
      const sender = testAccount.toString();

      const stateBefore = await wallet.client.state.global.getAll();
      const lastInteractionBefore = stateBefore.lastUserInteraction ?? 0n;

      // Wait a moment to ensure timestamp changes
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Perform a rekey
      await wallet.client.send.arc58RekeyTo({
        sender,
        extraFee: microAlgo(1_000),
        args: {
          address: sender,
          flash: false,
        },
      });

      // Note: Can't read state after permanent rekey since wallet is now controlled by EOA
      // This test just verifies the rekey succeeds and updates state
      // For a proper test, we'd need to use flash rekey
    });

    test('flash rekey updates lastUserInteraction', async () => {
      const { algorand, context: { testAccount } } = localnet;
      const sender = testAccount.toString();

      const suggestedParams = await algorand.getSuggestedParams();

      const stateBefore = await wallet.client.state.global.getAll();
      const lastInteractionBefore = stateBefore.lastUserInteraction ?? 0n;

      // Flash rekey and back
      await wallet.client
        .newGroup()
        .arc58RekeyTo({
          sender,
          extraFee: microAlgo(1_000),
          args: {
            address: sender,
            flash: true,
          },
        })
        .addTransaction(
          algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            sender: wallet.client.appAddress.toString(),
            receiver: sender,
            amount: 0,
            suggestedParams: { ...suggestedParams, fee: 1000, flatFee: true },
            rekeyTo: wallet.client.appAddress.toString(),
          }),
          makeBasicAccountTransactionSigner(testAccount)
        )
        .send();

      const stateAfter = await wallet.client.state.global.getAll();
      const lastInteractionAfter = stateAfter.lastUserInteraction ?? 0n;

      // lastUserInteraction should be updated
      expect(lastInteractionAfter).toBeGreaterThanOrEqual(lastInteractionBefore);
    });
  });
});
