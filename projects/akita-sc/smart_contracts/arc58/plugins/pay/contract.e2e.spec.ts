import { Config, microAlgo } from '@algorandfoundation/algokit-utils';
import { registerDebugEventHandlers } from '@algorandfoundation/algokit-utils-debug';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { newWallet, WalletFactorySDK, WalletSDK, AsaMintPluginSDK } from 'akita-sdk';
import { ALGORAND_ZERO_ADDRESS_STRING } from 'algosdk';
import { deployAbstractedAccountFactory } from '../../../../tests/fixtures/abstracted-account';
import { deployAkitaDAO } from '../../../../tests/fixtures/dao';
import { deployEscrowFactory } from '../../../../tests/fixtures/escrow';
import { deployPayPlugin } from '../../../../tests/fixtures/plugins/pay';
import { deployAsaMintPlugin } from '../../../../tests/fixtures/plugins/asa-mint';

describe('Pay plugin contract', () => {
  const localnet = algorandFixture();

  /** the wallet factory contract sdk */
  let walletFactory: WalletFactorySDK;
  /** the wallet sdk */
  let wallet: WalletSDK;
  /** the asa mint plugin sdk (for creating test assets) */
  let asaMintSdk: AsaMintPluginSDK;

  beforeAll(async () => {
    Config.configure({
      debug: true,
      // traceAll: true,
    })
    registerDebugEventHandlers()

    await localnet.newScope();
    const { algorand, context: { testAccount } } = localnet
    const sender = testAccount.toString()
    const signer = testAccount.signer

    const dispenser = await algorand.account.dispenserFromEnvironment();
    await algorand.account.ensureFunded(sender, dispenser, (100).algos());

    const dao = await deployAkitaDAO({
      fixture: localnet,
      sender,
      signer,
      apps: {}
    })

    const escrowFactory = await deployEscrowFactory({
      fixture: localnet,
      sender,
      signer,
    })

    walletFactory = (
      await deployAbstractedAccountFactory({
        fixture: localnet,
        sender,
        signer,
        args: {
          akitaDao: dao.appId,
          escrowFactory: escrowFactory.appId,
        }
      })
    );

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
    })

    // Deploy AsaMintPlugin for creating test assets
    asaMintSdk = await deployAsaMintPlugin({ fixture: localnet, sender, signer })

    // Add AsaMint plugin to wallet for creating test assets
    const mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n })
    await wallet.client.appClient.fundAppAccount({ amount: microAlgo(mbr.plugins) })
    await wallet.addPlugin({ client: asaMintSdk, global: true })
  })

  beforeEach(localnet.newScope)

  describe('Pay', () => {
    test('pay ALGO OK', async () => {
      const { algorand, context: { testAccount, generateAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Create a receiver account
      const receiver = await generateAccount({ initialFunds: (1).algos() })

      const payPluginSdk = await deployPayPlugin({ fixture: localnet, sender, signer })

      const mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n })

      await wallet.client.appClient.fundAppAccount({ amount: microAlgo(mbr.plugins) })

      await wallet.addPlugin({
        client: payPluginSdk,
        global: true,
      })

      // Fund the wallet with extra ALGO to send
      const paymentAmount = 1_000_000n // 1 ALGO
      await wallet.client.appClient.fundAppAccount({ amount: microAlgo(Number(paymentAmount)) })

      const walletInfoBefore = await algorand.account.getInformation(wallet.client.appAddress)
      const receiverInfoBefore = await algorand.account.getInformation(receiver.toString())

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
      })

      const walletInfoAfter = await algorand.account.getInformation(wallet.client.appAddress)
      const receiverInfoAfter = await algorand.account.getInformation(receiver.toString())

      // Verify the payment was made
      expect(receiverInfoAfter.balance.microAlgos - receiverInfoBefore.balance.microAlgos).toBe(paymentAmount)

      // Verify wallet balance decreased (by payment + fees)
      expect(walletInfoBefore.balance.microAlgos - walletInfoAfter.balance.microAlgos).toBeGreaterThanOrEqual(paymentAmount)

      expect(results.txIds.length).toBeGreaterThan(0)

      const plugins = await wallet.getPlugins()
      expect(plugins.size).toBe(2) // AsaMint + Pay plugins
    })

    test('pay ASA OK', async () => {
      const { algorand, context: { testAccount, generateAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

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
      })

      const assetId = mintResults.returns[1][0]
      expect(assetId).toBeGreaterThan(0n)

      // Create and fund a receiver account
      const receiver = await generateAccount({ initialFunds: (1).algos() })

      // Opt the receiver into the asset
      await algorand.send.assetOptIn({
        sender: receiver.toString(),
        signer: receiver.signer,
        assetId,
      })

      // Deploy pay plugin
      const payPluginSdk = await deployPayPlugin({ fixture: localnet, sender, signer })

      const mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n })
      await wallet.client.appClient.fundAppAccount({ amount: microAlgo(mbr.plugins) })

      await wallet.addPlugin({
        client: payPluginSdk,
        global: true,
      })

      // Get asset balance before
      const receiverInfoBefore = await algorand.account.getInformation(receiver.toString())
      const receiverAssetBefore = receiverInfoBefore.assets?.find(a => a.assetId === assetId)
      expect(receiverAssetBefore?.amount).toBe(0n)

      const paymentAmount = 100_000_000n // 100 tokens (with 6 decimals)

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
      })

      // Verify the ASA payment was made
      const receiverInfoAfter = await algorand.account.getInformation(receiver.toString())
      const receiverAssetAfter = receiverInfoAfter.assets?.find(a => a.assetId === assetId)
      expect(receiverAssetAfter?.amount).toBe(paymentAmount)

      expect(results.txIds.length).toBeGreaterThan(0)
    })

    test('pay multiple payments OK', async () => {
      const { algorand, context: { testAccount, generateAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      // Create multiple receiver accounts
      const receiver1 = await generateAccount({ initialFunds: (1).algos() })
      const receiver2 = await generateAccount({ initialFunds: (1).algos() })

      const payPluginSdk = await deployPayPlugin({ fixture: localnet, sender, signer })

      const mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n })
      await wallet.client.appClient.fundAppAccount({ amount: microAlgo(mbr.plugins) })

      await wallet.addPlugin({
        client: payPluginSdk,
        global: true,
      })

      // Fund the wallet with extra ALGO to send
      const paymentAmount1 = 500_000n // 0.5 ALGO
      const paymentAmount2 = 750_000n // 0.75 ALGO
      await wallet.client.appClient.fundAppAccount({ amount: microAlgo(Number(paymentAmount1 + paymentAmount2)) })

      const receiver1InfoBefore = await algorand.account.getInformation(receiver1.toString())
      const receiver2InfoBefore = await algorand.account.getInformation(receiver2.toString())

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
      })

      const receiver1InfoAfter = await algorand.account.getInformation(receiver1.toString())
      const receiver2InfoAfter = await algorand.account.getInformation(receiver2.toString())

      // Verify both payments were made
      expect(receiver1InfoAfter.balance.microAlgos - receiver1InfoBefore.balance.microAlgos).toBe(paymentAmount1)
      expect(receiver2InfoAfter.balance.microAlgos - receiver2InfoBefore.balance.microAlgos).toBe(paymentAmount2)

      expect(results.txIds.length).toBeGreaterThan(0)
    })

    test('pay mixed ALGO and ASA OK', async () => {
      const { algorand, context: { testAccount, generateAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

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
      })

      const assetId = mintResults.returns[1][0]

      // Create and fund a receiver account
      const receiver = await generateAccount({ initialFunds: (1).algos() })

      // Opt the receiver into the asset
      await algorand.send.assetOptIn({
        sender: receiver.toString(),
        signer: receiver.signer,
        assetId,
      })

      // Deploy pay plugin
      const payPluginSdk = await deployPayPlugin({ fixture: localnet, sender, signer })

      const mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n })
      await wallet.client.appClient.fundAppAccount({ amount: microAlgo(mbr.plugins) })

      await wallet.addPlugin({
        client: payPluginSdk,
        global: true,
      })

      const algoAmount = 500_000n // 0.5 ALGO
      const asaAmount = 50_000_000n // 50 tokens

      // Fund the wallet with extra ALGO to send
      await wallet.client.appClient.fundAppAccount({ amount: microAlgo(Number(algoAmount)) })

      const receiverInfoBefore = await algorand.account.getInformation(receiver.toString())
      const receiverAssetBefore = receiverInfoBefore.assets?.find(a => a.assetId === assetId)

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
      })

      const receiverInfoAfter = await algorand.account.getInformation(receiver.toString())
      const receiverAssetAfter = receiverInfoAfter.assets?.find(a => a.assetId === assetId)

      // Verify ALGO payment
      expect(receiverInfoAfter.balance.microAlgos - receiverInfoBefore.balance.microAlgos).toBe(algoAmount)

      // Verify ASA payment
      expect(receiverAssetAfter?.amount).toBe(asaAmount + (receiverAssetBefore?.amount ?? 0n))

      expect(results.txIds.length).toBeGreaterThan(0)
    })
  })
})

