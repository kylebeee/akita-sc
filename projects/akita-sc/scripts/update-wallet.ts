#!/usr/bin/env node

/**
 * ARC58 Wallet Migration Script
 *
 * This script performs the one-time wallet migration that transitions the wallet
 * update mechanism from the old plugin-based flow to the new factory-based flow.
 *
 * Migration Steps:
 *   1. Upload NEW wallet bytecode to factory via updateFactoryChildContract
 *   2. Update DAO contract: remove create, add rekeyDAO()
 *   3. Update factory contract: add updateWalletForAdmin + updateWallet
 *   4. DAO rekeys itself to the factory
 *   5. Factory updates wallet (as DAO), rekeys DAO back
 *   6. Remove all plugins from wallet (PluginInfo schema change)
 *   7. Reinstall all plugins on wallet
 *   8. Update DAO contract: remove rekeyDAO, add updateWallet() proxy
 *   9. Update factory contract: remove updateWalletForAdmin
 *
 * Usage:
 *   npx ts-node scripts/update-wallet.ts --network testnet --mnemonic "..." --step 2
 */

import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { microAlgo } from '@algorandfoundation/algokit-utils'
import { getAppFundingNeeded, proposeAndExecute } from './utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { getNetworkAppIds, SDKClient, setCurrentNetwork, type AkitaNetwork } from 'akita-sdk'
import { AkitaDaoSDK, ProposalAction, ProposalActionEnum } from 'akita-sdk/dao'
import { AsaMintPluginSDK, OptInPluginSDK, PayPluginSDK, RevenueManagerPluginSDK, UpdateAkitaDAOPluginSDK, WalletFactorySDK } from 'akita-sdk/wallet'
import algosdk, { ALGORAND_ZERO_ADDRESS_STRING, makeBasicAccountTransactionSigner } from 'algosdk'
import {
  DEFAULT_CREATION,
  DEFAULT_UPGRADE_APP_PROPOSAL_POWER,
  DEFAULT_UPGRADE_APP_VOTING_DURATION,
  DEFAULT_UPGRADE_APP_PARTICIPATION,
  DEFAULT_UPGRADE_APP_APPROVAL,
  DEFAULT_UPDATE_AKITA_DAO_PROPOSAL_CREATION,
  DEFAULT_UPDATE_AKITA_DAO_PROPOSAL_POWER,
  DEFAULT_UPDATE_AKITA_DAO_DURATION,
  DEFAULT_UPDATE_AKITA_DAO_PARTICIPATION,
  DEFAULT_UPDATE_AKITA_DAO_APP_APPROVAL,
} from '../smart_contracts/utils/defaults'
import { AbstractedAccountFactory } from '../smart_contracts/artifacts/arc58/account/AbstractedAccountClient'
import { AbstractedAccountFactoryFactory } from '../smart_contracts/artifacts/arc58/account/AbstractedAccountFactoryClient'
import { AkitaDaoFactory } from '../smart_contracts/artifacts/arc58/dao/AkitaDAOClient'

type Network = AkitaNetwork

interface MigrationOptions {
  network: Network
  mnemonic?: string
  version: string
  step?: number
  dryRun?: boolean
}

// Helper to build and execute a plugin-based upgrade via proposal
async function upgradeAppViaPlugin({
  algorand,
  dao,
  updatePlugin,
  sender,
  signer,
  targetAppId,
  version,
  data,
  leasePrefix,
}: {
  algorand: AlgorandClient
  dao: AkitaDaoSDK
  updatePlugin: UpdateAkitaDAOPluginSDK
  sender: string
  signer: algosdk.TransactionSigner
  targetAppId: bigint
  version: string
  data: Uint8Array
  leasePrefix: string
}): Promise<bigint> {
  const shortTimestamp = Date.now() % 1_000_000
  const execution = await dao.wallet.build.usePlugin({
    sender,
    signer,
    lease: `${leasePrefix}_${shortTimestamp}`,
    windowSize: 2000n,
    global: true,
    calls: [
      updatePlugin.updateApp({
        sender,
        signer,
        appId: targetAppId,
        version,
        data,
      }),
    ],
  })

  console.log(`   Transaction groups: ${execution.atcs.length}`)

  const upgradeAction: ProposalAction<SDKClient> = {
    type: ProposalActionEnum.UpgradeApp,
    app: targetAppId,
    executionKey: execution.lease,
    groups: execution.ids,
    firstValid: execution.firstValid,
    lastValid: execution.lastValid,
  }

  const proposalId = await proposeAndExecute(algorand, dao, [upgradeAction])
  await execution.atcs[0].submit(dao.wallet.client.algorand.client.algod)
  return proposalId
}

