import { describe, test, beforeAll, beforeEach, expect } from '@jest/globals';
// import { beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import algosdk, { makeBasicAccountTransactionSigner, makePaymentTxnWithSuggestedParamsFromObject } from 'algosdk';
import { microAlgos } from '@algorandfoundation/algokit-utils';
import { ABSTRACTED_ACCOUNT_MINT_PAYMENT } from '../plugins/abstract_account_plugins.test';
import { AbstractedAccountClient } from '../../artifacts/arc58/account/AbstractedAccountClient';
import { AbstractedAccountFactoryFactory } from '../../artifacts/arc58/account/AbstractedAccountFactoryClient';
import { EscrowFactoryFactory } from '../../artifacts/escrow/EscrowFactoryClient';

const ZERO_ADDRESS = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ';
const fixture = algorandFixture();

describe('Rekeying Test', () => {
  // let algod: Algodv2;
  /** Alice's externally owned account (ie. a keypair account she has in Defly) */
  let aliceEOA: algosdk.Account;
  /** The address of Alice's new abstracted account. Sends app calls from aliceEOA unless otherwise specified */
  let aliceAbstractedAccount: string;
  /** The client for Alice's abstracted account */
  let abstractedAccountClient: AbstractedAccountClient;
  /** The suggested params for transactions */
  let suggestedParams: algosdk.SuggestedParams;

  beforeEach(fixture.beforeEach);

  beforeAll(async () => {
    await fixture.beforeEach();
    const { algorand, algod } = fixture.context;
    suggestedParams = await algorand.getSuggestedParams();
    aliceEOA = await fixture.context.generateAccount({ initialFunds: microAlgos(100_000_000) });

    await algod.setBlockOffsetTimestamp(60).do();

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

    const abstractedAccountFactoryClient = results.appClient

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

    // Fund the abstracted account with some ALGO to later spend
    await abstractedAccountClient.appClient.fundAppAccount({ amount: (4).algos() });
  });

  test('Alice does not rekey back to the app', async () => {
    await expect(
      abstractedAccountClient
        .newGroup()
        // Step one: rekey abstracted account to Alice
        .arc58RekeyTo({
          sender: aliceEOA.addr,
          extraFee: (1000).microAlgos(),
          args: {
            address: aliceEOA.addr.toString(),
            flash: true,
          }
        })
        // Step two: make payment from abstracted account
        .addTransaction(algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          sender: aliceAbstractedAccount,
          receiver: aliceAbstractedAccount,
          amount: 0,
          suggestedParams: { ...suggestedParams, fee: 1000, flatFee: true },
        }),
          // signer: makeBasicAccountTransactionSigner(aliceEOA),
        ).send()
    ).rejects.toThrowError();
  });
});
