import { Config, microAlgo, sendGroupOfTransactions } from '@algorandfoundation/algokit-utils'
import { registerDebugEventHandlers } from '@algorandfoundation/algokit-utils-debug'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { ALGORAND_ZERO_ADDRESS_STRING } from 'algosdk';
import { describe, test, beforeAll, beforeEach, expect } from '@jest/globals';
import { AsaMintPluginSDK, newWallet, OptInPluginSDK, PayPluginSDK, WalletFactorySDK, WalletSDK, ARC58EscrowRegisterFee, isFlatAllowance, isWindowAllowance, isDripAllowance } from 'akita-sdk'
import { TimeWarp } from '../../../tests/utils/time'
import { deployAbstractedAccountFactoryAndEscrowFactory } from '../../../tests/fixtures/abstracted-account'
import { deployPayPlugin } from '../../../tests/fixtures/plugins/pay'
import { deployOptInPlugin } from '../../../tests/fixtures/plugins/optin'
import { deployAsaMintPlugin } from '../../../tests/fixtures/plugins/asa-mint'
import { ERR_ALLOWANCE_EXCEEDED, ERR_BAD_EXECUTION_KEY, ERR_CANNOT_CALL_OTHER_APPS_DURING_REKEY, ERR_MALFORMED_OFFSETS, ERR_METHOD_ON_COOLDOWN, ERR_PLUGIN_DOES_NOT_EXIST, ERR_PLUGIN_EXPIRED, ERR_PLUGIN_ON_COOLDOWN } from './errors';
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount';

