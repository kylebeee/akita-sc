import { Config, microAlgo } from '@algorandfoundation/algokit-utils';
import { registerDebugEventHandlers } from '@algorandfoundation/algokit-utils-debug';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { Address, ALGORAND_ZERO_ADDRESS_STRING, getApplicationAddress } from 'algosdk';

import { newWallet, OptInPluginSDK, WalletFactorySDK } from 'akita-sdk';
import { deployAbstractedAccountFactory } from '../../../../tests/fixtures/abstracted-account';
import { deployAkitaDAO } from '../../../../tests/fixtures/dao';
import { deployEscrowFactory } from '../../../../tests/fixtures/escrow';
import { deployAsaMintPlugin } from '../../../../tests/fixtures/plugins/asa-mint';
import { OptInPluginFactory } from '../../../artifacts/arc58/plugins/optin/OptInPluginClient';

describe('Optin plugin contract', () => {
  const localnet = algorandFixture();

  /** the wallet factory contract sdk */
  let walletFactory: WalletFactorySDK;


  beforeAll(async () => {
    Config.configure({
      debug: true,
      // traceAll: true,
    })
    registerDebugEventHandlers()

    await localnet.newScope();
    const { context: { testAccount } } = localnet
    const sender = testAccount.toString()
    const signer = testAccount.signer

    const dao = await deployAkitaDAO({
      fixture: localnet,
      sender,
      signer,
      apps: {}
    });

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

    return new OptInPluginSDK({ algorand, factoryParams: { appId: client.appId } })
  }

  describe('Optin', () => {
    test('optin OK', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const wallet = await newWallet({ factoryParams: { appId: walletFactory.appId, defaultSender: sender, defaultSigner: signer }, readerAccount: sender, algorand, nickname: 'test_wallet', sender, signer })
      const asaMintSdk = await deployAsaMintPlugin({ fixture: localnet, sender, signer })

      const escrow = 'mint_account'
      let mbr = await wallet.getMbr({ escrow, methodCount: 0n, plugin: '', groups: 0n })

      let walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos)

      const fundAmount = (
        mbr.plugins +
        mbr.newEscrowMintCost
      )

      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(fundAmount)
      })

      await wallet.addPlugin({
        client: asaMintSdk,
        global: true,
        escrow,
      });

      walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos)

      const escrowInfo = await wallet.getEscrow(escrow)
      const escrowAddress = getApplicationAddress(escrowInfo.id).toString()

      const results = await wallet.usePlugin({
        escrow,
        global: true,
        calls: [
          asaMintSdk.mint({
            assets: [{
              assetName: 'Test Akita',
              unitName: 'TAKTA',
              total: 1_000_000_000_000n,
              decimals: 6n,
              manager: escrowAddress,
              reserve: escrowAddress,
              freeze: ALGORAND_ZERO_ADDRESS_STRING,
              clawback: ALGORAND_ZERO_ADDRESS_STRING,
              defaultFrozen: false,
              url: 'https://akita.community',
            }]
          }),
        ]
      })

      const takta = results.returns[1][0]
      // const takta = decodeUint64(results.confirmations[2].logs![0].slice(4))
      console.log('created asset:', takta)

      const optinSdk = await deploy(testAccount)

      mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n })

      await wallet.client.appClient.fundAppAccount({ amount: microAlgo(mbr.plugins) })

      await wallet.addPlugin({ client: optinSdk, global: true })

      await wallet.usePlugin({
        global: true,
        calls: [optinSdk.optIn({ assets: [takta] })]
      })

      expect(results.txIds.length).toBe(4)

      const plugins = await wallet.getPlugins()
      expect(plugins.size).toBe(2)

      walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo?.assets?.length).toBe(1)
    })
  })
})
