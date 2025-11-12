import { algo, Config, microAlgo } from '@algorandfoundation/algokit-utils'
import { registerDebugEventHandlers } from '@algorandfoundation/algokit-utils-debug'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { describe, test, beforeAll, beforeEach, expect } from '@jest/globals';
import { AkitaDaoSDK, AsaMintPluginSDK, OptInPluginSDK, PayPluginSDK, WalletFactorySDK, WalletSDK } from 'akita-sdk'
import { TimeWarp } from '../../../tests/utils/time'
import { deployStaking } from '../../../tests/fixtures/staking'
import { deployRewards } from '../../../tests/fixtures/rewards'
import { deployStakingPoolFactory } from '../../../tests/fixtures/pool'
import { deployPayPlugin } from '../../../tests/fixtures/plugins/pay'
import { deployOptInPlugin } from '../../../tests/fixtures/plugins/optin'
import { deployAsaMintPlugin } from '../../../tests/fixtures/plugins/asa-mint'
import { deployAkitaDAO } from '../../../tests/fixtures/dao'
import { StakingClient } from '../../artifacts/staking/StakingClient';
import { deployEscrowFactory } from '../../../tests/fixtures/escrow';
import { RewardsClient } from '../../artifacts/rewards/RewardsClient';
import { PoolFactoryClient } from '../../artifacts/pool/PoolFactoryClient';
import { ProposalActionEnum } from 'akita-sdk';
import { deployAbstractedAccountFactory } from '../../../tests/fixtures/abstracted-account';

describe('ARC58 Plugin Permissions', () => {
  const localnet = algorandFixture();
  /** the wallet sdk */
  let dao: AkitaDaoSDK;
  /** the dao wallet sdk */
  let daoWallet: WalletSDK;

  let walletFactory: WalletFactorySDK;
  let staking: StakingClient;
  let rewards: RewardsClient;
  let pool: PoolFactoryClient;

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

    const dispenser = await algorand.account.dispenserFromEnvironment();
    await algorand.account.ensureFunded(sender, dispenser, (100).algos());

    timeWarp = new TimeWarp(algorand);

    const escrowFactory = await deployEscrowFactory({
      fixture: localnet,
      sender,
      signer
    });

    payPluginSdk = await deployPayPlugin({ fixture: localnet, sender, signer });
    optinPluginSdk = await deployOptInPlugin({ fixture: localnet, sender, signer });
    asaMintPluginSdk = await deployAsaMintPlugin({ fixture: localnet, sender, signer });

    dao = await deployAkitaDAO({
      fixture: localnet,
      sender,
      signer,
      apps: {
        optin: optinPluginSdk.appId,
        escrow: escrowFactory.appId,
      }
    })

    walletFactory = await deployAbstractedAccountFactory({
      fixture: localnet,
      sender,
      signer,
      args: {
        akitaDao: dao.appId,
        version: '0.0.1',
        escrowFactory: escrowFactory.appId,
      }
    })

    staking = await deployStaking({
      fixture: localnet,
      sender,
      signer,
      args: {
        akitaDao: dao.appId,
      }
    });

    rewards = await deployRewards({
      fixture: localnet,
      sender,
      signer,
      args: {
        akitaDao: dao.appId,
      }
    });

    pool = await deployStakingPoolFactory({
      fixture: localnet,
      sender,
      signer,
      args: {
        akitaDao: dao.appId,
      }
    });
  })

  beforeEach(async () => {
    await localnet.newScope()
    const { algorand, context: { testAccount } } = localnet
    const sender = testAccount.toString()

    const dispenser = await algorand.account.dispenserFromEnvironment();
    await algorand.account.ensureFunded(sender, dispenser, (100).algos());
  })

  describe('Dao Setup', () => {
    test('should update akita app list', async () => {
      const results = await dao.newProposal({
        actions: [
          {
            type: ProposalActionEnum.UpdateFields,
            field: 'akita_al',
            value: {
              wallet: walletFactory.appId,
              staking: staking.appId,
              rewards: rewards.appId,
              pool: pool.appId,
            }
          }
          // {
          //   type: ProposalActionEnum.AddPlugin,
          //   client: payPluginSdk,
          //   global: true,
          //   fee: 0n,
          //   power: 0n,
          //   duration: 0n,
          //   participation: 0n,
          //   approval: 0n,
          //   sourceLink: 'https://akita.community',
          // }
        ]
      })

      console.log('results', results)

      const proposalId = results.return;

      console.log(`Proposal ID: ${proposalId}`)

      if (proposalId === undefined) {
        throw new Error('Failed to create proposal');
      }

      console.log('proposal:', (await dao.client.send.getProposal({ args: { proposalId } })).return?.actions)

      await dao.executeProposal({ proposalId })
    })

    test('should create an arc58 wallet', async () => {

      const { return: fundAmount } = await walletFactory.client.send.cost()

      if (fundAmount === undefined) {
        throw new Error('Failed to get cost for wallet creation');
      }

      console.log('funding amount:', fundAmount)

      await dao.client.appClient.fundAppAccount({
        amount: microAlgo(fundAmount)
      })

      console.log('funded amount:', fundAmount)

      const { returns } = await dao.setup()

      console.log('setup returns', returns)

      const [walletID] = returns as unknown as bigint[]

      expect(walletID).toBeDefined();
      expect(walletID).toBeGreaterThan(0n);
    })

    test('should initialize', async () => {
      await dao.initialize()
    })
  })

  describe('Proposals', () => {
    test('should be able to create an upgrade app proposal', async () => {

    })

    test('should be able to create an add plugin proposal', async () => {})
    test('should be able to create an add named plugin proposal', async () => {})
    test('should be able to create an execute plugin proposal', async () => {})
    test('should be able to create an execute named plugin proposal', async () => {})
    test('should be able to create a remove execute proposal', async () => {})
    test('should be able to create a remove plugin proposal', async () => {})
    test('should be able to create a remove named plugin proposal', async () => {})
    test('should be able to create an add allowance proposal', async () => {})
    test('should be able to create a remove allowance proposal', async () => {})
    test('should be able to create a new escrow proposal', async () => {})
    test('should be able to create a toggle escrow lock proposal', async () => {})
    test('should be able to create a update field proposal', async () => {})
  })
})
