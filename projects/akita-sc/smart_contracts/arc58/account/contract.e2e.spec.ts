import { algo, Config, microAlgo } from '@algorandfoundation/algokit-utils'
import { registerDebugEventHandlers } from '@algorandfoundation/algokit-utils-debug'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { ALGORAND_ZERO_ADDRESS_STRING } from 'algosdk';
import { describe, test, beforeAll, beforeEach, expect } from '@jest/globals';
import { AsaMintPluginSDK, newWallet, OptInPluginSDK, PayPluginSDK, WalletFactorySDK, WalletSDK, isFlatAllowance, isWindowAllowance, isDripAllowance, AkitaDaoSDK } from 'akita-sdk'
import { TimeWarp } from '../../../tests/utils/time'
import { deployPayPlugin } from '../../../tests/fixtures/plugins/pay'
import { deployOptInPlugin } from '../../../tests/fixtures/plugins/optin'
import { deployAsaMintPlugin } from '../../../tests/fixtures/plugins/asa-mint'
import { ERR_ALLOWANCE_EXCEEDED, ERR_CANNOT_CALL_OTHER_APPS_DURING_REKEY, ERR_EXECUTION_KEY_NOT_FOUND, ERR_MALFORMED_OFFSETS, ERR_METHOD_ON_COOLDOWN, ERR_PLUGIN_DOES_NOT_EXIST, ERR_PLUGIN_EXPIRED, ERR_PLUGIN_ON_COOLDOWN } from './errors';
import { AppCallMethodCall } from '@algorandfoundation/algokit-utils/types/composer';
import { deployAkitaDAO, deployAndSetupAkitaDAO } from '../../../tests/fixtures/dao';

