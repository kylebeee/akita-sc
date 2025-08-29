import { Config, microAlgo } from '@algorandfoundation/algokit-utils'
import { registerDebugEventHandlers } from '@algorandfoundation/algokit-utils-debug'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { ALGORAND_ZERO_ADDRESS_STRING } from 'algosdk'
import { describe, test, beforeAll, beforeEach, expect } from '@jest/globals';
import { newWallet, WalletFactorySDK, WalletSDK } from 'akita-sdk'
import { deployAbstractedAccountFactoryAndEscrowFactory } from '../../../../tests/fixtures/abstracted-account'
import { deployAsaMintPlugin } from '../../../../tests/fixtures/plugins/asa-mint'
import { deployAkitaDAO } from '../../../../tests/fixtures/dao';

describe('Asa Mint plugin contract', () => {
  const localnet = algorandFixture();

  /** the wallet factory contract sdk */
  let walletFactory: WalletFactorySDK;
  /** the wallet sdk */
  let wallet: WalletSDK;

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

    const dao = await deployAkitaDAO({
      fixture: localnet,
      sender,
      signer,
      apps: {}
    })

    walletFactory = (
      await deployAbstractedAccountFactoryAndEscrowFactory({
        fixture: localnet,
        sender,
        signer,
        args: {
          akitaDao: dao.appId,
        }
      })
    ).abstractAccountFactory;

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
  })

  beforeEach(localnet.newScope)

  describe('AsaMint', () => {
    test('mint OK', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const asaMintSdk = await deployAsaMintPlugin({ fixture: localnet, sender, signer })

      const mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n })

      let walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos)

      const fundAmount = mbr.plugins

      console.log('funding wallet with:', fundAmount, 'microAlgos')

      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(fundAmount)
      })

      await wallet.addPlugin({
        client: asaMintSdk,
        global: true,
      });

      walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos)

      const results = await wallet.usePlugin({
        global: true,
        calls: [
          asaMintSdk.mint({
            assets: [{
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
            }]
          }),
        ]
      })

      const takta = results.returns[1][0]

      expect(takta).toBeGreaterThan(0n)

      expect(results.txIds.length).toBe(4)

      const plugins = await wallet.getPlugins()
      expect(plugins.size).toBe(1)

      walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo?.assets?.length).toBe(1)
    })
  })
})