// Helper to upload bytecode to factory via plugin
async function uploadToFactory({
  algorand,
  dao,
  updatePlugin,
  sender,
  signer,
  factoryAppId,
  version,
  data
}: {
  algorand: AlgorandClient
  dao: AkitaDaoSDK
  updatePlugin: UpdateAkitaDAOPluginSDK
  sender: string
  signer: algosdk.TransactionSigner
  factoryAppId: bigint
  version: string
  data: Uint8Array
}): Promise<bigint> {
  // Pre-fund the wallet for execution
  const preFundMbr = await dao.wallet.getMbr({
    escrow: '',
    methodCount: 0n,
    plugin: '',
    groups: 4n,
  })

  const walletAddress = dao.wallet.client.appAddress.toString()
  const preFunding = await getAppFundingNeeded(algorand, walletAddress, preFundMbr.plugins + preFundMbr.executions)
  if (preFunding > 0n) {
    await dao.wallet.client.appClient.fundAppAccount({
      amount: microAlgo(preFunding),
    })
  }

  const shortTimestamp = Date.now() % 1_000_000

  const execution = await dao.wallet.build.usePlugin({
    sender,
    signer,
    lease: `wf_child_${shortTimestamp}`,
    windowSize: 2000n,
    global: true,
    calls: [
      updatePlugin.updateFactoryChildContract({
        sender,
        signer,
        factoryAppId,
        version,
        data,
      }),
    ],
  })

  const uploadMbr = await dao.wallet.getMbr({
    escrow: '',
    methodCount: 0n,
    plugin: '',
    groups: BigInt(execution.atcs.length),
  })

  const uploadFunding = await getAppFundingNeeded(algorand, walletAddress, uploadMbr.plugins + uploadMbr.executions)
  if (uploadFunding > 0n) {
    await dao.wallet.client.appClient.fundAppAccount({
      amount: microAlgo(uploadFunding),
    })
  }

  console.log(`   Transaction groups: ${execution.atcs.length}`)

  const uploadAction: ProposalAction<SDKClient> = {
    type: ProposalActionEnum.UpgradeApp,
    app: factoryAppId,
    executionKey: execution.lease,
    groups: execution.ids,
    firstValid: execution.firstValid,
    lastValid: execution.lastValid,
  }

  const proposalId = await proposeAndExecute(algorand, dao, [uploadAction])
  await execution.atcs[0].submit(dao.wallet.client.algorand.client.algod)
  return proposalId
}

