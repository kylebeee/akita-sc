import * as algokit from '@algorandfoundation/algokit-utils';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { SigningAccount, TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { AsaMintPluginSDK, newWallet, PayPluginSDK, WalletSDK } from 'akita-sdk/wallet';
import algosdk, { ALGORAND_ZERO_ADDRESS_STRING, makeBasicAccountTransactionSigner } from 'algosdk';
import { AkitaUniverse, buildAkitaUniverse } from '../../../../tests/fixtures/dao';

algokit.Config.configure({ populateAppCallResources: true });

const fixture = algorandFixture();

describe('Pay plugin contract', () => {
  let deployer: algosdk.Account;
  let user: algosdk.Account;
  let akitaUniverse: AkitaUniverse;
  let dispenser: algosdk.Address & TransactionSignerAccount & { account: SigningAccount };
  let algorand: import('@algorandfoundation/algokit-utils').AlgorandClient;
  let wallet: WalletSDK;
  let asaMintSdk: AsaMintPluginSDK;
  let payPluginSdk: PayPluginSDK;

  beforeAll(async () => {
    await fixture.beforeEach();
    algorand = fixture.context.algorand;
    dispenser = await algorand.account.dispenserFromEnvironment();

    const ctx = fixture.context;
    deployer = await ctx.generateAccount({ initialFunds: algokit.microAlgos(2_000_000_000) });
    user = await ctx.generateAccount({ initialFunds: algokit.microAlgos(500_000_000) });

    await algorand.account.ensureFunded(deployer.addr, dispenser, (2000).algo());
    await algorand.account.ensureFunded(user.addr, dispenser, (500).algo());

    // Build the full Akita DAO universe
    akitaUniverse = await buildAkitaUniverse({
      fixture,
      sender: deployer.addr,
      signer: makeBasicAccountTransactionSigner(deployer),
      apps: {},
    });

    // Create a user wallet for testing
    wallet = await newWallet({
      algorand,
      factoryParams: {
        appId: akitaUniverse.walletFactory.appId,
        defaultSender: user.addr,
        defaultSigner: makeBasicAccountTransactionSigner(user),
      },
      sender: user.addr,
      signer: makeBasicAccountTransactionSigner(user),
      nickname: 'Test Wallet',
    });

    // Get plugin SDKs from universe
    asaMintSdk = akitaUniverse.asaMintPlugin;
    payPluginSdk = akitaUniverse.payPlugin;

    // Fund wallet and add both plugins once
    const mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n });
    await wallet.client.appClient.fundAppAccount({ amount: algokit.microAlgo(mbr.plugins * 2n + 10_000_000n) });
    await wallet.addPlugin({ client: asaMintSdk, global: true });
    await wallet.addPlugin({ client: payPluginSdk, global: true });
  });

  beforeEach(fixture.newScope);

  describe('Pay', () => {
    test('pay ALGO OK', async () => {
      // Create a receiver account
      const receiver = await fixture.context.generateAccount({ initialFunds: (1).algos() });

      // Fund the wallet with extra ALGO to send
      const paymentAmount = 1_000_000n; // 1 ALGO
      await wallet.client.appClient.fundAppAccount({ amount: algokit.microAlgo(Number(paymentAmount)) });

      const walletInfoBefore = await algorand.account.getInformation(wallet.client.appAddress);
      const receiverInfoBefore = await algorand.account.getInformation(receiver.toString());

      const results = await wallet.usePlugin({
        global: true,
        calls: [
          payPluginSdk.pay({
            payments: [{
              receiver: receiver.toString(),
              asset: 0n, // 0 = ALGO
              amount: paymentAmount,
            }]
          }),
        ]
      });

      const walletInfoAfter = await algorand.account.getInformation(wallet.client.appAddress);
      const receiverInfoAfter = await algorand.account.getInformation(receiver.toString());

      // Verify the payment was made
      expect(receiverInfoAfter.balance.microAlgos - receiverInfoBefore.balance.microAlgos).toBe(paymentAmount);

      // Verify wallet balance decreased (by payment + fees)
      expect(walletInfoBefore.balance.microAlgos - walletInfoAfter.balance.microAlgos).toBeGreaterThanOrEqual(paymentAmount);

      expect(results.txIds.length).toBeGreaterThan(0);

      const plugins = await wallet.getPlugins();
      expect(plugins.size).toBe(2); // AsaMint + Pay plugins
    });

    test('pay ASA OK', async () => {
      // First, mint an ASA using the AsaMint plugin
      const mintResults = await wallet.usePlugin({
        global: true,
        calls: [
          asaMintSdk.mint({
            assets: [{
              assetName: 'Test Token',
              unitName: 'TEST',
              total: 1_000_000_000_000n,
              decimals: 6n,
              manager: wallet.client.appAddress.toString(),
              reserve: wallet.client.appAddress.toString(),
              freeze: ALGORAND_ZERO_ADDRESS_STRING,
              clawback: ALGORAND_ZERO_ADDRESS_STRING,
              defaultFrozen: false,
              url: 'https://test.token',
            }]
          }),
        ]
      });

      const assetId = mintResults.returns[1][0];
      expect(assetId).toBeGreaterThan(0n);

      // Create and fund a receiver account
      const receiver = await fixture.context.generateAccount({ initialFunds: (1).algos() });

      // Opt the receiver into the asset
      await algorand.send.assetOptIn({
        sender: receiver.toString(),
        signer: receiver.signer,
        assetId,
      });

      // Get asset balance before
      const receiverInfoBefore = await algorand.account.getInformation(receiver.toString());
      const receiverAssetBefore = receiverInfoBefore.assets?.find(a => a.assetId === assetId);
      expect(receiverAssetBefore?.amount).toBe(0n);

      const paymentAmount = 100_000_000n; // 100 tokens (with 6 decimals)

      const results = await wallet.usePlugin({
        global: true,
        calls: [
          payPluginSdk.pay({
            payments: [{
              receiver: receiver.toString(),
              asset: assetId,
              amount: paymentAmount,
            }]
          }),
        ]
      });

      // Verify the ASA payment was made
      const receiverInfoAfter = await algorand.account.getInformation(receiver.toString());
      const receiverAssetAfter = receiverInfoAfter.assets?.find(a => a.assetId === assetId);
      expect(receiverAssetAfter?.amount).toBe(paymentAmount);

      expect(results.txIds.length).toBeGreaterThan(0);
    });

    test('pay multiple payments OK', async () => {
      // Create multiple receiver accounts
      const receiver1 = await fixture.context.generateAccount({ initialFunds: (1).algos() });
      const receiver2 = await fixture.context.generateAccount({ initialFunds: (1).algos() });

      // Fund the wallet with extra ALGO to send
      const paymentAmount1 = 500_000n; // 0.5 ALGO
      const paymentAmount2 = 750_000n; // 0.75 ALGO
      await wallet.client.appClient.fundAppAccount({ amount: algokit.microAlgo(Number(paymentAmount1 + paymentAmount2)) });

      const receiver1InfoBefore = await algorand.account.getInformation(receiver1.toString());
      const receiver2InfoBefore = await algorand.account.getInformation(receiver2.toString());

      const results = await wallet.usePlugin({
        global: true,
        calls: [
          payPluginSdk.pay({
            payments: [
              {
                receiver: receiver1.toString(),
                asset: 0n,
                amount: paymentAmount1,
              },
              {
                receiver: receiver2.toString(),
                asset: 0n,
                amount: paymentAmount2,
              }
            ]
          }),
        ]
      });

      const receiver1InfoAfter = await algorand.account.getInformation(receiver1.toString());
      const receiver2InfoAfter = await algorand.account.getInformation(receiver2.toString());

      // Verify both payments were made
      expect(receiver1InfoAfter.balance.microAlgos - receiver1InfoBefore.balance.microAlgos).toBe(paymentAmount1);
      expect(receiver2InfoAfter.balance.microAlgos - receiver2InfoBefore.balance.microAlgos).toBe(paymentAmount2);

      expect(results.txIds.length).toBeGreaterThan(0);
    });

    test('pay mixed ALGO and ASA OK', async () => {
      // First, mint an ASA using the AsaMint plugin
      const mintResults = await wallet.usePlugin({
        global: true,
        calls: [
          asaMintSdk.mint({
            assets: [{
              assetName: 'Mixed Test Token',
              unitName: 'MIX',
              total: 1_000_000_000_000n,
              decimals: 6n,
              manager: wallet.client.appAddress.toString(),
              reserve: wallet.client.appAddress.toString(),
              freeze: ALGORAND_ZERO_ADDRESS_STRING,
              clawback: ALGORAND_ZERO_ADDRESS_STRING,
              defaultFrozen: false,
              url: 'https://mixed.token',
            }]
          }),
        ]
      });

      const assetId = mintResults.returns[1][0];

      // Create and fund a receiver account
      const receiver = await fixture.context.generateAccount({ initialFunds: (1).algos() });

      // Opt the receiver into the asset
      await algorand.send.assetOptIn({
        sender: receiver.toString(),
        signer: receiver.signer,
        assetId,
      });

      const algoAmount = 500_000n; // 0.5 ALGO
      const asaAmount = 50_000_000n; // 50 tokens

      // Fund the wallet with extra ALGO to send
      await wallet.client.appClient.fundAppAccount({ amount: algokit.microAlgo(Number(algoAmount)) });

      const receiverInfoBefore = await algorand.account.getInformation(receiver.toString());
      const receiverAssetBefore = receiverInfoBefore.assets?.find(a => a.assetId === assetId);

      const results = await wallet.usePlugin({
        global: true,
        calls: [
          payPluginSdk.pay({
            payments: [
              {
                receiver: receiver.toString(),
                asset: 0n, // ALGO
                amount: algoAmount,
              },
              {
                receiver: receiver.toString(),
                asset: assetId, // ASA
                amount: asaAmount,
              }
            ]
          }),
        ]
      });

      const receiverInfoAfter = await algorand.account.getInformation(receiver.toString());
      const receiverAssetAfter = receiverInfoAfter.assets?.find(a => a.assetId === assetId);

      // Verify ALGO payment
      expect(receiverInfoAfter.balance.microAlgos - receiverInfoBefore.balance.microAlgos).toBe(algoAmount);

      // Verify ASA payment
      expect(receiverAssetAfter?.amount).toBe(asaAmount + (receiverAssetBefore?.amount ?? 0n));

      expect(results.txIds.length).toBeGreaterThan(0);
    });
  });
});
