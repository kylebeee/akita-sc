import * as algokit from '@algorandfoundation/algokit-utils';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { AkitaDaoClient, AkitaDaoFactory } from '../clients/AkitaDAOClient';
import algosdk, { makeBasicAccountTransactionSigner } from 'algosdk';

algokit.Config.configure({ populateAppCallResources: true });

const fixture = algorandFixture();

describe('DAO Tests', () => {
    /** Alice's externally owned account (ie. a keypair account she has in Defly) */
    let aliceEOA: algosdk.Account;
    /** The suggested params for transactions */
    let suggestedParams: algosdk.SuggestedParams;
    /** The client for the DAO */
    let daoClient: AkitaDaoClient;

    beforeEach(fixture.beforeEach);

    beforeAll(async () => {
        await fixture.beforeEach();
        const { algorand, algod } = fixture.context;
        const dispenser = await algorand.account.dispenserFromEnvironment();
        suggestedParams = await algorand.getSuggestedParams();
        aliceEOA = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(100_000_000) });
    
        await algorand.account.ensureFunded(
          aliceEOA.addr,
          dispenser,
          (100).algo(),
        );

        const minter = new AkitaDaoFactory({
            defaultSender: aliceEOA.addr,
            defaultSigner: makeBasicAccountTransactionSigner(aliceEOA),
            algorand
        });

        const results = await minter.send.create.createApplication();
        daoClient = results.appClient;

        console.log('DAO Address:', daoClient.appAddress);
        console.log('current version: ', await daoClient.state.global.version());

        await daoClient.send.init({
            args: {
                version: '0.0.1',
                contentPolicy: Buffer.from('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'),
                minimumRewardsImpact: 400,
                fees: {
                    socialPostFee: BigInt(100_000_000),
                    socialReactFee: BigInt(10_000_000),
                    stakingPoolCreationFee: BigInt(50_000_000),
                    subscriptionServiceCreationFee: BigInt(50_000_000),
                    subscriptionPaymentPercentage: BigInt(350),
                    subscriptionTriggerPercentage: BigInt(50),
                    omnigemSaleFee: BigInt(100_000_000),
                    nftListingCreationFee: BigInt(1_000_000),
                    nftShuffleCreationFee: BigInt(10_000_000),
                    auctionCreationFee: BigInt(10_000_000),
                    hyperSwapOfferFee: BigInt(10_000_000),
                    krbyPercentage: BigInt(30),
                    moderatorPercentage: BigInt(4),
                },
                minimumProposalThreshold: 10,
                minimumVoteThreshold: 10,
                revocationAddress: aliceEOA.addr,
            }
        });
    });

    test('txnHash check', async () => {
        expect(null).toBe(null);
    });
});