describe('ARC58 Plugin Permissions', () => {
  const localnet = algorandFixture();

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

    walletFactory = (
      await deployAbstractedAccountFactoryAndEscrowFactory({ fixture: localnet, sender, signer })
    ).aaFactory;

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

      let mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '' })

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
      const globalPluginInfo = wallet.plugins.get(`${payPluginSdk.appId}${ALGORAND_ZERO_ADDRESS_STRING}`)!;
      expect(globalPluginInfo).toBeDefined();
      expect(globalPluginInfo!.lastCalled).toBeGreaterThan(0n);

      // expect last used to not be updated on the sender plugin
      const localPluginInfo = wallet.plugins.get(`${payPluginSdk.appId}${sender}`)!;
      expect(localPluginInfo).toBeDefined();
      expect(localPluginInfo.lastCalled).toBe(0n);
    })

    test('global valid, global is used', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()

      let mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '' })

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
      const globalPluginInfo = wallet.plugins.get(`${payPluginSdk.appId}${ALGORAND_ZERO_ADDRESS_STRING}`)!;
      expect(globalPluginInfo).toBeDefined();
      expect(globalPluginInfo!.lastCalled).toBeGreaterThan(0n);
    })
  })

  describe('Plugin Restrictions', () => {
    test('global does not exist, sender valid', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()
      const signer = testAccount.signer

      let mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '' })

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
      const localPluginInfo = wallet.plugins.get(`${payPluginSdk.appId}${sender}`)!;
      expect(localPluginInfo).toBeDefined();
      expect(localPluginInfo.lastCalled).toBeGreaterThan(0n);
    })

    test('plugins on cooldown', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()

      let mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '' })

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
      const globalPluginInfo = wallet.plugins.get(`${payPluginSdk.appId}${ALGORAND_ZERO_ADDRESS_STRING}`)!;
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

      let mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '' })

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
      console.log(wallet.plugins.get(`${payPluginSdk.appId}${ALGORAND_ZERO_ADDRESS_STRING}`)!);

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

      let mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '' })

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

      const txns = [
        ...(
          await payPluginSdk
            .pay({
              payments: [{
                receiver: sender,
                amount: paymentAmount,
                asset: 0,
              }]
            })
            .call('') // unnecesary because we're using the default controlled account
            .getTxns({ walletId: wallet.client.appId })
        ),
        ...(
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
            .getTxns({ walletId: wallet.client.appId })
        )
      ]

      for (const txn of txns) {
        group.addTransaction(txn)
      }

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
        plugin: ''
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
      const localPluginInfo = wallet.plugins.get(`${payPluginSdk.appId}${sender}`)!;
      expect(localPluginInfo).toBeDefined();
      expect(localPluginInfo.lastCalled).toBeGreaterThan(0n);
    })

    test('methods on cooldown', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()

      let mbr = await wallet.getMbr({
        escrow: '',
        methodCount: 1n,
        plugin: ''
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
      const localPluginInfo = wallet.plugins.get(`${payPluginSdk.appId}${sender}`)!;
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
        plugin: ''
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

      let mbr = await wallet.getMbr({ escrow: '', methodCount: 1n, plugin: '' })

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

      const txns = [
        ...(
          await payPluginSdk
            .pay({
              payments: [{
                receiver: sender,
                amount: paymentAmount,
                asset: 0,
              }]
            })
            .call('') // unnecesary because we're using the default controlled account
            .getTxns({ walletId: wallet.client.appId })
        )
      ]

      for (const txn of txns) {
        group.addTransaction(txn)
      }

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
      let mbr = await wallet.getMbr({ escrow, methodCount: 0n, plugin: '' })

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
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos + (allowed - ARC58EscrowRegisterFee))

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
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos + ((allowed - amount) - ARC58EscrowRegisterFee))

      // expect last used to be updated on the global plugin
      const globalPluginInfo = wallet.plugins.get(`${payPluginSdk.appId}${ALGORAND_ZERO_ADDRESS_STRING}${escrow}`)!;
      expect(globalPluginInfo).toBeDefined();
      expect(globalPluginInfo!.lastCalled).toBeGreaterThan(0n);

      const allowanceInfo = wallet.allowances.get(`${asset}${escrow}`)!;
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
      let mbr = await wallet.getMbr({ escrow, methodCount: 0n, plugin: '' })

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
          interval: 1n
        }]
      });

      walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos + ((allowed * 2n) - ARC58EscrowRegisterFee))

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
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos + (((allowed * 2n) - amount) - ARC58EscrowRegisterFee))

      // expect last used to be updated on the global plugin
      const globalPluginInfo = wallet.plugins.get(`${payPluginSdk.appId}${ALGORAND_ZERO_ADDRESS_STRING}${escrow}`)!;
      expect(globalPluginInfo).toBeDefined();
      expect(globalPluginInfo!.lastCalled).toBeGreaterThan(0n);

      let allowanceInfo = wallet.allowances.get(`${asset}${escrow}`)!;
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

      await timeWarp.timeWarp(1n);

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

      allowanceInfo = wallet.allowances.get(`${asset}${escrow}`)!;
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
      let mbr = await wallet.getMbr({ escrow, methodCount: 0n, plugin: '' })

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
          max
        }]
      });

      walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos + ((max * 2n) - ARC58EscrowRegisterFee))

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
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos + (((max * 2n) - amount) - ARC58EscrowRegisterFee))

      // expect last used to be updated on the global plugin
      const globalPluginInfo = wallet.plugins.get(`${payPluginSdk.appId}${ALGORAND_ZERO_ADDRESS_STRING}${escrow}`)!;
      expect(globalPluginInfo).toBeDefined();
      expect(globalPluginInfo!.lastCalled).toBeGreaterThan(0n);

      let allowanceInfo = wallet.allowances.get(`${asset}${escrow}`)!;
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

      await timeWarp.timeWarp(20n);

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

      allowanceInfo = wallet.allowances.get(`${asset}${escrow}`)!;
      expect(allowanceInfo).toBeDefined();

      if (!isDripAllowance(allowanceInfo)) {
        throw new Error('Expected allowance to be drip');
      }

      expect(allowanceInfo.lastLeftover).toEqual(0n);

      await timeWarp.timeWarp(40n);

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

      await timeWarp.timeWarp(60n);

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

      allowanceInfo = wallet.allowances.get(`${asset}${escrow}`)!;
      expect(allowanceInfo).toBeDefined();

      if (!isDripAllowance(allowanceInfo)) {
        throw new Error('Expected allowance to be drip');
      }

      expect(allowanceInfo.lastLeftover).toEqual(max - 1_000_000n);
    })
  })

  describe('Execution Keys', () => {
    test('execution key - valid', async () => {
      const { algorand, context: { testAccount } } = localnet
      const sender = testAccount.toString()

      let mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '' })

      const paymentAmount = 1_000_000n
      const fundAmount = mbr.plugins + paymentAmount

      await wallet.client.appClient.fundAppAccount({
        amount: fundAmount.microAlgo()
      })

      await wallet.addPlugin({
        client: payPluginSdk,
        global: true,
        useExecutionKey: true,
      });

      let walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos + paymentAmount)

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

      expect(error).toContain(ERR_BAD_EXECUTION_KEY);

      const composer = await wallet.build.usePlugin({
        lease: 'my_lease',
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

      const built = await composer.build()

      const key = built.transactions[0].txn.lease
      const group = built.transactions[0].txn.group
      const expiration = built.transactions[0].txn.lastValid;
      
      if (!key) {
        throw new Error('Expected execution key to be defined');
      }

      if (!group) {
        throw new Error('Expected group to be defined');
      }

      await wallet.addExecutionKey({ key, groups: [group], expiration });

      await composer.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: false })

      // expect the payment was successful
      walletInfo = await algorand.account.getInformation(wallet.client.appAddress)
      expect(walletInfo.balance.microAlgos).toEqual(walletInfo.minBalance.microAlgos)

      // manually refresh our cache
      await wallet.getPlugins();

      // expect last used to be updated on the global plugin
      const globalPluginInfo = wallet.plugins.get(`${payPluginSdk.appId}${ALGORAND_ZERO_ADDRESS_STRING}`)!;
      expect(globalPluginInfo).toBeDefined();
      expect(globalPluginInfo!.lastCalled).toBeGreaterThan(0n);
    })
  })
})
