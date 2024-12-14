import { describe, test, expect, beforeAll, beforeEach } from '@jest/globals';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import * as algokit from '@algorandfoundation/algokit-utils';
import algosdk, { ALGORAND_MIN_TX_FEE } from 'algosdk';
import { MetaMerklesClient } from '../clients/MetaMerklesClient';
import { StandardMerkleTree } from "@joe-p/merkle-tree";

import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account';
import { HexString } from '@joe-p/merkle-tree/dist/bytes';
import { MAX_ROOT_BOX_MBR, MAX_SCHEMA_BOX_MBR, MAX_TYPE_BOX_MBR } from '../contracts/metaMerkles/meta_merkles.algo';

const fixture = algorandFixture();
algokit.Config.configure({ populateAppCallResources: true });

describe('MetaMerkles', () => {

  let suggestedParams: algosdk.SuggestedParams;
  let metaMerklesAppAddress: string;
  let metaMerklesClient: MetaMerklesClient;
  let bobsAccount: algosdk.Account & TransactionSignerAccount;
  let treeValues: number[];
  let tree: StandardMerkleTree<any>;

  beforeEach(fixture.beforeEach);

  beforeAll(async () => {
    await fixture.beforeEach();
    const { algod, testAccount } = fixture.context;
    bobsAccount = testAccount;
    
    treeValues = [0,1,2];
    tree = StandardMerkleTree.of(treeValues, 'uint64', { hashFunction: 'sha256' });

    await algokit.ensureFunded({
      accountToFund: bobsAccount.addr,
      minSpendingBalance: algokit.algos(1000),
    }, algod)

    const { algorand } = fixture;
    suggestedParams = await algod.getTransactionParams().do();

    metaMerklesClient = new MetaMerklesClient(
      {
        sender: bobsAccount,
        resolveBy: 'id',
        id: 0,
      },
      algorand.client.algod
    );

    // await abstractedAccountClient.appClient.fundAppAccount({ amount: algokit.microAlgos(200_000) });

    await metaMerklesClient.create.createApplication({});

    metaMerklesAppAddress = (await metaMerklesClient.appClient.getAppReference()).appAddress;

    await metaMerklesClient.addSchema({
      pmt: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: bobsAccount.addr,
        to: metaMerklesAppAddress,
        amount: 100_000_000,
        suggestedParams,
      }),
      desc: 'Unspecified'
    });

    await metaMerklesClient.addSchema({
      pmt: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: bobsAccount.addr,
        to: metaMerklesAppAddress,
        amount: 100_000_000,
        suggestedParams,
      }),
      desc: 'String'
    });

    await metaMerklesClient.addSchema({
      pmt: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: bobsAccount.addr,
        to: metaMerklesAppAddress,
        amount: 100_000_000,
        suggestedParams,
      }),
      desc: 'Uint64'
    });

    await metaMerklesClient.addSchema({
      pmt: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: bobsAccount.addr,
        to: metaMerklesAppAddress,
        amount: 100_000_000,
        suggestedParams,
      }),
      desc: 'DoubleUint64'
    });

    // set all the default schema and types
    await metaMerklesClient.addType({
      pmt: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: bobsAccount.addr,
        to: metaMerklesAppAddress,
        amount: 100_000_000,
        suggestedParams,
      }),
      desc: 'Unspecified'
    });

    await metaMerklesClient.addType({
      pmt: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: bobsAccount.addr,
        to: metaMerklesAppAddress,
        amount: 100_000_000,
        suggestedParams,
      }),
      desc: 'Collection'
    });

    await metaMerklesClient.addType({
      pmt: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: bobsAccount.addr,
        to: metaMerklesAppAddress,
        amount: 100_000_000,
        suggestedParams,
      }),
      desc: 'Trait'
    });

    await metaMerklesClient.addType({
      pmt: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: bobsAccount.addr,
        to: metaMerklesAppAddress,
        amount: 100_000_000,
        suggestedParams,
      }),
      desc: 'Trade'
    });
  });

  describe('Metamerkles program', () => {

    /** The boxes to pass to app calls */
    test('Addroot', async () => {
      console.log(bobsAccount.addr);
      console.log('Merkle Root:', tree.render());
      console.log(JSON.stringify(tree.dump()));
      console.log(Buffer.from(tree.root.slice(2), 'hex').length);

      await metaMerklesClient.addRoot(
        {
          pmt: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: bobsAccount.addr,
            to: metaMerklesAppAddress,
            amount: MAX_ROOT_BOX_MBR + MAX_SCHEMA_BOX_MBR + MAX_TYPE_BOX_MBR,
            suggestedParams,
          }),
          name: 'meh',  
          root: Buffer.from(tree.root.slice(2), 'hex'),
          schema: 2,
          type: 1,
        },
        { sender: bobsAccount }
      );
    });

    test('AddData', async () => {
      const key = 'royalty';
      const value = '5';

      await metaMerklesClient.addData(
        {
          pmt: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: bobsAccount.addr,
            to: metaMerklesAppAddress,
            amount: 2_500 + (400 * (48 + key.length + value.length)),
            suggestedParams,
          }),
          name: 'meh',
          key: 'royalty',
          value: '5'
        },
        { sender: bobsAccount }
      );      
    });

    test('VerifiedRead', async () => {

      let p: HexString[] = [];
      for (const [i, v] of tree.entries()) {
        if (v === 0) {
          p = tree.getProof(i);
        }
      }
      
      const fee = algokit.microAlgos(ALGORAND_MIN_TX_FEE * (p.length + 2));
      
      const leaf = Buffer.from(tree.leafHash(0).slice(2), 'hex');
      const proof = p.map(n => Buffer.from(n.slice(2), 'hex'));

      const response = await metaMerklesClient.verifiedRead(
        {
          address: bobsAccount.addr,
          name: 'meh',
          leaf,
          proof,
          key: 'royalty',
          type: 1,
        },
        { sender: bobsAccount, sendParams: { fee }}
      );

      console.log(response);
    })

    test('updateRoot', async () => {
      
    })
  });
});
