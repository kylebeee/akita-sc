import { Config } from '@algorandfoundation/algokit-utils'
import { registerDebugEventHandlers } from '@algorandfoundation/algokit-utils-debug'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import algosdk, { Address, ALGORAND_ZERO_ADDRESS_STRING } from 'algosdk'
import { describe, test, beforeAll, beforeEach, expect } from '@jest/globals';
import { OptInPluginFactory } from '../../../artifacts/arc58/plugins/optin/OptInPluginClient'
import { newWallet, OptinPluginSDK, WalletFactorySDK } from 'akita-sdk'
import { deployAbstractedAccountFactoryAndEscrowFactory } from '../../../../tests/fixtures/abstracted-account'
import { deployTokenMintPlugin} from '../../../../tests/fixtures/plugins/token-mint'
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount';

describe('Optin plugin contract', () => {
  const localnet = algorandFixture();
  
  // let aaFactory: WalletFactorySDK;

  beforeAll(async () => {
    Config.configure({
      debug: true,
      // traceAll: true,
    })
    registerDebugEventHandlers()
  })

  beforeEach(localnet.newScope)

  const deploy = async (account: Address) => {
    const { algorand } = localnet
    const factory = algorand.client.getTypedAppFactory(OptInPluginFactory, {
      defaultSender: account,
    })

    const { appClient: client } = await factory.deploy({
      onUpdate: 'append',
      onSchemaBreak: 'append',
    })

    return new OptinPluginSDK({ algorand, factoryParams: { appId: client.appId } })
  }

  describe('Optin', () => {
    test('optin OK', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const { aaFactory } = await deployAbstractedAccountFactoryAndEscrowFactory({ fixture: localnet, sender, signer });
      const wallet = await newWallet({ factoryParams: { appId: aaFactory.appId, defaultSender: sender, defaultSigner: signer }, readerAccount: sender, algorand, nickname: 'test_wallet', sender, signer })
      const tokenMintSdk = await deployTokenMintPlugin({ fixture: localnet, sender, signer })
      // const optinSdk = await deploy(testAccount)

      const mbr = await wallet.getMbr({ escrow: '', methodCount: 1n, plugin: '' })

      console.log('mbr:', mbr)

      let walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos)

      await wallet.client.appClient.fundAppAccount({ amount: new AlgoAmount({ microAlgo: mbr.plugins }) })

      await wallet.addPlugin({
        client: tokenMintSdk,
        global: true,
        methods: [
          { name: tokenMintSdk.mint(), cooldown: 0n }
        ]
      });

      // const plugins = await wallet.client.algorand.client.algod.getApplicationBoxes(wallet.appId).do()
      // const plugin = await wallet.client.algorand.client.algod.getApplicationBoxByName(wallet.appId, plugins.boxes[0].name).do()
      const plugins = await wallet.getPlugins()
      console.log('plugins:', plugins)

      // walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      // expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos)

      const { returns } = await wallet.usePlugin({
        global: true,
        calls: [
          tokenMintSdk.mint({
            assetName: 'Test Akita',
            unitName: 'TAKTA',
            total: 1_000_000_000_000n,
            decimals: 6n,
            manager: sender,
            reserve: sender,
            freeze: ALGORAND_ZERO_ADDRESS_STRING,
            clawback: ALGORAND_ZERO_ADDRESS_STRING,
            defaultFrozen: false,
            url: 'https://akita.community',
          }),
        ]
      })

      const akta = returns[2]
      console.log('returns 2:', akta)

      // await wallet.addPlugin({
      //   sender,
      //   signer,
      //   client: optinSdk,
      //   global: true,
      // })

      // await wallet.usePlugin({
      //   sender,
      //   signer,
      //   client: optinSdk,
      //   global: true,
      //   calls: [
      //     optinSdk.optin({
      //       sender,
      //       signer,
      //       assets: [akta]
      //     })
      //   ]
      // })

      expect(returns.length).toBe(4)
      // expect that our plugin list is now 2 instead of 1
      // expect that the account has 100_000 more microalgos      
      // expect its opted into our test asset
    })
  })
})
