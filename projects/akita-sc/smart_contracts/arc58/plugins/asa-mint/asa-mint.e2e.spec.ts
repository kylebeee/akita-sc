import * as algokit from '@algorandfoundation/algokit-utils';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { SigningAccount, TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account';
import { beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { newWallet, WalletSDK } from 'akita-sdk/wallet';
import algosdk, { ALGORAND_ZERO_ADDRESS_STRING, makeBasicAccountTransactionSigner } from 'algosdk';
import { AkitaUniverse, buildAkitaUniverse } from '../../../../tests/fixtures/dao';

algokit.Config.configure({ populateAppCallResources: true });

const fixture = algorandFixture();

describe('Asa Mint plugin contract', () => {
  let deployer: algosdk.Account;
  let user: algosdk.Account;
  let akitaUniverse: AkitaUniverse;
  let dispenser: algosdk.Address & TransactionSignerAccount & { account: SigningAccount };
  let algorand: import('@algorandfoundation/algokit-utils').AlgorandClient;
  let wallet: WalletSDK;

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
  });

  beforeEach(fixture.newScope);

  describe('AsaMint', () => {
    test('mint OK', async () => {
      const asaMintSdk = akitaUniverse.asaMintPlugin;

      const mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n });

      let walletInfo = await algorand.account.getInformation(wallet.client.appAddress);
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos);

      const fundAmount = mbr.plugins;

      console.log('funding wallet with:', fundAmount, 'microAlgos');

      await wallet.client.appClient.fundAppAccount({
        amount: algokit.microAlgo(fundAmount)
      });

      await wallet.addPlugin({
        client: asaMintSdk,
        global: true,
      });

      walletInfo = await algorand.account.getInformation(wallet.client.appAddress);
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos);

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
      });

      const takta = results.returns[1][0];

      expect(takta).toBeGreaterThan(0n);

      expect(results.txIds.length).toBe(4);

      const plugins = await wallet.getPlugins();
      expect(plugins.size).toBe(1);

      walletInfo = await algorand.account.getInformation(wallet.client.appAddress);
      expect(walletInfo?.assets?.length).toBe(1);
    });
  });
});
