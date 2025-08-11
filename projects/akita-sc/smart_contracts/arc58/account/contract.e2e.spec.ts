import { Config } from '@algorandfoundation/algokit-utils'
import { registerDebugEventHandlers } from '@algorandfoundation/algokit-utils-debug'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { ALGORAND_ZERO_ADDRESS_STRING } from 'algosdk';
import { describe, test, beforeAll, beforeEach, expect } from '@jest/globals';
import { AsaMintPluginSDK, newWallet, OptInPluginSDK, PayPluginSDK, WalletFactorySDK, WalletSDK } from 'akita-sdk'
import { deployAbstractedAccountFactoryAndEscrowFactory } from '../../../tests/fixtures/abstracted-account'
import { deployPayPlugin } from '../../../tests/fixtures/plugins/pay'
import { deployOptInPlugin } from '../../../tests/fixtures/plugins/optin'
import { deployAsaMintPlugin } from '../../../tests/fixtures/plugins/asa-mint'
import { ERR_PLUGIN_ON_COOLDOWN } from './errors';

// import { ERR_ALLOWANCE_EXCEEDED, ERR_CANNOT_CALL_OTHER_APPS_DURING_REKEY, ERR_MALFORMED_OFFSETS, ERR_METHOD_ON_COOLDOWN, ERR_PLUGIN_DOES_NOT_EXIST, ERR_PLUGIN_EXPIRED, ERR_PLUGIN_ON_COOLDOWN } from './errors';

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

      console.log('funding wallet with:', fundAmount, 'microAlgos')

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

      // sleep for 1 second to give the async plugin map to update
      await new Promise(resolve => setTimeout(resolve, 1000));

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

      console.log('funding wallet with:', fundAmount, 'microAlgos')

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

      // sleep for 1 second to give the async plugin map to update
      await new Promise(resolve => setTimeout(resolve, 1000));

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

      console.log('funding wallet with:', fundAmount, 'microAlgos')

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

      // sleep for 1 second to give the async plugin map to update
      await new Promise(resolve => setTimeout(resolve, 1000));

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

      console.log('funding wallet with:', fundAmount, 'microAlgos')

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

      // sleep for 1 second to give the async plugin map to update
      await new Promise(resolve => setTimeout(resolve, 1000));

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

    test.skip('neither sender nor global plugin exists', async () => { })
    test.skip('plugins expired', async () => { })
    test.skip('wrong app call in sandwich', async () => { })
  })

  describe('Method Restrictions', () => {
    test.skip('global does not exist, sender valid, method allowed', async () => { })
    test.skip('methods on cooldown', async () => { })
    test.skip('methods on cooldown, single group', async () => { })
    test.skip('malformed methodOffsets', async () => { })
  })

  describe('Allowances', () => {
    test.skip('allowance - flat', async () => { })
    test.skip('allowance - window', async () => { })
    test.skip('allowance - drip', async () => { })
  })

  // describe('Execution Keys', () => {

  // })

  // test('both are valid, global is used', async () => {
  //   const { algorand } = localnet;

  //   const dispenser = await algorand.account.dispenserFromEnvironment();

  //   let accountInfo = await algorand.account.getInformation(abstractedAccountClient.appAddress)
  //   expect(accountInfo.balance.microAlgos).toEqual(accountInfo.minBalance.microAlgos)

  //   const mbr = (await abstractedAccountClient.send.mbr({ args: { methodCount: 0, pluginName: '', escrowName: '' } })).return

  //   if (mbr === undefined) {
  //     throw new Error('MBR is undefined');
  //   }

  //   console.log(`Funding arc58 account with amount: ${mbr.plugins * BigInt(2)}`)
  //   const minFundingAmount = mbr.plugins * BigInt(2) // we install plugins twice here so double it

  //   await algorand.account.ensureFunded(abstractedAccountClient.appAddress, dispenser, minFundingAmount.microAlgo())

  //   await abstractedAccountClient.send.arc58AddPlugin({
  //     args: {
  //       plugin,
  //       caller: caller.addr.toString(),
  //       escrow: '',
  //       admin: false,
  //       delegationType: 3,
  //       lastValid: MAX_UINT64,
  //       cooldown: 0,
  //       methods: [],
  //       useRounds: false,
  //       useExecutionKey: false
  //     }
  //   });

  //   await abstractedAccountClient.send.arc58AddPlugin({
  //     args: {
  //       plugin,
  //       caller: ZERO_ADDRESS,
  //       escrow,
  //       admin: false,
  //       delegationType: 3,
  //       lastValid: MAX_UINT64,
  //       cooldown: 1,
  //       methods: [],
  //       useRounds: false,
  //       useExecutionKey: false
  //     }
  //   });

  //   accountInfo = await algorand.account.getInformation(abstractedAccountClient.appAddress)
  //   expect(accountInfo.balance.microAlgos).toEqual(accountInfo.minBalance.microAlgos)

  //   await callOptinPlugin(caller, abstractedAccountClient.appAddress.toString(), suggestedParams, optInPluginClient, asset, [], true);

  //   const globalPluginBox = (await abstractedAccountClient.appClient.getBoxValueFromABIType(
  //     new Uint8Array(
  //       Buffer.concat([
  //         Buffer.from('p'),
  //         Buffer.from(algosdk.encodeUint64(plugin)),
  //         algosdk.decodeAddress(ZERO_ADDRESS).publicKey,
  //       ])
  //     ),
  //     PluginInfoAbiType
  //   )) as PluginInfoTuple;

  //   const ts = (await algorand.client.algod.status().do())
  //   const block = (await algorand.client.algod.block((ts.lastRound - 1n)).do());

  //   expect(globalPluginBox[8]).toBe(BigInt(block.block.header.timestamp));
  // });

  // test('global valid, global is used', async () => {
  //   const { algorand } = fixture;

  //   const dispenser = await algorand.account.dispenserFromEnvironment();

  //   let accountInfo = await algorand.account.getInformation(abstractedAccountClient.appAddress)
  //   expect(accountInfo.balance.microAlgos).toEqual(accountInfo.minBalance.microAlgos)

  //   const mbr = (await abstractedAccountClient.send.mbr({
  //     args: {
  //       methodCount: 0,
  //       pluginName: '',
  //       escrowName: ''
  //     }
  //   })).return

  //   if (mbr === undefined) {
  //     throw new Error('MBR is undefined');
  //   }

  //   console.log(`Funding arc58 account with amount: ${mbr.plugins}`)

  //   await algorand.account.ensureFunded(abstractedAccountClient.appAddress, dispenser, mbr.plugins.microAlgo())

  //   await abstractedAccountClient.send.arc58AddPlugin({
  //     sender: aliceEOA.addr,
  //     signer: makeBasicAccountTransactionSigner(aliceEOA),
  //     args: {
  //       plugin,
  //       caller: ZERO_ADDRESS,
  //       escrow,
  //       admin: false,
  //       delegationType: 3,
  //       lastValid: MAX_UINT64,
  //       cooldown: 1,
  //       methods: [],
  //       useRounds: false,
  //       useExecutionKey: false
  //     }
  //   });

  //   accountInfo = await algorand.account.getInformation(abstractedAccountClient.appAddress)
  //   expect(accountInfo.balance.microAlgos).toEqual(accountInfo.minBalance.microAlgos)

  //   await callOptinPlugin(caller, abstractedAccountClient.appAddress.toString(), suggestedParams, optInPluginClient, asset, [], true);

  //   const globalPluginBox = (await abstractedAccountClient.appClient.getBoxValueFromABIType(
  //     new Uint8Array(
  //       Buffer.concat([
  //         Buffer.from('p'),
  //         Buffer.from(algosdk.encodeUint64(plugin)),
  //         algosdk.decodeAddress(ZERO_ADDRESS).publicKey,
  //       ])
  //     ),
  //     PluginInfoAbiType
  //   )) as PluginInfoTuple;

  //   const ts = (await algorand.client.algod.status().do())
  //   const block = (await algorand.client.algod.block(ts.lastRound - 1n).do());

  //   expect(globalPluginBox[8]).toBe(BigInt(block.block.header.timestamp));
  // });

  // test('global does not exist, sender valid', async () => {
  //   const { algorand } = fixture;

  //   const dispenser = await algorand.account.dispenserFromEnvironment();

  //   let accountInfo = await algorand.account.getInformation(abstractedAccountClient.appAddress)
  //   expect(accountInfo.balance.microAlgos).toEqual(accountInfo.minBalance.microAlgos)

  //   const mbr = (await abstractedAccountClient.send.mbr({
  //     args: {
  //       methodCount: 0,
  //       pluginName: '',
  //       escrowName: ''
  //     }
  //   })).return

  //   if (mbr === undefined) {
  //     throw new Error('MBR is undefined');
  //   }

  //   console.log(`Funding arc58 account with amount: ${mbr.plugins}`)

  //   await algorand.account.ensureFunded(abstractedAccountClient.appAddress, dispenser, mbr.plugins.microAlgo())

  //   await abstractedAccountClient.send.arc58AddPlugin({
  //     sender: aliceEOA.addr,
  //     signer: makeBasicAccountTransactionSigner(aliceEOA),
  //     args: {
  //       plugin,
  //       caller: caller.addr.toString(),
  //       escrow,
  //       admin: false,
  //       delegationType: 3,
  //       lastValid: MAX_UINT64,
  //       cooldown: 1,
  //       methods: [],
  //       useRounds: false,
  //       useExecutionKey: false
  //     }
  //   });

  //   accountInfo = await algorand.account.getInformation(abstractedAccountClient.appAddress)
  //   expect(accountInfo.balance.microAlgos).toEqual(accountInfo.minBalance.microAlgos)

  //   await callOptinPlugin(caller, abstractedAccountClient.appAddress.toString(), suggestedParams, optInPluginClient, asset, [], false);

  //   const callerPluginBox = (await abstractedAccountClient.appClient.getBoxValueFromABIType(
  //     new Uint8Array(
  //       Buffer.concat([
  //         Buffer.from('p'),
  //         Buffer.from(algosdk.encodeUint64(plugin)),
  //         caller.addr.publicKey,
  //       ])
  //     ),
  //     PluginInfoAbiType
  //   )) as PluginInfoTuple;

  //   const ts = (await algorand.client.algod.status().do())
  //   const block = (await algorand.client.algod.block(ts.lastRound - 1n).do());

  //   expect(callerPluginBox[8]).toBe(BigInt(block.block.header.timestamp));
  // });

  // test('global does not exist, sender valid, method allowed', async () => {
  //   const { algorand } = fixture;

  //   const dispenser = await algorand.account.dispenserFromEnvironment();

  //   let accountInfo = await algorand.account.getInformation(abstractedAccountClient.appAddress)
  //   expect(accountInfo.balance.microAlgos).toEqual(accountInfo.minBalance.microAlgos)

  //   const mbr = (await abstractedAccountClient.send.mbr({
  //     args: {
  //       methodCount: 3,
  //       pluginName: '',
  //       escrowName: ''
  //     }
  //   })).return

  //   if (mbr === undefined) {
  //     throw new Error('MBR is undefined');
  //   }

  //   console.log(`Funding arc58 account with amount: ${mbr.plugins}`)

  //   await algorand.account.ensureFunded(abstractedAccountClient.appAddress, dispenser, mbr.plugins.microAlgo())

  //   const optInToAssetSelector = optInPluginClient.appClient.getABIMethod('optInToAsset').getSelector();
  //   await abstractedAccountClient.send.arc58AddPlugin({
  //     sender: aliceEOA.addr,
  //     signer: makeBasicAccountTransactionSigner(aliceEOA),
  //     args: {
  //       plugin,
  //       caller: caller.addr.toString(),
  //       escrow,
  //       admin: false,
  //       delegationType: 3,
  //       lastValid: MAX_UINT64,
  //       cooldown: 1,
  //       methods: [
  //         [optInToAssetSelector, 0],
  //         [Buffer.from('dddd'), 0],
  //         [Buffer.from('aaaa'), 0]
  //       ],
  //       useRounds: false,
  //       useExecutionKey: false,
  //     }
  //   });

  //   accountInfo = await algorand.account.getInformation(abstractedAccountClient.appAddress)
  //   expect(accountInfo.balance.microAlgos).toEqual(accountInfo.minBalance.microAlgos)

  //   console.log('optInToAssetSelector', new Uint8Array([...optInToAssetSelector]))

  //   await callOptinPlugin(caller, abstractedAccountClient.appAddress.toString(), suggestedParams, optInPluginClient, asset, [0], false);

  //   // const capturedLogs = logs.testLogger.capturedLogs
  //   // console.log('capturedLogs', capturedLogs)

  //   const callerPluginBox = (await abstractedAccountClient.appClient.getBoxValueFromABIType(
  //     new Uint8Array(
  //       Buffer.concat([
  //         Buffer.from('p'),
  //         Buffer.from(algosdk.encodeUint64(plugin)),
  //         caller.addr.publicKey,
  //       ])
  //     ),
  //     PluginInfoAbiType
  //   )) as PluginInfoTuple;

  //   const ts = (await algorand.client.algod.status().do())
  //   const block = (await algorand.client.algod.block(ts.lastRound - 1n).do());

  //   expect(callerPluginBox[8]).toBe(BigInt(block.block.header.timestamp));
  // });

  // test('methods on cooldown', async () => {
  //   const { algorand } = fixture;

  //   const dispenser = await algorand.account.dispenserFromEnvironment();

  //   let accountInfo = await algorand.account.getInformation(abstractedAccountClient.appAddress)
  //   expect(accountInfo.balance.microAlgos).toEqual(accountInfo.minBalance.microAlgos)

  //   const mbr = (await abstractedAccountClient.send.mbr({
  //     args: {
  //       methodCount: 1,
  //       pluginName: '',
  //       escrowName: ''
  //     }
  //   })).return

  //   if (mbr === undefined) {
  //     throw new Error('MBR is undefined');
  //   }

  //   console.log(`Funding arc58 account with amount: ${mbr.plugins}`)

  //   await algorand.account.ensureFunded(abstractedAccountClient.appAddress, dispenser, mbr.plugins.microAlgo())

  //   const optInToAssetSelector = optInPluginClient.appClient.getABIMethod('optInToAsset').getSelector();
  //   await abstractedAccountClient.send.arc58AddPlugin({
  //     sender: aliceEOA.addr,
  //     signer: makeBasicAccountTransactionSigner(aliceEOA),
  //     args: {
  //       plugin,
  //       caller: ZERO_ADDRESS,
  //       escrow,
  //       admin: false,
  //       delegationType: 3,
  //       lastValid: MAX_UINT64,
  //       cooldown: 0,
  //       methods: [
  //         [optInToAssetSelector, 100] // cooldown of 1 so we can call it at most once per round
  //       ],
  //       useRounds: false,
  //       useExecutionKey: false
  //     }
  //   });

  //   accountInfo = await algorand.account.getInformation(abstractedAccountClient.appAddress)
  //   expect(accountInfo.balance.microAlgos).toEqual(accountInfo.minBalance.microAlgos)

  //   await callOptinPlugin(caller, abstractedAccountClient.appAddress.toString(), suggestedParams, optInPluginClient, asset, [0]);

  //   const callerPluginBox = (await abstractedAccountClient.appClient.getBoxValueFromABIType(
  //     new Uint8Array(
  //       Buffer.concat([
  //         Buffer.from('p'),
  //         Buffer.from(algosdk.encodeUint64(plugin)),
  //         algosdk.decodeAddress(ZERO_ADDRESS).publicKey,
  //       ])
  //     ),
  //     PluginInfoAbiType
  //   )) as PluginInfoTuple;

  //   const ts = (await algorand.client.algod.status().do());
  //   const block = (await algorand.client.algod.block(ts.lastRound - 1n).do());

  //   expect(callerPluginBox[5][0][2]).toBe(BigInt(block.block.header.timestamp));

  //   let error = 'no error';
  //   try {
  //     await callOptinPlugin(caller, abstractedAccountClient.appAddress.toString(), suggestedParams, optInPluginClient, asset, [0]);
  //   } catch (e: any) {
  //     error = e.message;
  //   }

  //   expect(error).toContain(ERR_METHOD_ON_COOLDOWN)
  // });

  // test('methods on cooldown, single group', async () => {
  //   const { algorand } = fixture;

  //   const optInToAssetSelector = optInPluginClient.appClient.getABIMethod('optInToAsset').getSelector();

  //   const dispenser = await algorand.account.dispenserFromEnvironment();

  //   let accountInfo = await algorand.account.getInformation(abstractedAccountClient.appAddress)
  //   expect(accountInfo.balance.microAlgos).toEqual(accountInfo.minBalance.microAlgos)

  //   const mbr = (await abstractedAccountClient.send.mbr({
  //     args: {
  //       methodCount: 1,
  //       pluginName: '',
  //       escrowName: ''
  //     }
  //   })).return

  //   if (mbr === undefined) {
  //     throw new Error('MBR is undefined');
  //   }

  //   console.log(`Funding arc58 account with amount: ${mbr.plugins}`)

  //   await algorand.account.ensureFunded(abstractedAccountClient.appAddress, dispenser, mbr.plugins.microAlgo())

  //   await abstractedAccountClient.send.arc58AddPlugin({
  //     sender: aliceEOA.addr,
  //     signer: makeBasicAccountTransactionSigner(aliceEOA),
  //     args: {
  //       plugin,
  //       caller: ZERO_ADDRESS,
  //       escrow,
  //       admin: false,
  //       delegationType: 3,
  //       lastValid: MAX_UINT64,
  //       cooldown: 0,
  //       methods: [
  //         [optInToAssetSelector, 1] // cooldown of 1 so we can call it at most once per round
  //       ],
  //       useRounds: false,
  //       useExecutionKey: false
  //     }
  //   });

  //   accountInfo = await algorand.account.getInformation(abstractedAccountClient.appAddress)
  //   expect(accountInfo.balance.microAlgos).toEqual(accountInfo.minBalance.microAlgos)

  //   const mbrPayment = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
  //     sender: caller.addr,
  //     receiver: abstractedAccountClient.appAddress,
  //     amount: 100_000,
  //     suggestedParams,
  //   });

  //   const optInGroup = (
  //     await (optInPluginClient
  //       .createTransaction
  //       .optInToAsset({
  //         sender: caller.addr,
  //         signer: makeBasicAccountTransactionSigner(caller),
  //         args: {
  //           walletId: abstractedAccountClient.appId,
  //           rekeyBack: false,
  //           assets: [asset],
  //           mbrPayment
  //         },
  //         extraFee: (1_000).microAlgos()
  //       }))
  //   ).transactions;

  //   const mbrPaymentTwo = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
  //     sender: caller.addr,
  //     receiver: abstractedAccountClient.appAddress,
  //     amount: 100_000,
  //     suggestedParams,
  //     note: new Uint8Array(Buffer.from('two'))
  //   });

  //   const optInGroupTwo = (
  //     await (optInPluginClient
  //       .createTransaction
  //       .optInToAsset({
  //         sender: caller.addr,
  //         signer: makeBasicAccountTransactionSigner(caller),
  //         args: {
  //           walletId: abstractedAccountClient.appId,
  //           rekeyBack: true,
  //           assets: [asset],
  //           mbrPayment: mbrPaymentTwo
  //         },
  //         extraFee: (1_000).microAlgos(),
  //         note: 'two'
  //       }))
  //   ).transactions;

  //   let error = 'no error';
  //   try {
  //     await abstractedAccountClient
  //       .newGroup()
  //       .arc58RekeyToPlugin({
  //         sender: caller.addr,
  //         signer: makeBasicAccountTransactionSigner(caller),
  //         args: {
  //           plugin,
  //           global: true,
  //           escrow,
  //           methodOffsets: [0, 0],
  //           fundsRequest: []
  //         },
  //         extraFee: (1000).microAlgos()
  //       })
  //       // Add the mbr payment
  //       .addTransaction(optInGroup[0], makeBasicAccountTransactionSigner(caller)) // mbrPayment
  //       // Add the opt-in plugin call
  //       .addTransaction(optInGroup[1], makeBasicAccountTransactionSigner(caller)) // optInToAsset
  //       .addTransaction(optInGroupTwo[0], makeBasicAccountTransactionSigner(caller)) // mbrPayment
  //       .addTransaction(optInGroupTwo[1], makeBasicAccountTransactionSigner(caller)) // optInToAsset
  //       .arc58VerifyAuthAddr({
  //         sender: caller.addr,
  //         signer: makeBasicAccountTransactionSigner(caller),
  //         args: {}
  //       })
  //       .send();
  //   } catch (e: any) {
  //     error = e.message;
  //   }

  //   expect(error).toContain(ERR_METHOD_ON_COOLDOWN);
  // });

  // test('plugins on cooldown', async () => {
  //   const { algorand } = fixture;

  //   const dispenser = await algorand.account.dispenserFromEnvironment();

  //   let accountInfo = await algorand.account.getInformation(abstractedAccountClient.appAddress)
  //   expect(accountInfo.balance.microAlgos).toEqual(accountInfo.minBalance.microAlgos)

  //   const mbr = (await abstractedAccountClient.send.mbr({
  //     args: {
  //       methodCount: 0,
  //       pluginName: '',
  //       escrowName: ''
  //     }
  //   })).return

  //   if (mbr === undefined) {
  //     throw new Error('MBR is undefined');
  //   }

  //   console.log(`Funding arc58 account with amount: ${mbr.plugins}`)

  //   await algorand.account.ensureFunded(abstractedAccountClient.appAddress, dispenser, mbr.plugins.microAlgo())

  //   await abstractedAccountClient.send.arc58AddPlugin({
  //     sender: aliceEOA.addr,
  //     signer: makeBasicAccountTransactionSigner(aliceEOA),
  //     args: {
  //       plugin,
  //       caller: caller.addr.toString(),
  //       escrow,
  //       admin: false,
  //       delegationType: 3,
  //       lastValid: MAX_UINT64,
  //       cooldown: 100,
  //       methods: [],
  //       useRounds: false,
  //       useExecutionKey: false
  //     }
  //   });

  //   accountInfo = await algorand.account.getInformation(abstractedAccountClient.appAddress)
  //   expect(accountInfo.balance.microAlgos).toEqual(accountInfo.minBalance.microAlgos)

  //   await callOptinPlugin(caller, abstractedAccountClient.appAddress.toString(), suggestedParams, optInPluginClient, asset, [], false);

  //   let error = 'no error';
  //   try {
  //     await callOptinPlugin(caller, abstractedAccountClient.appAddress.toString(), suggestedParams, optInPluginClient, asset, [], false);
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   } catch (e: any) {
  //     error = e.message;
  //   }

  //   expect(error).toContain(ERR_PLUGIN_ON_COOLDOWN);
  // });

  // test('neither sender nor global plugin exists', async () => {
  //   let error = 'no error';
  //   try {
  //     await callOptinPlugin(caller, abstractedAccountClient.appAddress.toString(), suggestedParams, optInPluginClient, asset);
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   } catch (e: any) {
  //     error = e.message;
  //   }

  //   expect(error).toContain(ERR_PLUGIN_DOES_NOT_EXIST);
  // });

  // test('expired', async () => {
  //   const { algorand } = fixture;

  //   const dispenser = await algorand.account.dispenserFromEnvironment();

  //   let accountInfo = await algorand.account.getInformation(abstractedAccountClient.appAddress)
  //   expect(accountInfo.balance.microAlgos).toEqual(accountInfo.minBalance.microAlgos)

  //   const mbr = (await abstractedAccountClient.send.mbr({
  //     args: {
  //       methodCount: 0,
  //       pluginName: '',
  //       escrowName: ''
  //     }
  //   })).return

  //   if (mbr === undefined) {
  //     throw new Error('MBR is undefined');
  //   }

  //   console.log(`Funding arc58 account with amount: ${mbr.plugins}`)

  //   await algorand.account.ensureFunded(abstractedAccountClient.appAddress, dispenser, mbr.plugins.microAlgo())

  //   await abstractedAccountClient.send.arc58AddPlugin({
  //     sender: aliceEOA.addr,
  //     signer: makeBasicAccountTransactionSigner(aliceEOA),
  //     args: {
  //       plugin,
  //       caller: ZERO_ADDRESS,
  //       escrow,
  //       admin: false,
  //       delegationType: 3,
  //       lastValid: 1,
  //       cooldown: 0,
  //       methods: [],
  //       useRounds: false,
  //       useExecutionKey: false
  //     }
  //   });

  //   accountInfo = await algorand.account.getInformation(abstractedAccountClient.appAddress)
  //   expect(accountInfo.balance.microAlgos).toEqual(accountInfo.minBalance.microAlgos)

  //   let error = 'no error';
  //   try {
  //     await callOptinPlugin(caller, abstractedAccountClient.appAddress.toString(), suggestedParams, optInPluginClient, asset);
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   } catch (e: any) {
  //     error = e.message;
  //   }

  //   expect(error).toContain(ERR_PLUGIN_EXPIRED);
  // });

  // test('erroneous app call in sandwich', async () => {
  //   const { algorand } = fixture;

  //   const dispenser = await algorand.account.dispenserFromEnvironment();

  //   let accountInfo = await algorand.account.getInformation(abstractedAccountClient.appAddress)
  //   expect(accountInfo.balance.microAlgos).toEqual(accountInfo.minBalance.microAlgos)

  //   const mbr = (await abstractedAccountClient.send.mbr({
  //     args: {
  //       methodCount: 0,
  //       pluginName: '',
  //       escrowName: ''
  //     }
  //   })).return

  //   if (mbr === undefined) {
  //     throw new Error('MBR is undefined');
  //   }

  //   console.log(`Funding arc58 account with amount: ${mbr.plugins}`)

  //   await algorand.account.ensureFunded(abstractedAccountClient.appAddress, dispenser, mbr.plugins.microAlgo())

  //   await abstractedAccountClient.send.arc58AddPlugin({
  //     sender: aliceEOA.addr,
  //     signer: makeBasicAccountTransactionSigner(aliceEOA),
  //     args: {
  //       plugin,
  //       caller: ZERO_ADDRESS,
  //       escrow,
  //       admin: false,
  //       delegationType: 3,
  //       lastValid: MAX_UINT64,
  //       cooldown: 0,
  //       methods: [],
  //       useRounds: false,
  //       useExecutionKey: false
  //     }
  //   });

  //   accountInfo = await algorand.account.getInformation(abstractedAccountClient.appAddress)
  //   expect(accountInfo.balance.microAlgos).toEqual(accountInfo.minBalance.microAlgos)

  //   const mbrPayment = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
  //     sender: caller.addr,
  //     receiver: abstractedAccountClient.appAddress,
  //     amount: 100_000,
  //     suggestedParams,
  //   });

  //   // create an extra app call that on its own would succeed
  //   const erroneousAppCall = (
  //     await abstractedAccountClient.createTransaction.arc58AddPlugin({
  //       sender: aliceEOA.addr,
  //       signer: makeBasicAccountTransactionSigner(aliceEOA),
  //       args: {
  //         plugin,
  //         caller: caller.addr.toString(),
  //         escrow,
  //         admin: false,
  //         delegationType: 3,
  //         lastValid: MAX_UINT64,
  //         cooldown: 0,
  //         methods: [],
  //         useRounds: false,
  //         useExecutionKey: false
  //       }
  //     })
  //   ).transactions[0];

  //   const optInGroup = (
  //     await (optInPluginClient
  //       .createTransaction
  //       .optInToAsset({
  //         sender: caller.addr,
  //         signer: makeBasicAccountTransactionSigner(caller),
  //         args: {
  //           walletId: abstractedAccountClient.appId,
  //           rekeyBack: true,
  //           assets: [asset],
  //           mbrPayment
  //         },
  //         extraFee: (1_000).microAlgos()
  //       }))
  //   ).transactions;

  //   let error = 'no error';
  //   try {
  //     await abstractedAccountClient
  //       .newGroup()
  //       .arc58RekeyToPlugin({
  //         sender: caller.addr,
  //         signer: makeBasicAccountTransactionSigner(caller),
  //         args: {
  //           plugin,
  //           global: true,
  //           escrow,
  //           methodOffsets: [],
  //           fundsRequest: []
  //         },
  //         extraFee: (1000).microAlgos()
  //       })
  //       // Add the mbr payment
  //       .addTransaction(optInGroup[0], makeBasicAccountTransactionSigner(caller)) // mbrPayment
  //       // Add the opt-in plugin call
  //       .addTransaction(optInGroup[1], makeBasicAccountTransactionSigner(caller)) // optInToAsset
  //       .addTransaction(erroneousAppCall, makeBasicAccountTransactionSigner(aliceEOA)) // erroneous app call
  //       .arc58VerifyAuthAddr({
  //         sender: caller.addr,
  //         signer: makeBasicAccountTransactionSigner(caller),
  //         args: {}
  //       })
  //       .send();
  //   } catch (e: any) {
  //     error = e.message;
  //   }

  //   expect(error).toContain(ERR_CANNOT_CALL_OTHER_APPS_DURING_REKEY);
  // });

  // test('malformed methodOffsets', async () => {
  //   const { algorand } = fixture;

  //   const dispenser = await algorand.account.dispenserFromEnvironment();

  //   let accountInfo = await algorand.account.getInformation(abstractedAccountClient.appAddress)
  //   expect(accountInfo.balance.microAlgos).toEqual(accountInfo.minBalance.microAlgos)

  //   const mbr = (await abstractedAccountClient.send.mbr({
  //     args: {
  //       methodCount: 1,
  //       pluginName: '',
  //       escrowName: ''
  //     }
  //   })).return

  //   if (mbr === undefined) {
  //     throw new Error('MBR is undefined');
  //   }

  //   console.log(`Funding arc58 account with amount: ${mbr.plugins}`)

  //   await algorand.account.ensureFunded(abstractedAccountClient.appAddress, dispenser, mbr.plugins.microAlgo())

  //   await abstractedAccountClient.send.arc58AddPlugin({
  //     sender: aliceEOA.addr,
  //     signer: makeBasicAccountTransactionSigner(aliceEOA),
  //     args: {
  //       plugin,
  //       caller: ZERO_ADDRESS,
  //       escrow,
  //       admin: false,
  //       delegationType: 0,
  //       lastValid: MAX_UINT64,
  //       cooldown: 0,
  //       methods: [
  //         [new Uint8Array(Buffer.from('dddd')), 0]
  //       ],
  //       useRounds: false,
  //       useExecutionKey: false
  //     }
  //   });

  //   let error = 'no error';
  //   try {
  //     await callOptinPlugin(caller, abstractedAccountClient.appAddress.toString(), suggestedParams, optInPluginClient, asset, []);
  //   } catch (e: any) {
  //     error = e.message;
  //   }

  //   expect(error).toContain(ERR_MALFORMED_OFFSETS);
  // });

  // test('allowance - flat', async () => {
  //   const { algorand } = fixture;
  //   escrow = 'pay_plugin';

  //   const dispenser = await algorand.account.dispenserFromEnvironment();

  //   let accountInfo = await algorand.account.getInformation(abstractedAccountClient.appAddress)
  //   expect(accountInfo.balance.microAlgos).toEqual(accountInfo.minBalance.microAlgos)

  //   const mbr = (await abstractedAccountClient.send.mbr({
  //     args: {
  //       methodCount: 0,
  //       pluginName: '',
  //       escrowName: escrow
  //     }
  //   })).return

  //   if (mbr === undefined) {
  //     throw new Error('MBR is undefined');
  //   }

  //   console.log(`Funding arc58 account with amount: ${mbr.plugins}`)
  //   await algorand.account.ensureFunded(abstractedAccountClient.appAddress, dispenser, mbr.plugins.microAlgo())

  //   const randomAccount = algorand.account.random().account;

  //   await algorand.account.ensureFunded(
  //     randomAccount.addr,
  //     dispenser,
  //     (100).algos(),
  //   );

  //   const mbrPayment = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
  //     sender: aliceEOA.addr,
  //     receiver: abstractedAccountClient.appAddress,
  //     amount: 100_000,
  //     suggestedParams,
  //   });

  //   await abstractedAccountClient.send
  //     .arc58AddPlugin({
  //       sender: aliceEOA.addr,
  //       signer: makeBasicAccountTransactionSigner(aliceEOA),
  //       args: {
  //         plugin,
  //         caller: ZERO_ADDRESS,
  //         escrow,
  //         admin: false,
  //         delegationType: 3,
  //         lastValid: MAX_UINT64,
  //         cooldown: 1,
  //         methods: [],
  //         useRounds: false,
  //         useExecutionKey: false
  //       }
  //     })

  //   accountInfo = await algorand.account.getInformation(abstractedAccountClient.appAddress)
  //   expect(accountInfo.balance.microAlgos).toEqual(accountInfo.minBalance.microAlgos)

  //   await callOptinPlugin(caller, abstractedAccountClient.appAddress.toString(), suggestedParams, optInPluginClient, asset, [], true);

  //   const escrowCreationCost = BigInt(112_100 + 100_000) // Global.minBalance
  //   const amount = mbr.plugins + mbr.allowances + mbr.escrows + escrowCreationCost

  //   console.log(`Funding arc58 account with amount: ${amount}`)
  //   await algorand.account.ensureFunded(abstractedAccountClient.appAddress, dispenser, amount.microAlgo())

  //   await abstractedAccountClient.newGroup()
  //     .addTransaction(
  //       algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
  //         sender: randomAccount.addr,
  //         receiver: randomAccount.addr,
  //         amount: 0,
  //         assetIndex: asset,
  //         suggestedParams
  //       }),
  //       makeBasicAccountTransactionSigner(randomAccount)
  //     )
  //     .addTransaction(
  //       algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
  //         sender: aliceEOA.addr,
  //         receiver: abstractedAccountClient.appAddress,
  //         amount: 100_000_000,
  //         assetIndex: asset,
  //         suggestedParams
  //       }),
  //       makeBasicAccountTransactionSigner(aliceEOA)
  //     )
  //     .arc58AddPlugin({
  //       sender: aliceEOA.addr,
  //       signer: makeBasicAccountTransactionSigner(aliceEOA),
  //       args: {
  //         plugin: payPlugin,
  //         caller: ZERO_ADDRESS,
  //         escrow,
  //         admin: false,
  //         delegationType: 3,
  //         lastValid: MAX_UINT64,
  //         cooldown: 1,
  //         methods: [],
  //         useRounds: false,
  //         useExecutionKey: false
  //       }
  //     })
  //     .arc58AddAllowances({
  //       sender: aliceEOA.addr,
  //       signer: makeBasicAccountTransactionSigner(aliceEOA),
  //       args: {
  //         escrow,
  //         allowances: [[
  //           asset,
  //           1, // type
  //           10_000_000, // allowed
  //           0, // max
  //           300, // interval
  //           false, // useRounds
  //         ]]
  //       },
  //     })
  //     .arc58PluginOptinEscrow({
  //       sender: aliceEOA.addr,
  //       signer: makeBasicAccountTransactionSigner(aliceEOA),
  //       args: {
  //         plugin: payPlugin,
  //         caller: ZERO_ADDRESS,
  //         escrow,
  //         assets: [asset],
  //         mbrPayment,
  //       },
  //       extraFee: (8000).microAlgos(),
  //     })
  //     .send()

  //   accountInfo = await algorand.account.getInformation(abstractedAccountClient.appAddress)
  //   expect(accountInfo.balance.microAlgos).toEqual(accountInfo.minBalance.microAlgos)

  //   // use the full amount
  //   await callPayPlugin(caller, payPluginClient, randomAccount.addr.toString(), asset, 6_000_000n, [], true);

  //   const escrowAppID = (await abstractedAccountClient.appClient.getBoxValueFromABIType(
  //     new Uint8Array(Buffer.concat([Buffer.from('e'), Buffer.from('pay_plugin')])),
  //     EscrowInfoAbiType
  //   )) as bigint;

  //   console.log('escrowAppID', escrowAppID);

  //   let allowanceBox = (await abstractedAccountClient.appClient.getBoxValueFromABIType(
  //     new Uint8Array(
  //       Buffer.concat([
  //         Buffer.from('a'),
  //         Buffer.from(algosdk.encodeUint64(escrowAppID)),
  //         Buffer.from(algosdk.encodeUint64(asset)),
  //       ])
  //     ),
  //     AllowanceInfoAbiType
  //   )) as AllowanceInfoTuple;

  //   expect(allowanceBox[3]).toBe(6_000_000n); // type 2 is window

  //   await callPayPlugin(caller, payPluginClient, randomAccount.addr.toString(), asset, 2_000_000n, [], true);

  //   allowanceBox = (await abstractedAccountClient.appClient.getBoxValueFromABIType(
  //     new Uint8Array(
  //       Buffer.concat([
  //         Buffer.from('a'),
  //         Buffer.from(algosdk.encodeUint64(escrowAppID)),
  //         Buffer.from(algosdk.encodeUint64(asset)),
  //       ])
  //     ),
  //     AllowanceInfoAbiType
  //   )) as AllowanceInfoTuple;

  //   expect(allowanceBox[3]).toBe(8_000_000n); // type 2 is window

  //   // try to use more
  //   let error = 'no error';
  //   try {
  //     await callPayPlugin(caller, payPluginClient, randomAccount.addr.toString(), asset, 8_000_000n, [], true)
  //   } catch (e: any) {
  //     error = e.message;
  //   }

  //   expect(error).toContain(ERR_ALLOWANCE_EXCEEDED);
  // })

  // test('allowance - window', async () => {
  //   const { algorand } = fixture;
  //   escrow = 'pay_plugin_window'

  //   const dispenser = await algorand.account.dispenserFromEnvironment();

  //   let accountInfo = await algorand.account.getInformation(abstractedAccountClient.appAddress)
  //   expect(accountInfo.balance.microAlgos).toEqual(accountInfo.minBalance.microAlgos)

  //   const mbr = (await abstractedAccountClient.send.mbr({
  //     args: {
  //       methodCount: 0,
  //       pluginName: '',
  //       escrowName: escrow,
  //     }
  //   })).return

  //   if (mbr === undefined) {
  //     throw new Error('MBR is undefined');
  //   }

  //   console.log(`Funding arc58 account with amount: ${mbr.plugins}`)
  //   await algorand.account.ensureFunded(abstractedAccountClient.appAddress, dispenser, mbr.plugins.microAlgo())

  //   const randomAccount = algorand.account.random().account;

  //   await algorand.account.ensureFunded(
  //     randomAccount.addr,
  //     dispenser,
  //     (100).algos(),
  //   );

  //   const mbrPayment = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
  //     sender: aliceEOA.addr,
  //     receiver: abstractedAccountClient.appAddress,
  //     amount: 100_000,
  //     suggestedParams,
  //   });

  //   await abstractedAccountClient.send
  //     .arc58AddPlugin({
  //       sender: aliceEOA.addr,
  //       signer: makeBasicAccountTransactionSigner(aliceEOA),
  //       args: {
  //         plugin,
  //         caller: ZERO_ADDRESS,
  //         escrow,
  //         admin: false,
  //         delegationType: 3,
  //         lastValid: MAX_UINT64,
  //         cooldown: 1,
  //         methods: [],
  //         useRounds: false,
  //         useExecutionKey: false
  //       }
  //     })

  //   accountInfo = await algorand.account.getInformation(abstractedAccountClient.appAddress)
  //   expect(accountInfo.balance.microAlgos).toEqual(accountInfo.minBalance.microAlgos)

  //   await callOptinPlugin(caller, abstractedAccountClient.appAddress.toString(), suggestedParams, optInPluginClient, asset, [], true);

  //   const escrowCreationCost = BigInt(112_100 + 100_000) // Global.minBalance
  //   const amount = mbr.plugins + mbr.allowances + mbr.escrows + escrowCreationCost
  //   console.log(`Funding arc58 account with amount: ${amount}`)
  //   await algorand.account.ensureFunded(abstractedAccountClient.appAddress, dispenser, amount.microAlgo())

  //   await abstractedAccountClient.newGroup()
  //     .addTransaction(algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
  //       sender: randomAccount.addr,
  //       receiver: randomAccount.addr,
  //       amount: 0,
  //       assetIndex: asset,
  //       suggestedParams
  //     }), makeBasicAccountTransactionSigner(randomAccount))
  //     .addTransaction(algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
  //       sender: aliceEOA.addr,
  //       receiver: abstractedAccountClient.appAddress,
  //       amount: 100_000_000,
  //       assetIndex: asset,
  //       suggestedParams
  //     }), makeBasicAccountTransactionSigner(aliceEOA))
  //     .arc58AddPlugin({
  //       sender: aliceEOA.addr,
  //       signer: makeBasicAccountTransactionSigner(aliceEOA),
  //       args: {
  //         plugin: payPlugin,
  //         caller: ZERO_ADDRESS,
  //         escrow,
  //         admin: false,
  //         delegationType: 3,
  //         lastValid: MAX_UINT64,
  //         cooldown: 1,
  //         methods: [],
  //         useRounds: false,
  //         useExecutionKey: false
  //       }
  //     })
  //     .arc58AddAllowances({
  //       sender: aliceEOA.addr,
  //       signer: makeBasicAccountTransactionSigner(aliceEOA),
  //       args: {
  //         escrow,
  //         allowances: [
  //           [
  //             asset,
  //             2, // type
  //             10_000_000, // allowed
  //             0, // max
  //             300, // interval
  //             false, // useRounds
  //           ]
  //         ]
  //       },
  //     })
  //     .arc58PluginOptinEscrow({
  //       sender: aliceEOA.addr,
  //       signer: makeBasicAccountTransactionSigner(aliceEOA),
  //       args: {
  //         plugin: payPlugin,
  //         caller: ZERO_ADDRESS,
  //         escrow,
  //         assets: [asset],
  //         mbrPayment,
  //       },
  //       extraFee: (8000).microAlgos(),
  //     })
  //     .send()

  //   accountInfo = await algorand.account.getInformation(abstractedAccountClient.appAddress)
  //   expect(accountInfo.balance.microAlgos).toEqual(accountInfo.minBalance.microAlgos)

  //   // use the full amount
  //   await callPayPlugin(caller, payPluginClient, randomAccount.addr.toString(), asset, 10_000_000n, [], true);

  //   const escrowAppID = (await abstractedAccountClient.appClient.getBoxValueFromABIType(
  //     new Uint8Array(Buffer.concat([Buffer.from('e'), Buffer.from('pay_plugin_window')])),
  //     EscrowInfoAbiType
  //   )) as bigint;

  //   let allowanceBox = (await abstractedAccountClient.appClient.getBoxValueFromABIType(
  //     new Uint8Array(
  //       Buffer.concat([
  //         Buffer.from('a'),
  //         Buffer.from(algosdk.encodeUint64(escrowAppID)),
  //         Buffer.from(algosdk.encodeUint64(asset)),
  //       ])
  //     ),
  //     AllowanceInfoAbiType
  //   )) as AllowanceInfoTuple;

  //   expect(allowanceBox[3]).toBe(10_000_000n); // type 2 is window

  //   let globalPluginBox = (await abstractedAccountClient.appClient.getBoxValueFromABIType(
  //     new Uint8Array(
  //       Buffer.concat([
  //         Buffer.from('p'),
  //         Buffer.from(algosdk.encodeUint64(payPlugin)),
  //         algosdk.decodeAddress(ZERO_ADDRESS).publicKey,
  //       ])
  //     ),
  //     PluginInfoAbiType
  //   )) as PluginInfoTuple;

  //   const spendingAddress = algosdk.getApplicationAddress(globalPluginBox[2]);

  //   const spendingAddressInfo = await algorand.account.getInformation(spendingAddress.toString())

  //   expect(spendingAddressInfo.authAddr?.toString()).toBe(abstractedAccountClient.appAddress.toString());

  //   // try to use more
  //   let error = 'no error';
  //   try {
  //     await callPayPlugin(caller, payPluginClient, randomAccount.addr.toString(), asset, 1n, [], true)
  //   } catch (e: any) {
  //     error = e.message;
  //   }

  //   expect(error).toContain(ERR_ALLOWANCE_EXCEEDED);

  //   // wait for the next window
  //   for (let i = 0; i < 3; i++) {
  //     await callPayPlugin(caller, payPluginClient, randomAccount.addr.toString(), asset, 0n, [], true)
  //   }

  //   // use more
  //   await callPayPlugin(caller, payPluginClient, randomAccount.addr.toString(), asset, 1_000_000n, [], true);

  //   allowanceBox = (await abstractedAccountClient.appClient.getBoxValueFromABIType(
  //     new Uint8Array(
  //       Buffer.concat([
  //         Buffer.from('a'),
  //         Buffer.from(algosdk.encodeUint64(escrowAppID)),
  //         Buffer.from(algosdk.encodeUint64(asset)),
  //       ])
  //     ),
  //     AllowanceInfoAbiType
  //   )) as AllowanceInfoTuple;

  //   expect(allowanceBox[3]).toBe(1_000_000n); // type 2 is window

  //   await callPayPlugin(caller, payPluginClient, randomAccount.addr.toString(), asset, 8_000_000n, [], true);

  //   // try to use more
  //   error = 'no error';
  //   try {
  //     await callPayPlugin(caller, payPluginClient, randomAccount.addr.toString(), asset, 2_000_000n, [], true)
  //   } catch (e: any) {
  //     error = e.message;
  //   }

  //   expect(error).toContain(ERR_ALLOWANCE_EXCEEDED);
  // })

  // test('allowance - drip', async () => {
  //   const { algorand } = fixture;
  //   escrow = 'pay_plugin_drip';

  //   const dispenser = await algorand.account.dispenserFromEnvironment();

  //   let accountInfo = await algorand.account.getInformation(abstractedAccountClient.appAddress)
  //   expect(accountInfo.balance.microAlgos).toEqual(accountInfo.minBalance.microAlgos)

  //   const mbr = (await abstractedAccountClient.send.mbr({
  //     args: {
  //       methodCount: 0,
  //       pluginName: '',
  //       escrowName: escrow,
  //     }
  //   })).return

  //   if (mbr === undefined) {
  //     throw new Error('MBR is undefined');
  //   }

  //   console.log(`Funding arc58 account with amount: ${mbr.plugins}`)
  //   await algorand.account.ensureFunded(abstractedAccountClient.appAddress, dispenser, mbr.plugins.microAlgo());

  //   const randomAccount = algorand.account.random().account;

  //   await algorand.account.ensureFunded(
  //     randomAccount.addr,
  //     dispenser,
  //     (100).algos(),
  //   );

  //   const mbrPayment = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
  //     sender: aliceEOA.addr,
  //     receiver: abstractedAccountClient.appAddress,
  //     amount: 100_000,
  //     suggestedParams,
  //   });

  //   await abstractedAccountClient.send
  //     .arc58AddPlugin({
  //       sender: aliceEOA.addr,
  //       signer: makeBasicAccountTransactionSigner(aliceEOA),
  //       args: {
  //         plugin,
  //         caller: ZERO_ADDRESS,
  //         escrow,
  //         admin: false,
  //         delegationType: 3,
  //         lastValid: MAX_UINT64,
  //         cooldown: 1,
  //         methods: [],
  //         useRounds: false,
  //         useExecutionKey: false
  //       }
  //     })

  //   accountInfo = await algorand.account.getInformation(abstractedAccountClient.appAddress)
  //   expect(accountInfo.balance.microAlgos).toEqual(accountInfo.minBalance.microAlgos)

  //   await callOptinPlugin(caller, abstractedAccountClient.appAddress.toString(), suggestedParams, optInPluginClient, asset, [], true);

  //   const escrowCreationCost = BigInt(112_100 + 100_000) // Global.minBalance
  //   const amount = mbr.plugins + mbr.allowances + mbr.escrows + escrowCreationCost;
  //   console.log(`Funding arc58 account with amount: ${amount}`)
  //   await algorand.account.ensureFunded(abstractedAccountClient.appAddress, dispenser, amount.microAlgo());

  //   await abstractedAccountClient.newGroup()
  //     .addTransaction(algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
  //       sender: randomAccount.addr,
  //       receiver: randomAccount.addr,
  //       amount: 0,
  //       assetIndex: asset,
  //       suggestedParams
  //     }), makeBasicAccountTransactionSigner(randomAccount))
  //     .addTransaction(algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
  //       sender: aliceEOA.addr,
  //       receiver: abstractedAccountClient.appAddress,
  //       amount: 100_000_000,
  //       assetIndex: asset,
  //       suggestedParams
  //     }), makeBasicAccountTransactionSigner(aliceEOA))
  //     .arc58AddPlugin({
  //       sender: aliceEOA.addr,
  //       signer: makeBasicAccountTransactionSigner(aliceEOA),
  //       args: {
  //         plugin: payPlugin,
  //         caller: ZERO_ADDRESS,
  //         admin: false,
  //         delegationType: 3,
  //         escrow,
  //         lastValid: MAX_UINT64,
  //         cooldown: 1,
  //         methods: [],
  //         useRounds: true,
  //         useExecutionKey: false
  //       }
  //     })
  //     .arc58AddAllowances({
  //       sender: aliceEOA.addr,
  //       signer: makeBasicAccountTransactionSigner(aliceEOA),
  //       args: {
  //         escrow,
  //         allowances: [
  //           [
  //             asset,
  //             3, // type
  //             1_000_000, // allowed
  //             50_000_000, // max
  //             1, // interval
  //             true, // useRounds
  //           ]
  //         ]
  //       },
  //     })
  //     .arc58PluginOptinEscrow({
  //       sender: aliceEOA.addr,
  //       signer: makeBasicAccountTransactionSigner(aliceEOA),
  //       args: {
  //         plugin: payPlugin,
  //         caller: ZERO_ADDRESS,
  //         escrow,
  //         assets: [asset],
  //         mbrPayment,
  //       },
  //       extraFee: (8000).microAlgos(),
  //     })
  //     .send()

  //   // use the full amount
  //   await callPayPlugin(caller, payPluginClient, randomAccount.addr.toString(), asset, 1_000_000n, [], true);

  //   const escrowAppID = (await abstractedAccountClient.appClient.getBoxValueFromABIType(
  //     new Uint8Array(Buffer.concat([Buffer.from('e'), Buffer.from('pay_plugin_drip')])),
  //     EscrowInfoAbiType
  //   )) as bigint;

  //   let allowanceBox = (await abstractedAccountClient.appClient.getBoxValueFromABIType(
  //     new Uint8Array(
  //       Buffer.concat([
  //         Buffer.from('a'),
  //         Buffer.from(algosdk.encodeUint64(escrowAppID)),
  //         Buffer.from(algosdk.encodeUint64(asset)),
  //       ])
  //     ),
  //     AllowanceInfoAbiType
  //   )) as AllowanceInfoTuple;

  //   expect(allowanceBox[3]).toBe(49_000_000n);

  //   await callPayPlugin(caller, payPluginClient, randomAccount.addr.toString(), asset, 48_000_000n, [], true)

  //   // try to use more
  //   let error = 'no error';
  //   try {
  //     await callPayPlugin(caller, payPluginClient, randomAccount.addr.toString(), asset, 5_000_000n, [], true)
  //   } catch (e: any) {
  //     error = e.message;
  //   }

  //   expect(error).toContain(ERR_ALLOWANCE_EXCEEDED);

  //   // wait for the next window
  //   for (let i = 0; i < 3; i++) {
  //     await callPayPlugin(caller, payPluginClient, randomAccount.addr.toString(), asset, 0n, [], true)
  //   }

  //   await callPayPlugin(caller, payPluginClient, randomAccount.addr.toString(), asset, 0n, [], true);

  //   allowanceBox = (await abstractedAccountClient.appClient.getBoxValueFromABIType(
  //     new Uint8Array(
  //       Buffer.concat([
  //         Buffer.from('a'),
  //         Buffer.from(algosdk.encodeUint64(escrowAppID)),
  //         Buffer.from(algosdk.encodeUint64(asset)),
  //       ])
  //     ),
  //     AllowanceInfoAbiType
  //   )) as AllowanceInfoTuple;

  //   expect(allowanceBox[3]).toBe(6_000_000n);
  // })

  // test('execution key', async () => {

  // })
});
