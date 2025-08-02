import { Config } from '@algorandfoundation/algokit-utils'
import { registerDebugEventHandlers } from '@algorandfoundation/algokit-utils-debug'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { Account, Address } from 'algosdk'
import { beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { OptInPluginFactory } from '../../../artifacts/arc58/plugins/optin/OptInPluginClient'
import { newWallet, OptinPluginSDK, WalletFactorySDK } from 'akita-sdk'
import { deployAbstractedAccountFactoryAndEscrowFactory } from '../../../../tests/fixtures/abstracted-account'

describe('Optin plugin contract', () => {
  const localnet = algorandFixture();
  
  let aaFactory: WalletFactorySDK;

  beforeAll(async () => {
    Config.configure({
      debug: true,
      // traceAll: true,
    })
    registerDebugEventHandlers()
    const { algorand, context: { testAccount } } = localnet
    const sender = testAccount.toString()
    const signer = testAccount.signer;

    ({ aaFactory } = await deployAbstractedAccountFactoryAndEscrowFactory({ fixture: localnet, sender, signer }));
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

    const sdk = new OptinPluginSDK({ algorand, appId: client.appId })

    return { client, sdk }
  }

  describe('Optin', () => {
    test('optin OK', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      const wallet = await newWallet({ factoryId: aaFactory.appId, algorand, nickname: 'test_wallet', sender, signer })
      const { sdk: pluginSdk } = await deploy(testAccount)

      wallet.addPlugin()

      await pluginSdk.optIn({ sender, signer })

      const quests = await sdk.getQuests()
      expect(quests.size).toBe(1)
      expect(quests.get(questId)?.challengeId).toBe(challengeId)

      const quest = await sdk.getQuestById(questId)
      expect(quest?.challengeId).toBe(challengeId)
    })
  })
})
