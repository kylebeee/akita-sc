import { describe, test, beforeAll, beforeEach, expect } from '@jest/globals';
// import { beforeAll, beforeEach, describe, test } from 'vitest'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import * as algokit from '@algorandfoundation/algokit-utils';
import algosdk, { encodeUint64, makeBasicAccountTransactionSigner, makePaymentTxnWithSuggestedParamsFromObject } from 'algosdk';
import { AbstractedAccountFactoryClient, AbstractedAccountFactoryFactory } from '../../artifacts/arc58/account/AbstractedAccountFactoryClient';
import { AbstractedAccountClient } from '../../artifacts/arc58/account/AbstractedAccountClient';
import { OptInPluginClient, OptInPluginFactory } from '../../artifacts/arc58/plugins/optin/OptInPluginClient';
import { EscrowFactoryFactory } from '../../artifacts/escrow/EscrowFactoryClient';

export const ABSTRACTED_ACCOUNT_MINT_PAYMENT = 1_028_000 + 12_100
const ZERO_ADDRESS = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ';
algokit.Config.configure({ populateAppCallResources: true });
const fixture = algorandFixture();

describe('Abstracted Subscription Program', () => {
  /** Alice's externally owned account (ie. a keypair account she has in Pera) */
  let aliceEOA: algosdk.Account;
  /** The client for the abstracted account factory */
  let abstractedAccountFactoryClient: AbstractedAccountFactoryClient
  /** The address of Alice's new abstracted account. Sends app calls from aliceEOA unless otherwise specified */
  let aliceAbstractedAccount: string;
  /** The client for Alice's abstracted account */
  let abstractedAccountClient: AbstractedAccountClient;
  /** The client for the opt-in plugin */
  let optInPluginClient: OptInPluginClient;
  /** The ID of the opt-in plugin */
  let optInPluginID: bigint;
  /** The suggested params for transactions */
  let suggestedParams: algosdk.SuggestedParams;
  /** The escrow address to use for the abstracted account */
  let escrow: string = ''

  /** The maximum uint64 value. Used to indicate a never-expiring plugin */
  const maxUint64 = BigInt('18446744073709551615');

  beforeEach(fixture.beforeEach);

  beforeAll(async () => {
    await fixture.beforeEach();
    const { algorand, testAccount } = fixture.context;
    suggestedParams = await algorand.getSuggestedParams();
    aliceEOA = testAccount;

    const escrowFactory = new EscrowFactoryFactory({
      defaultSender: aliceEOA.addr,
      defaultSigner: makeBasicAccountTransactionSigner(aliceEOA),
      algorand
    })

    const escrowFactoryResults = await escrowFactory.send.create.bare()

    await escrowFactoryResults.appClient.appClient.fundAppAccount({ amount: (100_000).microAlgos() });

    const minterFactory = new AbstractedAccountFactoryFactory({
      defaultSender: aliceEOA.addr,
      defaultSigner: makeBasicAccountTransactionSigner(aliceEOA),
      algorand,
    })

    const results = await minterFactory.send.create.create({
      args: {
        akitaDao: 0,
        version: '1',
        childVersion: '1',
        escrowFactoryApp: escrowFactoryResults.appClient.appId,
        revocationApp: 0,
      },
    })

    await results.appClient.appClient.fundAppAccount({ amount: (100_000).microAlgos() });

    abstractedAccountFactoryClient = results.appClient

    const mintPayment = makePaymentTxnWithSuggestedParamsFromObject({
      sender: aliceEOA.addr,
      receiver: abstractedAccountFactoryClient.appAddress,
      amount: ABSTRACTED_ACCOUNT_MINT_PAYMENT,
      suggestedParams,
    })

    const mResults = await abstractedAccountFactoryClient.send.mint({
      sender: aliceEOA.addr,
      signer: makeBasicAccountTransactionSigner(aliceEOA),
      args: {
        payment: mintPayment,
        controlledAddress: ZERO_ADDRESS,
        admin: aliceEOA.addr.toString(),
        nickname: 'Alice',
      },
      extraFee: (2_000).microAlgo(),
    })

    const freshAbstractedAccountId = mResults.return!

    abstractedAccountClient = algorand.client.getTypedAppClientById(AbstractedAccountClient, {
      defaultSender: aliceEOA.addr,
      defaultSigner: makeBasicAccountTransactionSigner(aliceEOA),
      appId: freshAbstractedAccountId,
    })

    await abstractedAccountClient.send.init({ args: {}, extraFee: (3_000).microAlgo() })

    aliceAbstractedAccount = abstractedAccountClient.appAddress.toString()

    // Fund the abstracted account with 0.2 ALGO so it can hold an ASA
    await abstractedAccountClient.appClient.fundAppAccount({ amount: algokit.microAlgos(200_000) });

    const optinPluginMinter = new OptInPluginFactory({
      defaultSender: aliceEOA.addr,
      defaultSigner: makeBasicAccountTransactionSigner(aliceEOA),
      algorand
    });

    const optInMintResults = await optinPluginMinter.send.create.bare()
    optInPluginClient = optInMintResults.appClient;
    optInPluginID = optInPluginClient.appId;
  });

  describe('Named OptIn Plugin', () => {
    let bob: algosdk.Account;
    let asset: bigint;

    const nameBox = new Uint8Array(Buffer.concat([Buffer.from('n'), Buffer.from('optIn')]));

    let pluginBox: Uint8Array;

    const boxes: Uint8Array[] = [nameBox];

    beforeAll(async () => {
      bob = fixture.context.testAccount;
      const { algorand } = fixture.context;

      // Create an asset
      const txn = await algorand.send.assetCreate({
        sender: bob.addr,
        total: BigInt(1),
        decimals: 0,
        defaultFrozen: false,
      });

      asset = BigInt(txn.confirmation!.assetIndex!);

      pluginBox = new Uint8Array(
        Buffer.concat([
          Buffer.from('p'),
          Buffer.from(encodeUint64(optInPluginID)),
          algosdk.decodeAddress(ZERO_ADDRESS).publicKey,
        ])
      );

      boxes.push(pluginBox);
    });

    test('Alice adds the app to the abstracted account', async () => {
      await abstractedAccountClient.appClient.fundAppAccount({
        sender: aliceEOA.addr,
        signer: makeBasicAccountTransactionSigner(aliceEOA),
        amount: algokit.microAlgos(58600)
      });

      // Add opt-in plugin
      await abstractedAccountClient.send.arc58AddNamedPlugin({
        sender: aliceEOA.addr,
        signer: makeBasicAccountTransactionSigner(aliceEOA),
        args: {
          name: 'optIn',
          plugin: optInPluginID,
          caller: ZERO_ADDRESS,
          escrow,
          admin: false,
          delegationType: 3,
          lastValid: maxUint64,
          cooldown: 0,
          methods: [],
          useRounds: false,
          useExecutionKey: false
        }
      });
    });

    test("Bob opts Alice's abstracted account into the asset", async () => {
      // Form a payment from bob to alice's abstracted account to cover the MBR
      const mbrPayment = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        sender: bob.addr,
        receiver: aliceAbstractedAccount,
        amount: 100_000,
        suggestedParams,
      });

      // Form the group txn needed to call the opt-in plugin
      const optInGroup = (
        await (optInPluginClient
          .createTransaction
          .optInToAsset({
            sender: bob.addr,
            args: {
              walletId: abstractedAccountClient.appId,
              rekeyBack: true,
              assets: [asset],
              mbrPayment
            },
            extraFee: (1_000).microAlgo()
          }))
      ).transactions;

      // Compose the group needed to actually use the plugin
      await abstractedAccountClient
        .newGroup()
        // Rekey to the opt-in plugin
        .arc58RekeyToNamedPlugin({
          sender: bob.addr,
          signer: makeBasicAccountTransactionSigner(bob),
          args: {
            name: 'optIn',
            global: true,
            escrow,
            methodOffsets: [],
            fundsRequest: []
          },
          extraFee: (1_000).microAlgo(),
          boxReferences: boxes,
          assetReferences: [asset],
        })
        // Add the mbr payment
        .addTransaction(optInGroup[0], makeBasicAccountTransactionSigner(bob)) // mbrPayment
        // Add the opt-in plugin call
        .addTransaction(optInGroup[1], makeBasicAccountTransactionSigner(bob)) // optInToAsset
        // Call verify auth addr to verify the abstracted account is rekeyed back to itself
        .arc58VerifyAuthAddr()
        .send();
    });
  });
});