// Parse command line arguments
function parseArgs(): MigrationOptions {
  const args = process.argv.slice(2)
  let network: Network = 'localnet'
  let mnemonic: string | undefined
  let version: string = '1.0.0'
  let step: number | undefined
  let dryRun = false

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--network' || args[i] === '-n') {
      const networkValue = args[i + 1]
      if (networkValue && ['localnet', 'testnet', 'mainnet'].includes(networkValue)) {
        network = networkValue as Network
        i++
      } else {
        console.error(`Invalid network: ${networkValue}. Must be one of: localnet, testnet, mainnet`)
        process.exit(1)
      }
    } else if (args[i] === '--mnemonic' || args[i] === '-m') {
      mnemonic = args[i + 1]
      i++
    } else if (args[i] === '--version' || args[i] === '-v') {
      version = args[i + 1]
      i++
    } else if (args[i] === '--step' || args[i] === '-s') {
      step = parseInt(args[i + 1])
      if (isNaN(step) || step < 1 || step > 9) {
        console.error('Invalid step. Must be 1-9.')
        process.exit(1)
      }
      i++
    } else if (args[i] === '--dry-run') {
      dryRun = true
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
Usage: npx ts-node scripts/update-wallet.ts [options]

Options:
  --network, -n <network>   Network (localnet, testnet, mainnet). Default: localnet
  --mnemonic, -m <mnemonic> Mnemonic for the deployer account (required for testnet/mainnet)
  --version, -v <version>   New wallet contract version string. Default: "1.0.0"
  --step, -s <step>         Run a specific migration step (2-9). Omit to run all steps.
  --dry-run                 Show what would be done without executing
  --help, -h                Show this help message

Migration Steps:
  1  Upload new wallet bytecode to factory (updateFactoryChildContract)
  2  Update DAO: remove create, add rekeyDAO
  3  Update factory: add updateWalletForAdmin + updateWallet
  4  Rekey DAO to factory
  5  Factory updates wallet as DAO, rekeys DAO back
  6  Remove all wallet plugins (PluginInfo schema change)
  7  Reinstall all wallet plugins
  8  Update DAO: remove rekeyDAO, add updateWallet proxy
  9  Update factory: remove updateWalletForAdmin

Examples:
  # Run all steps on testnet
  npx ts-node scripts/update-wallet.ts -n testnet -m "mnemonic" -v "1.0.1"

  # Run step 5 only
  npx ts-node scripts/update-wallet.ts -n testnet -m "mnemonic" -s 5
`)
      process.exit(0)
    }
  }

  if (network !== 'localnet' && !mnemonic && !dryRun) {
    console.error('Error: --mnemonic is required for testnet and mainnet (not required for --dry-run)')
    process.exit(1)
  }

  return { network, mnemonic, version, step, dryRun }
}

function createAlgorandClient(network: Network): AlgorandClient {
  switch (network) {
    case 'testnet':
      return AlgorandClient.testNet()
    case 'mainnet':
      return AlgorandClient.mainNet()
    case 'localnet':
    default:
      return AlgorandClient.fromEnvironment()
  }
}

function createAccountFromMnemonic(mnemonic: string): algosdk.Account {
  try {
    return algosdk.mnemonicToSecretKey(mnemonic)
  } catch (error) {
    console.error('Error: Invalid mnemonic phrase')
    throw error
  }
}

// Main migration function
async function migrate() {

  console.error('This script was a one-time use migration script for the wallet factory. It is no longer needed and will be removed in a future version.')
  process.exit(1)
  
  const options = parseArgs()
  const stepLabel = options.step ? `step ${options.step}` : 'all steps'
  console.log(`\n=== ARC58 Wallet Migration (${options.network}, ${stepLabel}) ===\n`)

  try {
    const appIds = getNetworkAppIds(options.network)
    console.log(`DAO: ${appIds.dao}`)
    console.log(`Wallet Factory: ${appIds.walletFactory}`)
    console.log(`Update Plugin: ${appIds.updatePlugin}\n`)

    const algorand = createAlgorandClient(options.network)

    let sender: string
    let signer: algosdk.TransactionSigner

    if (options.network === 'localnet') {
      const fixture = algorandFixture()
      await fixture.newScope()
      const { testAccount } = fixture.context
      sender = testAccount.addr.toString()
      signer = (testAccount as unknown as { signer: algosdk.TransactionSigner }).signer
    } else if (options.mnemonic) {
      const account = createAccountFromMnemonic(options.mnemonic)
      sender = account.addr.toString()
      signer = makeBasicAccountTransactionSigner(account)
      console.log(`Account: ${sender}`)
    } else if (options.dryRun) {
      console.log('DRY RUN MODE\n')
      sender = ALGORAND_ZERO_ADDRESS_STRING
      signer = makeBasicAccountTransactionSigner({ addr: sender, sk: new Uint8Array(64) } as unknown as algosdk.Account)
    } else {
      throw new Error('Mnemonic is required for non-localnet networks')
    }

    // Check balance
    if (options.mnemonic || options.network === 'localnet') {
      const accountInfo = await algorand.client.algod.accountInformation(sender).do()
      const balance = BigInt(accountInfo.amount)
      console.log(`Balance: ${balance / 1_000_000n} ALGO\n`)

      if (balance < 10_000_000n) {
        console.error('Insufficient balance. Need at least 10 ALGO.')
        process.exit(1)
      }
    }

    setCurrentNetwork(options.network)

    // Initialize SDKs
    const dao = new AkitaDaoSDK({
      algorand,
      factoryParams: {
        appId: appIds.dao,
        defaultSender: sender,
        defaultSigner: signer,
      }
    })

    const updatePlugin = new UpdateAkitaDAOPluginSDK({
      algorand,
      factoryParams: {
        appId: appIds.updatePlugin,
        defaultSender: sender,
        defaultSigner: signer,
      }
    })

    const walletFactorySDK = new WalletFactorySDK({
      algorand,
      factoryParams: {
        appId: appIds.walletFactory,
        defaultSender: sender,
        defaultSigner: signer,
      }
    })

    // Load wallet
    await dao.getWallet()
    await dao.wallet.getPlugins()

    const shouldRun = (s: number) => !options.step || options.step === s

    // -------------------------------------------------------------------------
    // STEP 1: Upload new wallet bytecode to factory
    // -------------------------------------------------------------------------
    if (shouldRun(1)) {
      console.log('--- Step 1: Upload new wallet bytecode to factory ---')

      if (options.dryRun) {
        console.log('   [DRY RUN] Would upload compiled wallet bytecode to factory via updateFactoryChildContract\n')
      } else {
        const walletArtifactFactory = new AbstractedAccountFactory({
          algorand,
          defaultSender: sender,
          defaultSigner: signer,
        })
        const compiledWallet = await walletArtifactFactory.appFactory.compile()
        console.log(`   Wallet approval program: ${compiledWallet.approvalProgram.length} bytes`)

        const proposalId = await uploadToFactory({
          algorand,
          dao,
          updatePlugin,
          sender,
          signer,
          factoryAppId: appIds.walletFactory,
          version: options.version,
          data: compiledWallet.approvalProgram,
        })
        console.log(`   Proposal ${proposalId} executed. Wallet bytecode uploaded to factory.\n`)
      }
    }

    // -------------------------------------------------------------------------
    // STEP 2: Update DAO — remove create, add rekeyDAO
    // -------------------------------------------------------------------------
    if (shouldRun(2)) {
      console.log('--- Step 3: Update DAO (add rekeyDAO) ---')
      console.log('   IMPORTANT: Build the migration version of the DAO first!')
      console.log('   The DAO contract must have rekeyDAO() and no create().\n')

      if (options.dryRun) {
        console.log('   [DRY RUN] Would update DAO contract via updateApp plugin\n')
      } else {
        const daoArtifactFactory = new AkitaDaoFactory({
          algorand,
          defaultSender: sender,
          defaultSigner: signer,
        })
        const compiledDao = await daoArtifactFactory.appFactory.compile()
        console.log(`   DAO approval program: ${compiledDao.approvalProgram.length} bytes`)

        // Pre-fund wallet for plugin execution
        const preFundMbr = await dao.wallet.getMbr({
          escrow: '',
          methodCount: 0n,
          plugin: '',
          groups: 4n,
        })
        const walletFunding = await getAppFundingNeeded(algorand, dao.wallet.client.appAddress.toString(), preFundMbr.plugins + preFundMbr.executions)
        if (walletFunding > 0n) {
          await dao.wallet.client.appClient.fundAppAccount({
            amount: microAlgo(walletFunding),
          })
        }

        const proposalId = await upgradeAppViaPlugin({
          algorand,
          dao,
          updatePlugin,
          sender,
          signer,
          targetAppId: appIds.dao,
          version: options.version,
          data: compiledDao.approvalProgram,
          leasePrefix: 'dao_mig',
        })
        console.log(`   Proposal ${proposalId} executed. DAO updated with rekeyDAO.\n`)
      }
    }

    // -------------------------------------------------------------------------
    // STEP 3: Update factory — add updateWalletForAdmin + updateWallet
    // -------------------------------------------------------------------------
    if (shouldRun(3)) {
      console.log('--- Step 3: Update factory (add updateWalletForAdmin + updateWallet) ---')

      if (options.dryRun) {
        console.log('   [DRY RUN] Would update factory contract via updateApp plugin\n')
      } else {
        const factoryArtifactFactory = new AbstractedAccountFactoryFactory({
          algorand,
          defaultSender: sender,
          defaultSigner: signer,
        })
        const compiledFactory = await factoryArtifactFactory.appFactory.compile()
        console.log(`   Factory approval program: ${compiledFactory.approvalProgram.length} bytes`)

        // Pre-fund wallet for plugin execution
        const preFundMbr = await dao.wallet.getMbr({
          escrow: '',
          methodCount: 0n,
          plugin: '',
          groups: 4n,
        })
        const walletFunding = await getAppFundingNeeded(algorand, dao.wallet.client.appAddress.toString(), preFundMbr.plugins + preFundMbr.executions)
        if (walletFunding > 0n) {
          await dao.wallet.client.appClient.fundAppAccount({
            amount: microAlgo(walletFunding),
          })
        }

        const proposalId = await upgradeAppViaPlugin({
          algorand,
          dao,
          updatePlugin,
          sender,
          signer,
          targetAppId: appIds.walletFactory,
          version: options.version,
          data: compiledFactory.approvalProgram,
          leasePrefix: 'fac_mig',
        })
        console.log(`   Proposal ${proposalId} executed. Factory updated.\n`)
      }
    }

    // -------------------------------------------------------------------------
    // STEP 4: Rekey DAO to factory
    // -------------------------------------------------------------------------
    if (shouldRun(4)) {
      console.log('--- Step 4: Rekey DAO to factory ---')

      if (options.dryRun) {
        console.log(`   [DRY RUN] Would call dao.rekeyDAO(${walletFactorySDK.client.appAddress})\n`)
      } else {
        console.log(`   Rekeying DAO to factory: ${walletFactorySDK.client.appAddress}`)
        await dao.client.send.rekeyDao({
          args: { target: walletFactorySDK.client.appAddress.toString() },
          extraFee: microAlgo(1_000n),
        })
        console.log('   DAO rekeyed to factory.\n')
      }
    }

    // -------------------------------------------------------------------------
    // STEP 5: Factory updates wallet, rekeys DAO back
    // -------------------------------------------------------------------------
    if (shouldRun(5)) {
      console.log('--- Step 5: Factory updates wallet as DAO (rekeys DAO back) ---')

      if (options.dryRun) {
        console.log('   [DRY RUN] Would call factory.updateWalletForAdmin(wallet, dao)\n')
      } else {
        // Fund factory for inner transaction fees
        const factoryFunding = await getAppFundingNeeded(algorand, walletFactorySDK.client.appAddress.toString(), 1_000_000n)
        if (factoryFunding > 0n) {
          await algorand.send.payment({
            sender,
            receiver: walletFactorySDK.client.appAddress,
            amount: microAlgo(factoryFunding),
            signer,
          })
        }

        console.log(`   Updating wallet ${dao.wallet.client.appId} as DAO ${dao.client.appClient.appAddress}`)
        await walletFactorySDK.client.send.updateWalletForAdmin({
          args: {
            wallet: dao.wallet.client.appId,
            admin: dao.client.appClient.appAddress.toString(),
          },
          extraFee: microAlgo(1_000n),
        })
        console.log('   Wallet updated. DAO rekeyed back to itself.\n')

        // Verify
        const walletVersion = await dao.wallet.client.state.global.version()
        console.log(`   Wallet version after update: ${walletVersion}`)
      }
    }

    // -------------------------------------------------------------------------
    // STEP 6: Remove all plugins (PluginInfo schema change)
    // -------------------------------------------------------------------------
    if (shouldRun(6)) {
      console.log('--- Step 6: Remove all wallet plugins ---')

      // Initialize plugin SDKs
      const revenueManagerPlugin = new RevenueManagerPluginSDK({
        algorand,
        factoryParams: {
          appId: appIds.revenueManagerPlugin,
          defaultSender: sender,
          defaultSigner: signer,
        }
      })

      const optInPlugin = new OptInPluginSDK({
        algorand,
        factoryParams: {
          appId: appIds.optinPlugin,
          defaultSender: sender,
          defaultSigner: signer,
        }
      })

      const asaMintPlugin = new AsaMintPluginSDK({
        algorand,
        factoryParams: {
          appId: appIds.asaMintPlugin,
          defaultSender: sender,
          defaultSigner: signer,
        }
      })

      const payPlugin = new PayPluginSDK({
        algorand,
        factoryParams: {
          appId: appIds.payPlugin,
          defaultSender: sender,
          defaultSigner: signer,
        }
      })

      // Define all plugins to remove
      // Each entry: { plugin appId, caller (ZERO for global, sender for caller-specific), escrow }
      const pluginsToRemove: { plugin: bigint; caller: string; escrow: string }[] = [
        // Global plugins on root (escrow='')
        { plugin: appIds.revenueManagerPlugin, caller: ALGORAND_ZERO_ADDRESS_STRING, escrow: '' },
        { plugin: appIds.updatePlugin, caller: ALGORAND_ZERO_ADDRESS_STRING, escrow: '' },
        { plugin: appIds.asaMintPlugin, caller: sender, escrow: '' },
        { plugin: appIds.payPlugin, caller: ALGORAND_ZERO_ADDRESS_STRING, escrow: '' },
        // OptIn plugin on recipient escrows
        { plugin: appIds.optinPlugin, caller: ALGORAND_ZERO_ADDRESS_STRING, escrow: 'rec_krby' },
        { plugin: appIds.optinPlugin, caller: ALGORAND_ZERO_ADDRESS_STRING, escrow: 'rec_mod' },
        { plugin: appIds.optinPlugin, caller: ALGORAND_ZERO_ADDRESS_STRING, escrow: 'rec_gov' },
        // Revenue manager on revenue escrows
        { plugin: appIds.revenueManagerPlugin, caller: ALGORAND_ZERO_ADDRESS_STRING, escrow: 'rev_wallet' },
        { plugin: appIds.revenueManagerPlugin, caller: ALGORAND_ZERO_ADDRESS_STRING, escrow: 'rev_auction' },
        { plugin: appIds.revenueManagerPlugin, caller: ALGORAND_ZERO_ADDRESS_STRING, escrow: 'rev_marketplace' },
        { plugin: appIds.revenueManagerPlugin, caller: ALGORAND_ZERO_ADDRESS_STRING, escrow: 'rev_raffle' },
        { plugin: appIds.revenueManagerPlugin, caller: ALGORAND_ZERO_ADDRESS_STRING, escrow: 'rev_social' },
        { plugin: appIds.revenueManagerPlugin, caller: ALGORAND_ZERO_ADDRESS_STRING, escrow: 'rev_subscriptions' },
        { plugin: appIds.revenueManagerPlugin, caller: ALGORAND_ZERO_ADDRESS_STRING, escrow: 'rev_pool' },
        { plugin: appIds.revenueManagerPlugin, caller: ALGORAND_ZERO_ADDRESS_STRING, escrow: 'rev_poll' },
      ]

      if (options.dryRun) {
        console.log(`   [DRY RUN] Would remove ${pluginsToRemove.length} plugins:`)
        for (const p of pluginsToRemove) {
          console.log(`     - plugin=${p.plugin}, caller=${p.caller === ALGORAND_ZERO_ADDRESS_STRING ? 'GLOBAL' : p.caller}, escrow="${p.escrow}"`)
        }
        console.log()
      } else {
        console.log(`   Removing ${pluginsToRemove.length} plugins...`)
        for (let i = 0; i < pluginsToRemove.length; i++) {
          const p = pluginsToRemove[i]
          const callerLabel = p.caller === ALGORAND_ZERO_ADDRESS_STRING ? 'GLOBAL' : 'sender'
          console.log(`   [${i + 1}/${pluginsToRemove.length}] Removing plugin=${p.plugin} caller=${callerLabel} escrow="${p.escrow}"`)

          await proposeAndExecute(algorand, dao, [{
            type: ProposalActionEnum.RemovePlugin,
            plugin: p.plugin,
            caller: p.caller,
            escrow: p.escrow,
          }])
        }
        console.log('   All plugins removed.\n')
      }
    }

    // -------------------------------------------------------------------------
    // STEP 7: Reinstall all plugins
    // -------------------------------------------------------------------------
    if (shouldRun(7)) {
      console.log('--- Step 7: Reinstall all wallet plugins ---')

      // Initialize plugin SDKs (duplicated from step 6 — steps run independently)
      const revenueManagerPlugin = new RevenueManagerPluginSDK({
        algorand,
        factoryParams: {
          appId: appIds.revenueManagerPlugin,
          defaultSender: sender,
          defaultSigner: signer,
        }
      })

      const optInPlugin = new OptInPluginSDK({
        algorand,
        factoryParams: {
          appId: appIds.optinPlugin,
          defaultSender: sender,
          defaultSigner: signer,
        }
      })

      const asaMintPlugin = new AsaMintPluginSDK({
        algorand,
        factoryParams: {
          appId: appIds.asaMintPlugin,
          defaultSender: sender,
          defaultSigner: signer,
        }
      })

      const payPlugin = new PayPluginSDK({
        algorand,
        factoryParams: {
          appId: appIds.payPlugin,
          defaultSender: sender,
          defaultSigner: signer,
        }
      })

      // Revenue manager escrow method config (reused for all rev_ escrows)
      const revMethods = [
        { name: revenueManagerPlugin.optIn(), cooldown: 0n },
        { name: revenueManagerPlugin.startEscrowDisbursement(), cooldown: 0n },
        { name: revenueManagerPlugin.processEscrowAllocation(), cooldown: 0n },
      ]

      // Define all plugins to reinstall (with full config)
      const pluginsToInstall: ProposalAction<SDKClient>[] = [
        // RevenueManagerPlugin (global, escrow='', useExecutionKey=true, UPGRADE_APP governance)
        {
          type: ProposalActionEnum.AddPlugin,
          client: revenueManagerPlugin,
          global: true,
          escrow: '',
          sourceLink: 'https://github.com/kylebee/akita-sc',
          useExecutionKey: true,
          fee: DEFAULT_CREATION,
          power: DEFAULT_UPGRADE_APP_PROPOSAL_POWER,
          duration: DEFAULT_UPGRADE_APP_VOTING_DURATION,
          participation: DEFAULT_UPGRADE_APP_PARTICIPATION,
          approval: DEFAULT_UPGRADE_APP_APPROVAL,
        },
        // UpdateAkitaDAOPlugin (global, escrow='', useExecutionKey=true, UPDATE_AKITA_DAO governance)
        {
          type: ProposalActionEnum.AddPlugin,
          client: updatePlugin,
          global: true,
          escrow: '',
          sourceLink: 'https://github.com/kylebee/akita-sc',
          useExecutionKey: true,
          fee: DEFAULT_UPDATE_AKITA_DAO_PROPOSAL_CREATION,
          power: DEFAULT_UPDATE_AKITA_DAO_PROPOSAL_POWER,
          duration: DEFAULT_UPDATE_AKITA_DAO_DURATION,
          participation: DEFAULT_UPDATE_AKITA_DAO_PARTICIPATION,
          approval: DEFAULT_UPDATE_AKITA_DAO_APP_APPROVAL,
        },
        // AsaMintPlugin (caller=sender, escrow='', no execution key)
        {
          type: ProposalActionEnum.AddPlugin,
          client: asaMintPlugin,
          caller: sender,
          escrow: '',
          sourceLink: 'https://github.com/kylebee/akita-sc',
          useExecutionKey: false,
        },
        // PayPlugin (global, escrow='', no execution key)
        {
          type: ProposalActionEnum.AddPlugin,
          client: payPlugin,
          global: true,
          escrow: '',
          sourceLink: 'https://github.com/kylebee/akita-sc',
          useExecutionKey: false,
        },
        // OptInPlugin on rec_krby (global, no execution key)
        {
          type: ProposalActionEnum.AddPlugin,
          client: optInPlugin,
          global: true,
          escrow: 'rec_krby',
          sourceLink: '',
          useExecutionKey: false,
        },
        // OptInPlugin on rec_mod (global, no execution key)
        {
          type: ProposalActionEnum.AddPlugin,
          client: optInPlugin,
          global: true,
          escrow: 'rec_mod',
          sourceLink: '',
          useExecutionKey: false,
        },
        // OptInPlugin on rec_gov (global, no execution key)
        {
          type: ProposalActionEnum.AddPlugin,
          client: optInPlugin,
          global: true,
          escrow: 'rec_gov',
          sourceLink: '',
          useExecutionKey: false,
        },
        // RevenueManagerPlugin on rev_wallet (global, no execution key, 3 methods)
        {
          type: ProposalActionEnum.AddPlugin,
          client: revenueManagerPlugin,
          global: true,
          escrow: 'rev_wallet',
          sourceLink: 'https://github.com/kylebee/akita-sc',
          useExecutionKey: false,
          methods: revMethods,
        },
        // RevenueManagerPlugin on rev_auction
        {
          type: ProposalActionEnum.AddPlugin,
          client: revenueManagerPlugin,
          global: true,
          escrow: 'rev_auction',
          sourceLink: 'https://github.com/kylebee/akita-sc',
          useExecutionKey: false,
          methods: revMethods,
        },
        // RevenueManagerPlugin on rev_marketplace
        {
          type: ProposalActionEnum.AddPlugin,
          client: revenueManagerPlugin,
          global: true,
          escrow: 'rev_marketplace',
          sourceLink: 'https://github.com/kylebee/akita-sc',
          useExecutionKey: false,
          methods: revMethods,
        },
        // RevenueManagerPlugin on rev_raffle
        {
          type: ProposalActionEnum.AddPlugin,
          client: revenueManagerPlugin,
          global: true,
          escrow: 'rev_raffle',
          sourceLink: 'https://github.com/kylebee/akita-sc',
          useExecutionKey: false,
          methods: revMethods,
        },
        // RevenueManagerPlugin on rev_social
        {
          type: ProposalActionEnum.AddPlugin,
          client: revenueManagerPlugin,
          global: true,
          escrow: 'rev_social',
          sourceLink: 'https://github.com/kylebee/akita-sc',
          useExecutionKey: false,
          methods: revMethods,
        },
        // RevenueManagerPlugin on rev_subscriptions
        {
          type: ProposalActionEnum.AddPlugin,
          client: revenueManagerPlugin,
          global: true,
          escrow: 'rev_subscriptions',
          sourceLink: 'https://github.com/kylebee/akita-sc',
          useExecutionKey: false,
          methods: revMethods,
        },
        // RevenueManagerPlugin on rev_pool
        {
          type: ProposalActionEnum.AddPlugin,
          client: revenueManagerPlugin,
          global: true,
          escrow: 'rev_pool',
          sourceLink: 'https://github.com/kylebee/akita-sc',
          useExecutionKey: false,
          methods: revMethods,
        },
        // RevenueManagerPlugin on rev_poll
        {
          type: ProposalActionEnum.AddPlugin,
          client: revenueManagerPlugin,
          global: true,
          escrow: 'rev_poll',
          sourceLink: 'https://github.com/kylebee/akita-sc',
          useExecutionKey: false,
          methods: revMethods,
        },
      ]

      if (options.dryRun) {
        console.log(`   [DRY RUN] Would reinstall ${pluginsToInstall.length} plugins:`)
        for (const p of pluginsToInstall) {
          if (p.type === ProposalActionEnum.AddPlugin) {
            const label = 'global' in p && p.global ? 'GLOBAL' : ('caller' in p ? p.caller : '?')
            console.log(`     - plugin=${p.client.appId}, caller=${label}, escrow="${p.escrow}"`)
          }
        }
        console.log()
      } else {
        // Fund wallet for reinstallation boxes
        console.log('   Funding wallet for plugin reinstallation...')
        const installMbr = await dao.wallet.getMbr({
          escrow: '',
          methodCount: 3n,
          plugin: '',
          groups: BigInt(pluginsToInstall.length),
        })
        const installFunding = await getAppFundingNeeded(algorand, dao.wallet.client.appAddress.toString(), installMbr.plugins + installMbr.namedPlugins + installMbr.executions)
        if (installFunding > 0n) {
          await dao.wallet.client.appClient.fundAppAccount({
            amount: microAlgo(installFunding),
          })
        }

        console.log(`   Reinstalling ${pluginsToInstall.length} plugins...`)
        for (let i = 0; i < pluginsToInstall.length; i++) {
          const action = pluginsToInstall[i]
          if (action.type === ProposalActionEnum.AddPlugin) {
            const label = 'global' in action && action.global ? 'GLOBAL' : ('caller' in action ? 'sender' : '?')
            console.log(`   [${i + 1}/${pluginsToInstall.length}] Installing plugin=${action.client.appId} caller=${label} escrow="${action.escrow}"`)
          }

          await proposeAndExecute(algorand, dao, [action])
        }
        console.log('   All plugins reinstalled.\n')

        // Verify
        await dao.wallet.getPlugins()
        console.log(`   Verified: ${dao.wallet.plugins.size} plugins installed on wallet.\n`)
      }
    }

    // -------------------------------------------------------------------------
    // STEP 8: Update DAO — remove rekeyDAO, add updateWallet proxy
    // -------------------------------------------------------------------------
    if (shouldRun(8)) {
      console.log('--- Step 8: Update DAO (final: remove rekeyDAO, add updateWallet proxy) ---')
      if (options.dryRun) {
        console.log('   [DRY RUN] Would update DAO contract via updateApp plugin\n')
      } else {
        const daoArtifactFactory = new AkitaDaoFactory({
          algorand,
          defaultSender: sender,
          defaultSigner: signer,
        })
        const compiledDao = await daoArtifactFactory.appFactory.compile()
        console.log(`   DAO approval program: ${compiledDao.approvalProgram.length} bytes`)

        // Pre-fund wallet for plugin execution
        const preFundMbr = await dao.wallet.getMbr({
          escrow: '',
          methodCount: 0n,
          plugin: '',
          groups: 4n,
        })
        const walletFunding = await getAppFundingNeeded(algorand, dao.wallet.client.appAddress.toString(), preFundMbr.plugins + preFundMbr.executions)
        if (walletFunding > 0n) {
          await dao.wallet.client.appClient.fundAppAccount({
            amount: microAlgo(walletFunding),
          })
        }

        const proposalId = await upgradeAppViaPlugin({
          algorand,
          dao,
          updatePlugin,
          sender,
          signer,
          targetAppId: appIds.dao,
          version: options.version,
          data: compiledDao.approvalProgram,
          leasePrefix: 'dao_fin',
        })
        console.log(`   Proposal ${proposalId} executed. DAO updated (production).\n`)
      }
    }

    // -------------------------------------------------------------------------
    // STEP 9: Update factory — remove updateWalletForAdmin
    // -------------------------------------------------------------------------
    if (shouldRun(9)) {
      console.log('--- Step 9: Update factory (final: remove updateWalletForAdmin) ---')

      if (options.dryRun) {
        console.log('   [DRY RUN] Would update factory contract via updateApp plugin\n')
      } else {
        const factoryArtifactFactory = new AbstractedAccountFactoryFactory({
          algorand,
          defaultSender: sender,
          defaultSigner: signer,
        })
        const compiledFactory = await factoryArtifactFactory.appFactory.compile()
        console.log(`   Factory approval program: ${compiledFactory.approvalProgram.length} bytes`)

        // Pre-fund wallet for plugin execution
        const preFundMbr = await dao.wallet.getMbr({
          escrow: '',
          methodCount: 0n,
          plugin: '',
          groups: 4n,
        })
        const walletFunding = await getAppFundingNeeded(algorand, dao.wallet.client.appAddress.toString(), preFundMbr.plugins + preFundMbr.executions)
        if (walletFunding > 0n) {
          await dao.wallet.client.appClient.fundAppAccount({
            amount: microAlgo(walletFunding),
          })
        }

        const proposalId = await upgradeAppViaPlugin({
          algorand,
          dao,
          updatePlugin,
          sender,
          signer,
          targetAppId: appIds.walletFactory,
          version: options.version,
          data: compiledFactory.approvalProgram,
          leasePrefix: 'fac_fin',
        })
        console.log(`   Proposal ${proposalId} executed. Factory updated (production).\n`)
      }
    }

    // Summary
    console.log('='.repeat(60))
    console.log('Migration complete!')
    console.log('='.repeat(60))
    console.log(`
  Network:        ${options.network}
  Wallet Version: ${options.version}
  Steps Run:      ${options.step ? `step ${options.step} only` : '2-9 (all)'}
`)

    process.exit(0)
  } catch (error) {
    console.error('\nMigration failed:', error)
    if (error instanceof Error) {
      console.error('Details:', error.message)
      if (error.stack) {
        console.error('Stack:', error.stack)
      }
    }
    process.exit(1)
  }
}

migrate()