describe('ARC58 Plugin Permissions', () => {
  const localnet = algorandFixture();

  let dao: AkitaDaoSDK;
  /** the wallet factory contract sdk */
  let walletFactory: WalletFactorySDK;
  /** the wallet sdk */
  let wallet: WalletSDK;

  /** the pay plugin sdk */
  let payPluginSdk: PayPluginSDK;
  /** the optin plugin sdk */
  let optinPluginSdk: OptInPluginSDK;
  /** the asa mint plugin sdk */
  let asaMintPluginSdk: AsaMintPluginSDK;

  let timeWarp: TimeWarp;

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

    timeWarp = new TimeWarp(algorand);

    ({ dao, walletFactory } = await deployAndSetupAkitaDAO({
      fixture: localnet,
      sender,
      signer,
      apps: {}
    }));

    payPluginSdk = await deployPayPlugin({ fixture: localnet, sender, signer });
    optinPluginSdk = await deployOptInPlugin({ fixture: localnet, sender, signer });
    asaMintPluginSdk = await deployAsaMintPlugin({ fixture: localnet, sender, signer });
  })

  beforeEach(async () => {
    await localnet.newScope()
    const { algorand, context: { testAccount } } = localnet
    const sender = testAccount.toString()
    const signer = testAccount.signer

    const dispenser = await algorand.account.dispenserFromEnvironment();
    await algorand.account.ensureFunded(sender, dispenser, (100).algos());

    wallet = await newWallet({
      factoryParams: {
        appId: walletFactory.appId,
        defaultSender: sender,
        defaultSigner: signer
      },
      readerAccount: sender,
      algorand,
      nickname: 'test_wallet',
    })
  })

  describe('Global Scope', () => {
    test('both are valid, global is used', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()

      let mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n })

      const paymentAmount = 1_000_000n
      const fundAmount = (mbr.plugins * 2n) + paymentAmount

      await wallet.client.appClient.fundAppAccount({
        amount: fundAmount.microAlgo()
      })

      await wallet.addPlugin({ client: payPluginSdk, caller: sender });
      await wallet.addPlugin({ client: payPluginSdk, global: true });

      let walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos + paymentAmount)

      await wallet.usePlugin({
        global: true,
        calls: [
          payPluginSdk.pay({
            payments: [{
              receiver: sender,
              amount: paymentAmount,
              asset: 0,
            }]
          })
        ]
      })

      // expect the payment was successful
      walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos)

      // expect last used to be updated on the global plugin
      // const globalPluginInfo = wallet.plugins.get(`${payPluginSdk.appId}${ALGORAND_ZERO_ADDRESS_STRING}`)!;
      const globalPluginInfo = wallet.plugins.get({ plugin: payPluginSdk.appId })!;
      expect(globalPluginInfo).toBeDefined();
      expect(globalPluginInfo!.lastCalled).toBeGreaterThan(0n);

      // expect last used to not be updated on the sender plugin
      const localPluginInfo = wallet.plugins.get({ plugin: payPluginSdk.appId, caller: sender })!;
      expect(localPluginInfo).toBeDefined();
      expect(localPluginInfo.lastCalled).toBe(0n);
    })

    test('global valid, global is used', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()

      let mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n })

      const paymentAmount = 1_000_000n
      const fundAmount = mbr.plugins + paymentAmount

      await wallet.client.appClient.fundAppAccount({
        amount: fundAmount.microAlgo()
      })

      await wallet.addPlugin({ client: payPluginSdk, global: true });

      let walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos + paymentAmount)

      await wallet.usePlugin({
        global: true,
        calls: [
          payPluginSdk.pay({
            payments: [{
              receiver: sender,
              amount: paymentAmount,
              asset: 0,
            }]
          })
        ]
      })

      // expect the payment was successful
      walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos)

      // expect last used to be updated on the global plugin
      const globalPluginInfo = wallet.plugins.get({ plugin: payPluginSdk.appId })!;
      expect(globalPluginInfo).toBeDefined();
      expect(globalPluginInfo!.lastCalled).toBeGreaterThan(0n);
    })
  })

  describe('Plugin Restrictions', () => {
    test('global does not exist, sender valid', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      let mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n })

      const paymentAmount = 1_000_000n
      const fundAmount = mbr.plugins + paymentAmount

      await wallet.client.appClient.fundAppAccount({
        amount: fundAmount.microAlgo()
      })

      await wallet.addPlugin({ client: payPluginSdk, caller: sender });

      let walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos + paymentAmount)

      await wallet.usePlugin({
        sender,
        signer,
        calls: [
          payPluginSdk.pay({
            payments: [{
              receiver: sender,
              amount: paymentAmount,
              asset: 0,
            }]
          })
        ]
      })

      // expect the payment was successful
      walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos)

      // expect last used to not be updated on the sender plugin
      const localPluginInfo = wallet.plugins.get({ plugin: payPluginSdk.appId, caller: sender })!;
      expect(localPluginInfo).toBeDefined();
      expect(localPluginInfo.lastCalled).toBeGreaterThan(0n);
    })

    test('plugins on cooldown', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()

      let mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n })

      const paymentAmount = 1_000_000n
      const fundAmount = mbr.plugins + paymentAmount

      await wallet.client.appClient.fundAppAccount({
        amount: fundAmount.microAlgo()
      })

      await wallet.addPlugin({
        client: payPluginSdk,
        global: true,
        cooldown: 100n,
      });

      let walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos + paymentAmount)

      await wallet.usePlugin({
        global: true,
        calls: [
          payPluginSdk.pay({
            payments: [{
              receiver: sender,
              amount: paymentAmount,
              asset: 0,
            }]
          })
        ]
      })

      // expect the payment was successful
      walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos)

      // expect last used to be updated on the global plugin
      const globalPluginInfo = wallet.plugins.get({ plugin: payPluginSdk.appId })!;
      expect(globalPluginInfo).toBeDefined();
      expect(globalPluginInfo!.lastCalled).toBeGreaterThan(0n);

      let error = 'no error thrown'
      try {
        await wallet.usePlugin({
          global: true,
          calls: [
            payPluginSdk.pay({
              payments: [{
                receiver: sender,
                amount: paymentAmount,
                asset: 0,
              }]
            })
          ]
        })
      } catch (e: any) {
        error = e.message;
      }

      expect(error).toContain(ERR_PLUGIN_ON_COOLDOWN);
    })

    test('neither sender nor global plugin exists', async () => {
      const { context: { testAccount } } = localnet
      const sender = testAccount.toString()

      let error = 'no error';
      try {
        await wallet.usePlugin({
          global: true,
          calls: [
            payPluginSdk.pay({
              payments: [{
                receiver: sender,
                amount: 0,
                asset: 0,
              }]
            })
          ]
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        error = e.message;
      }

      expect(error).toContain(ERR_PLUGIN_DOES_NOT_EXIST);
    })

    test('plugins expired', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()

      let mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n })

      const paymentAmount = 1_000_000n
      const fundAmount = mbr.plugins + paymentAmount

      await wallet.client.appClient.fundAppAccount({
        amount: fundAmount.microAlgo()
      })

      await wallet.addPlugin({
        client: payPluginSdk,
        global: true,
        lastValid: 0n,
      });

      let walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos + paymentAmount)

      await wallet.getPlugins();
      console.log(wallet.plugins.get({ plugin: payPluginSdk.appId })!);

      let error = 'no error thrown'
      try {
        await wallet.usePlugin({
          global: true,
          calls: [
            payPluginSdk.pay({
              payments: [{
                receiver: sender,
                amount: paymentAmount,
                asset: 0,
              }]
            })
          ]
        })
      } catch (e: any) {
        error = e.message;
      }

      expect(error).toContain(ERR_PLUGIN_EXPIRED);
    })

    test('wrong app call in sandwich', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()

      let mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n })

      const paymentAmount = 1_000_000n
      const fundAmount = (mbr.plugins * 2n) + paymentAmount

      await wallet.client.appClient.fundAppAccount({
        amount: fundAmount.microAlgo()
      })

      await wallet.addPlugin({ client: payPluginSdk, global: true });
      await wallet.addPlugin({ client: asaMintPluginSdk, global: true });

      let walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos + paymentAmount)

      // drop down below our wallet sdk
      // we need to use the direct call because
      // the wallet sdk short circuits
      // to avoid unnecessary network calls

      const group = wallet.client.newGroup()

      group.arc58RekeyToPlugin({
        args: {
          plugin: payPluginSdk.appId,
          global: true,
          escrow: '',
          methodOffsets: [],
          fundsRequest: []
        },
        extraFee: microAlgo(1_000n),
      });

      const composer = await group.composer()

      const payPluginTxn = (
        await payPluginSdk
          .pay({
            payments: [{
              receiver: sender,
              amount: paymentAmount,
              asset: 0,
            }]
          })
          .call('') // unnecesary because we're using the default controlled account
          .getTxns({ wallet: wallet.client.appId })
      ) as AppCallMethodCall


      composer.addAppCallMethodCall(payPluginTxn)

      const assaMintTxn = (
        await asaMintPluginSdk
          .mint({
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
          })
          .call('') // unnecesary because we're using the default controlled account
          .getTxns({ wallet: wallet.client.appId })
      ) as AppCallMethodCall

      composer.addAppCallMethodCall(assaMintTxn)

      group.arc58VerifyAuthAddress()

      let error = 'no error thrown'
      try {
        await group.send();
      } catch (e: any) {
        error = e.message;
      }

      expect(error).toContain(ERR_CANNOT_CALL_OTHER_APPS_DURING_REKEY);
    })
  })

  describe('Method Restrictions', () => {
    test('global does not exist, sender valid, method allowed', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()

      let mbr = await wallet.getMbr({
        escrow: '',
        methodCount: 1n,
        plugin: '',
        groups: 0n
      })

      const paymentAmount = 1_000_000n
      const fundAmount = mbr.plugins + paymentAmount

      await wallet.client.appClient.fundAppAccount({
        amount: fundAmount.microAlgo()
      })

      await wallet.addPlugin({
        client: payPluginSdk,
        caller: sender,
        methods: [
          { name: payPluginSdk.pay(), cooldown: 0n },
        ]
      });

      let walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos + paymentAmount)

      await wallet.usePlugin({
        calls: [
          payPluginSdk.pay({
            payments: [{
              receiver: sender,
              amount: paymentAmount,
              asset: 0,
            }]
          })
        ]
      })

      // expect the payment was successful
      walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos)

      // expect last used to not be updated on the sender plugin
      const localPluginInfo = wallet.plugins.get({ plugin: payPluginSdk.appId, caller: sender })!;
      expect(localPluginInfo).toBeDefined();
      expect(localPluginInfo.lastCalled).toBeGreaterThan(0n);
    })

    test('methods on cooldown', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()

      let mbr = await wallet.getMbr({
        escrow: '',
        methodCount: 1n,
        plugin: '',
        groups: 0n
      })

      const paymentAmount = 1_000_000n
      const fundAmount = mbr.plugins + paymentAmount

      await wallet.client.appClient.fundAppAccount({
        amount: fundAmount.microAlgo()
      })

      await wallet.addPlugin({
        client: payPluginSdk,
        caller: sender,
        methods: [
          { name: payPluginSdk.pay(), cooldown: 100n },
        ]
      });

      let walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos + paymentAmount)

      await wallet.usePlugin({
        calls: [
          payPluginSdk.pay({
            payments: [{
              receiver: sender,
              amount: paymentAmount,
              asset: 0,
            }]
          })
        ]
      })

      // expect the payment was successful
      walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos)

      // expect last used to not be updated on the sender plugin
      const localPluginInfo = wallet.plugins.get({ plugin: payPluginSdk.appId, caller: sender })!;
      expect(localPluginInfo).toBeDefined();
      expect(localPluginInfo.lastCalled).toBeGreaterThan(0n);

      let error = 'no error thrown'
      try {
        await wallet.usePlugin({
          calls: [
            payPluginSdk.pay({
              payments: [{
                receiver: sender,
                amount: paymentAmount,
                asset: 0,
              }]
            })
          ]
        })
      } catch (e: any) {
        error = e.message;
      }

      expect(error).toContain(ERR_METHOD_ON_COOLDOWN);
    })

    test('methods on cooldown, single group', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()

      let mbr = await wallet.getMbr({
        escrow: '',
        methodCount: 1n,
        plugin: '',
        groups: 0n
      })

      const paymentAmount = 1_000_000n
      const fundAmount = mbr.plugins + paymentAmount

      await wallet.client.appClient.fundAppAccount({
        amount: fundAmount.microAlgo()
      })

      await wallet.addPlugin({
        client: payPluginSdk,
        caller: sender,
        methods: [
          { name: payPluginSdk.pay(), cooldown: 1n },
        ]
      });

      let walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos + paymentAmount)

      let error = 'no error thrown'
      try {
        await wallet.usePlugin({
          calls: [
            payPluginSdk.pay({
              payments: [{
                receiver: sender,
                amount: paymentAmount,
                asset: 0,
              }]
            }),
            payPluginSdk.pay({
              payments: [{
                receiver: sender,
                amount: paymentAmount,
                asset: 0,
              }]
            })
          ]
        })
      } catch (e: any) {
        error = e.message;
      }

      expect(error).toContain(ERR_METHOD_ON_COOLDOWN);
    })

    test('malformed methodOffsets', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()

      let mbr = await wallet.getMbr({ escrow: '', methodCount: 1n, plugin: '', groups: 0n })

      const paymentAmount = 1_000_000n
      const fundAmount = mbr.plugins + paymentAmount

      await wallet.client.appClient.fundAppAccount({
        amount: fundAmount.microAlgo()
      })

      await wallet.addPlugin({
        client: payPluginSdk,
        global: true,
        methods: [
          { name: payPluginSdk.pay(), cooldown: 0n },
        ]
      });

      let walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos + paymentAmount)

      // drop down below our wallet sdk
      // we need to use the direct call because
      // the wallet sdk short circuits
      // to avoid unnecessary network calls

      const group = wallet.client.newGroup()

      group.arc58RekeyToPlugin({
        args: {
          plugin: payPluginSdk.appId,
          global: true,
          escrow: '',
          methodOffsets: [],
          fundsRequest: []
        },
        extraFee: microAlgo(1_000n),
      });

      const composer = await group.composer()

      const payPluginTxn = (
        await payPluginSdk
          .pay({
            payments: [{
              receiver: sender,
              amount: paymentAmount,
              asset: 0,
            }]
          })
          .call('') // unnecesary because we're using the default controlled account
          .getTxns({ wallet: wallet.client.appId })
      ) as AppCallMethodCall

      composer.addAppCallMethodCall(payPluginTxn)

      group.arc58VerifyAuthAddress()

      let error = 'no error thrown'
      try {
        await group.send();
      } catch (e: any) {
        error = e.message;
      }

      expect(error).toContain(ERR_MALFORMED_OFFSETS);
    })
  })

  describe('Allowances', () => {
    test('allowance - flat', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()

      const escrow = 'flat_allowance'
      let mbr = await wallet.getMbr({ escrow, methodCount: 0n, plugin: '', groups: 0n })

      let walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos)

      const asset = 0n
      const allowed = 10_000_000n
      const amount = 6_000_000n
      const fundAmount = (
        allowed +
        mbr.plugins +
        mbr.newEscrowMintCost +
        mbr.allowances
      )

      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(fundAmount)
      })

      await wallet.addPlugin({
        client: payPluginSdk,
        global: true,
        escrow,
        allowances: [{
          type: 'flat',
          asset,
          amount: allowed
        }]
      });

      walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos + allowed)

      await wallet.usePlugin({
        escrow,
        global: true,
        calls: [
          payPluginSdk.pay({
            payments: [{ receiver: sender, amount, asset }]
          })
        ],
        fundsRequest: [{ amount, asset }]
      })

      // expect the payment was successful
      walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos + (allowed - amount))

      // expect last used to be updated on the global plugin
      const globalPluginInfo = wallet.plugins.get({ plugin: payPluginSdk.appId, escrow })!;
      expect(globalPluginInfo).toBeDefined();
      expect(globalPluginInfo!.lastCalled).toBeGreaterThan(0n);

      const allowanceInfo = wallet.allowances.get({ asset, escrow })!;
      expect(allowanceInfo).toBeDefined();

      if (!isFlatAllowance(allowanceInfo)) {
        throw new Error('Expected allowance to be flat');
      }

      expect(allowanceInfo?.spent).toEqual(amount);

      let error = 'no error thrown'
      try {
        await wallet.usePlugin({
          escrow,
          global: true,
          calls: [
            payPluginSdk.pay({
              payments: [{ receiver: sender, amount, asset }]
            })
          ],
          fundsRequest: [{ amount, asset }]
        })
      } catch (e: any) {
        error = e.message;
      }

      expect(error).toContain(ERR_ALLOWANCE_EXCEEDED);
    })

    test('allowance - window', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()

      const escrow = 'window_allowance'
      let mbr = await wallet.getMbr({ escrow, methodCount: 0n, plugin: '', groups: 0n })

      let walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos)

      const asset = 0n
      const allowed = 10_000_000n
      const amount = 6_000_000n
      const fundAmount = (
        (allowed * 2n) +
        mbr.plugins +
        mbr.newEscrowMintCost +
        mbr.allowances
      )

      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(fundAmount)
      })

      await wallet.addPlugin({
        client: payPluginSdk,
        global: true,
        escrow,
        allowances: [{
          type: 'window',
          asset,
          amount: allowed,
          interval: 100n,
          useRounds: true
        }]
      });

      walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos + (allowed * 2n))

      await wallet.usePlugin({
        escrow,
        global: true,
        calls: [
          payPluginSdk.pay({
            payments: [{ receiver: sender, amount, asset }]
          })
        ],
        fundsRequest: [{ amount, asset }]
      })

      // expect the payment was successful
      walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos + ((allowed * 2n) - amount))

      // expect last used to be updated on the global plugin
      const globalPluginInfo = wallet.plugins.get({ plugin: payPluginSdk.appId, escrow })!;
      expect(globalPluginInfo).toBeDefined();
      expect(globalPluginInfo!.lastCalled).toBeGreaterThan(0n);

      let allowanceInfo = wallet.allowances.get({ asset, escrow })!;
      expect(allowanceInfo).toBeDefined();

      if (!isWindowAllowance(allowanceInfo)) {
        throw new Error('Expected allowance to be window');
      }

      expect(allowanceInfo.spent).toEqual(amount);

      let error = 'no error thrown'
      try {
        await wallet.usePlugin({
          escrow,
          global: true,
          calls: [
            payPluginSdk.pay({
              payments: [{ receiver: sender, amount, asset }]
            })
          ],
          fundsRequest: [{ amount, asset }]
        })
      } catch (e: any) {
        error = e.message;
      }

      expect(error).toContain(ERR_ALLOWANCE_EXCEEDED);

      await timeWarp.warpForwardRounds(101n);

      await wallet.usePlugin({
        escrow,
        global: true,
        calls: [
          payPluginSdk.pay({
            payments: [{ receiver: sender, amount, asset }]
          })
        ],
        fundsRequest: [{ amount, asset }]
      })

      allowanceInfo = wallet.allowances.get({ asset, escrow })!;
      expect(allowanceInfo).toBeDefined();

      if (!isWindowAllowance(allowanceInfo)) {
        throw new Error('Expected allowance to be window');
      }

      expect(allowanceInfo.spent).toEqual(amount);
    })

    test('allowance - drip', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()

      const escrow = 'drip_allowance'
      let mbr = await wallet.getMbr({ escrow, methodCount: 0n, plugin: '', groups: 0n })

      let walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos)

      const asset = 0n
      const max = 10_000_000n
      const amount = 6_000_000n
      const fundAmount = (
        (max * 2n) +
        mbr.plugins +
        mbr.newEscrowMintCost +
        mbr.allowances
      )

      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(fundAmount)
      })

      await wallet.addPlugin({
        client: payPluginSdk,
        global: true,
        escrow,
        allowances: [{
          type: 'drip',
          asset,
          rate: 1_000_000n,
          interval: 10n,
          max,
          useRounds: true
        }]
      });

      walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos + (max * 2n))

      await wallet.usePlugin({
        escrow,
        global: true,
        calls: [
          payPluginSdk.pay({
            payments: [{ receiver: sender, amount, asset }]
          })
        ],
        fundsRequest: [{ amount, asset }]
      })

      // expect the payment was successful
      walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos + ((max * 2n) - amount))

      // expect last used to be updated on the global plugin
      const globalPluginInfo = wallet.plugins.get({ plugin: payPluginSdk.appId, escrow })!;
      expect(globalPluginInfo).toBeDefined();
      expect(globalPluginInfo!.lastCalled).toBeGreaterThan(0n);

      let allowanceInfo = wallet.allowances.get({ asset, escrow })!;
      expect(allowanceInfo).toBeDefined();

      if (!isDripAllowance(allowanceInfo)) {
        throw new Error('Expected allowance to be drip');
      }

      expect(allowanceInfo.lastLeftover).toEqual(max - amount);

      let error = 'no error thrown'
      try {
        await wallet.usePlugin({
          escrow,
          global: true,
          calls: [
            payPluginSdk.pay({
              payments: [{ receiver: sender, amount, asset }]
            })
          ],
          fundsRequest: [{ amount, asset }]
        })
      } catch (e: any) {
        error = e.message;
      }

      expect(error).toContain(ERR_ALLOWANCE_EXCEEDED);

      await timeWarp.warpForwardRounds(20n);

      // calculate how much we should have available now
      // we waited 21 rounds, with a rate of 1_000_000 every 10 rounds
      // so we should have 2_000_000 drip back
      // we had 4_000_000 left after our first payment
      // so we should have 6_000_000 available now
      allowanceInfo = wallet.allowances.get({ asset, escrow })!;

      if (!isDripAllowance(allowanceInfo)) {
        throw new Error('Expected allowance to be drip');
      }

      const lastRound = (await algorand.client.algod.status().do()).lastRound;

      expect(allowanceInfo.last).toBe(lastRound - 20n);
      expect(
        allowanceInfo.lastLeftover + (
          (20n / allowanceInfo.interval) *
          allowanceInfo.rate
        )
      ).toEqual(amount);

      await wallet.usePlugin({
        escrow,
        global: true,
        calls: [
          payPluginSdk.pay({
            payments: [{ receiver: sender, amount, asset }]
          })
        ],
        fundsRequest: [{ amount, asset }]
      })

      allowanceInfo = wallet.allowances.get({ asset, escrow })!;
      expect(allowanceInfo).toBeDefined();

      if (!isDripAllowance(allowanceInfo)) {
        throw new Error('Expected allowance to be drip');
      }

      expect(allowanceInfo.lastLeftover).toEqual(0n);

      await timeWarp.warpForwardRounds(40n);

      error = 'no error thrown'
      try {
        await wallet.usePlugin({
          escrow,
          global: true,
          calls: [
            payPluginSdk.pay({
              payments: [{ receiver: sender, amount, asset }]
            })
          ],
          fundsRequest: [{ amount, asset }]
        })
      } catch (e: any) {
        error = e.message;
      }

      expect(error).toContain(ERR_ALLOWANCE_EXCEEDED);

      await timeWarp.warpForwardRounds(60n);

      await wallet.usePlugin({
        escrow,
        global: true,
        calls: [
          payPluginSdk.pay({
            payments: [{ receiver: sender, amount: 1_000_000n, asset }]
          })
        ],
        fundsRequest: [{ amount: 1_000_000n, asset }]
      })

      allowanceInfo = wallet.allowances.get({ asset, escrow })!;
      expect(allowanceInfo).toBeDefined();

      if (!isDripAllowance(allowanceInfo)) {
        throw new Error('Expected allowance to be drip');
      }

      expect(allowanceInfo.lastLeftover).toEqual(max - 1_000_000n);
    })
  })

  describe('Execution Keys', () => {
    test('execution key - valid', async () => {
      const { algorand } = localnet
      const dispenser = await algorand.account.dispenserFromEnvironment();

      const senderAcc = algorand.account.random()
      const sender = senderAcc.toString()
      const signer = senderAcc.signer

      await algorand.account.ensureFunded(sender, dispenser, algo(4));

      let mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 2n })

      const paymentAmount = 1_000_000n
      const fundAmount = mbr.plugins + mbr.executions + paymentAmount

      await wallet.client.appClient.fundAppAccount({
        amount: fundAmount.microAlgo()
      })

      await wallet.addPlugin({
        client: payPluginSdk,
        global: true,
        useExecutionKey: true,
        useRounds: true
      });

      let walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos + (paymentAmount + mbr.executions))

      let error = 'no error thrown'
      try {
        await wallet.usePlugin({
          sender,
          signer,
          global: true,
          calls: [
            payPluginSdk.pay({
              payments: [{
                receiver: sender,
                amount: paymentAmount,
                asset: 0,
              }]
            })
          ]
        })
      } catch (e: any) {
        error = e.message;
      }

      expect(error).toContain(ERR_EXECUTION_KEY_NOT_FOUND);

      const { lease, firstValid, lastValid, ids: groups, atcs } = await wallet.build.usePlugin({
        sender,
        signer,
        lease: 'my_lease',
        windowSize: 2000n,
        global: true,
        calls: [
          payPluginSdk.pay({
            payments: [{
              receiver: sender,
              amount: paymentAmount,
              asset: 0,
            }]
          })
        ]
      })

      await wallet.addExecutionKey({ lease, groups, firstValid, lastValid });

      await atcs[0].submit(wallet.client.algorand.client.algod)

      // expect the payment was successful
      walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos + mbr.executions)

      // manually refresh our cache
      await wallet.getPlugins();

      // expect last used to be updated on the global plugin
      const globalPluginInfo = wallet.plugins.get({ plugin: payPluginSdk.appId })!;
      expect(globalPluginInfo).toBeDefined();
      expect(globalPluginInfo!.lastCalled).toBeGreaterThan(0n);
    })
  })
})
