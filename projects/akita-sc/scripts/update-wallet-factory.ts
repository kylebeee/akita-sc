#!/usr/bin/env node

/**
 * Update ARC58 Wallet Factory Script
 * 
 * This script updates the ARC58 Wallet Factory to deploy new versions of the AbstractedAccount contract.
 * It can:
 * 1. Update the child contract (AbstractedAccount) bytecode stored in the factory's box
 * 2. Optionally update the factory app itself
 * 
 * The update process uses the UpdateAkitaDAO plugin's updateFactoryChildContract method which:
 * 1. Uploads new child contract code to the plugin's box storage
 * 2. Transfers it to the factory's box via inner transactions to factory.initBoxedContract/loadBoxedContract
 * 
 * Usage:
 *   ts-node scripts/update-wallet-factory.ts --network testnet --mnemonic "your mnemonic" --version "1.0.1"
 *   ts-node scripts/update-wallet-factory.ts --network testnet --mnemonic "your mnemonic" --version "1.0.1" --update-factory
 */

import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { proposeAndExecute } from './utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { AlgorandFixture } from '@algorandfoundation/algokit-utils/types/testing'
import { getNetworkAppIds, SDKClient, setCurrentNetwork, type AkitaNetwork } from 'akita-sdk'
import { AkitaDaoSDK, ProposalAction, ProposalActionEnum } from 'akita-sdk/dao'
import { UpdateAkitaDAOPluginSDK } from 'akita-sdk/wallet'
import algosdk, { ALGORAND_ZERO_ADDRESS_STRING, makeBasicAccountTransactionSigner } from 'algosdk'
import { AbstractedAccountFactory } from '../smart_contracts/artifacts/arc58/account/AbstractedAccountClient'
import { AbstractedAccountFactoryClient, AbstractedAccountFactoryFactory } from '../smart_contracts/artifacts/arc58/account/AbstractedAccountFactoryClient'

type Network = AkitaNetwork

interface UpdateOptions {
  network: Network
  mnemonic?: string
  version: string
  dryRun?: boolean
  updateFactory?: boolean
}

// Parse command line arguments
function parseArgs(): UpdateOptions {
  const args = process.argv.slice(2)
  let network: Network = 'localnet'
  let mnemonic: string | undefined
  let version: string = '1.0.0'
  let dryRun = false
  let updateFactory = false

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
    } else if (args[i] === '--dry-run') {
      dryRun = true
    } else if (args[i] === '--update-factory') {
      updateFactory = true
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
Usage: ts-node scripts/update-wallet-factory.ts [options]

Options:
  --network, -n <network>     Network to update on (localnet, testnet, mainnet). Default: localnet
  --mnemonic, -m <mnemonic>   Mnemonic phrase for the deployer account (required for testnet/mainnet)
  --version, -v <version>     New version string for the child contract (e.g., "1.0.1"). Default: "1.0.0"
  --dry-run                   Compile and prepare update but don't execute (for testing)
  --update-factory            Also update the factory app itself (not just the child contract)
  --help, -h                  Show this help message

Examples:
  # Update child contract (AbstractedAccount) only on localnet
  ts-node scripts/update-wallet-factory.ts
  
  # Update child contract on testnet
  ts-node scripts/update-wallet-factory.ts --network testnet --mnemonic "your mnemonic phrase here" --version "1.0.1"
  
  # Update both child contract and factory app
  ts-node scripts/update-wallet-factory.ts -n mainnet -m "your mnemonic phrase here" -v "1.1.0" --update-factory
  
  # Dry run to test compilation
  ts-node scripts/update-wallet-factory.ts --dry-run --network testnet
`)
      process.exit(0)
    }
  }

  // Validate mnemonic requirement (not required for dry-run)
  if (network !== 'localnet' && !mnemonic && !dryRun) {
    console.error('Error: --mnemonic is required for testnet and mainnet updates (not required for --dry-run)')
    process.exit(1)
  }

  return { network, mnemonic, version, dryRun, updateFactory }
}

// Create AlgorandClient for a specific network
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

// Create account from mnemonic
function createAccountFromMnemonic(mnemonic: string): algosdk.Account {
  try {
    return algosdk.mnemonicToSecretKey(mnemonic)
  } catch (error) {
    console.error('Error: Invalid mnemonic phrase')
    throw error
  }
}

// Create a fixture-like structure for non-localnet networks
async function createFixtureForNetwork(
  network: Network,
  algorand: AlgorandClient,
  account: algosdk.Account
): Promise<{ fixture: AlgorandFixture; sender: string; signer: algosdk.TransactionSigner }> {
  if (network === 'localnet') {
    const fixture = algorandFixture()
    await fixture.newScope()
    const { testAccount } = fixture.context
    return {
      fixture,
      sender: testAccount.addr.toString(),
      signer: testAccount.signer,
    }
  } else {
    const sender: string = account.addr.toString()
    const signer = makeBasicAccountTransactionSigner(account)

    const fixture = {
      algorand,
      context: {
        algorand,
        generateAccount: async () => {
          throw new Error('generateAccount not supported for non-localnet networks')
        },
        testAccount: account,
      },
      newScope: async () => { },
      beforeEach: async () => { },
    } as unknown as AlgorandFixture

    return { fixture, sender, signer }
  }
}

// Main update function
async function update() {
  const options = parseArgs()
  console.log(`\n🔄 Starting ARC58 Wallet Factory update on ${options.network}...\n`)

  try {
    // Get network app IDs
    const appIds = getNetworkAppIds(options.network)
    console.log(`📋 Using network app IDs:`)
    console.log(`   DAO: ${appIds.dao}`)
    console.log(`   Wallet Factory: ${appIds.walletFactory}`)
    console.log(`   Update Plugin: ${appIds.updatePlugin}\n`)

    // Create Algorand client
    const algorand = createAlgorandClient(options.network)

    // Create account and fixture
    let account: algosdk.Account
    let fixture: AlgorandFixture
    let sender: string
    let signer: algosdk.TransactionSigner

    if (options.network === 'localnet') {
      fixture = algorandFixture()
      await fixture.newScope()
      account = fixture.context.testAccount as algosdk.Account
      sender = account.addr.toString()
      signer = (account as unknown as { signer: algosdk.TransactionSigner }).signer
    } else if (options.mnemonic) {
      account = createAccountFromMnemonic(options.mnemonic)
      console.log(`📝 Using account: ${account.addr.toString()}\n`)

      const result = await createFixtureForNetwork(
        options.network,
        algorand,
        account
      )
      fixture = result.fixture
      sender = result.sender
      signer = result.signer
    } else if (options.dryRun) {
      // For dry-run without mnemonic, use a dummy account
      console.log('⚠️  Running in dry-run mode without account - skipping balance check\n')
      sender = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ'
      signer = makeBasicAccountTransactionSigner({ addr: sender, sk: new Uint8Array(64) } as unknown as algosdk.Account)
      fixture = {} as AlgorandFixture
    } else {
      throw new Error('Mnemonic is required for non-localnet networks')
    }

    // Check account balance (skip for dry-run without account)
    if (options.mnemonic || options.network === 'localnet') {
      const accountInfo = await algorand.client.algod.accountInformation(sender).do()
      const balance = BigInt(accountInfo.amount)
      console.log(`💰 Account balance: ${balance / 1_000_000n} ALGO\n`)

      const minBalance = 5_000_000n // 5 ALGO minimum for update operations
      if (balance < minBalance) {
        console.error(`❌ Insufficient balance. Need at least 5 ALGO for update operations.`)
        process.exit(1)
      }
    }

    // Set the network context for the SDK
    setCurrentNetwork(options.network)

    // Initialize DAO SDK
    console.log('🔗 Connecting to DAO...')
    const dao = new AkitaDaoSDK({
      algorand,
      factoryParams: {
        appId: appIds.dao,
        defaultSender: sender,
        defaultSigner: signer,
      }
    })
    console.log(`   DAO App ID: ${dao.appId}`)

    // Initialize UpdateAkitaDAO Plugin SDK
    const updatePlugin = new UpdateAkitaDAOPluginSDK({
      algorand,
      factoryParams: {
        appId: appIds.updatePlugin,
        defaultSender: sender,
        defaultSigner: signer,
      }
    })
    console.log(`   Update Plugin App ID: ${updatePlugin.appId}\n`)

    // Compile the new AbstractedAccount (child) contract
    console.log('📦 Compiling new AbstractedAccount contract (child contract)...')
    const abstractedAccountFactory = algorand.client.getTypedAppFactory(
      AbstractedAccountFactory,
      {
        defaultSender: sender,
        defaultSigner: signer,
      }
    )
    const compiledChildContract = await abstractedAccountFactory.appFactory.compile()
    console.log(`   Approval program size: ${compiledChildContract.approvalProgram.length} bytes`)
    console.log(`   Clear program size: ${compiledChildContract.clearStateProgram.length} bytes\n`)

    // Optionally compile the factory contract itself
    let compiledFactoryContract: { approvalProgram: Uint8Array; clearStateProgram: Uint8Array } | undefined
    if (options.updateFactory) {
      console.log('📦 Compiling new AbstractedAccountFactory contract...')
      const walletFactoryFactory = algorand.client.getTypedAppFactory(
        AbstractedAccountFactoryFactory,
        {
          defaultSender: sender,
          defaultSigner: signer,
        }
      )
      compiledFactoryContract = await walletFactoryFactory.appFactory.compile()
      console.log(`   Approval program size: ${compiledFactoryContract.approvalProgram.length} bytes`)
      console.log(`   Clear program size: ${compiledFactoryContract.clearStateProgram.length} bytes\n`)
    }

    // For dry-run without mnemonic, just verify compilation
    if (options.dryRun && !options.mnemonic && options.network !== 'localnet') {
      console.log('🧪 DRY RUN MODE (compile-only) - No account provided\n')
      console.log('✅ Contract compilation successful!')
      console.log(`   New child contract version would be: ${options.version}`)
      console.log(`   Target factory app: ${appIds.walletFactory}`)
      if (options.updateFactory) {
        console.log(`   Factory app would also be updated`)
      }
      console.log('\nTo fully test the update flow, provide a mnemonic or use localnet.\n')
      process.exit(0)
    }

    // Check wallet's installed plugins
    console.log('\n🔍 Checking wallet installed plugins...')
    await dao.getWallet()
    await dao.wallet.getPlugins()
    try {
      const updatePluginInfo = dao.wallet.plugins.get({ plugin: appIds.updatePlugin, caller: ALGORAND_ZERO_ADDRESS_STRING, escrow: '' })

      if (updatePluginInfo) {
        console.log(`   ✅ Update plugin (${appIds.updatePlugin}) is installed globally`)
        console.log(`      Methods: ${updatePluginInfo.methods.length}`)
      } else {
        console.warn(`   ⚠️  Could not find update plugin with expected key`)
        console.log(`   Listing all plugin keys for debugging:`)
      }
      console.log()
    } catch (e) {
      console.error('   Failed to read wallet plugins:', e)
      console.error('   This may indicate the wallet is not properly set up.\n')
    }

    // Build the child contract update execution using updateFactoryChildContract
    console.log('🔨 Building child contract update execution...')
    const shortTimestamp = Date.now() % 1_000_000
    const childUpdateExecution = await dao.wallet.build.usePlugin({
      sender,
      signer,
      lease: `factory_child_upg_${shortTimestamp}`,
      windowSize: 2000n,
      global: true,
      calls: [
        updatePlugin.updateFactoryChildContract({
          sender,
          signer,
          factoryAppId: appIds.walletFactory,
          version: options.version,
          data: compiledChildContract.approvalProgram,
        }),
      ],
    })
    console.log(`   Child update lease: ${childUpdateExecution.lease}`)
    console.log(`   First valid: ${childUpdateExecution.firstValid}`)
    console.log(`   Last valid: ${childUpdateExecution.lastValid}`)
    console.log(`   Transaction groups: ${childUpdateExecution.atcs.length}\n`)

    // Optionally build factory app update execution
    let factoryUpdateExecution: typeof childUpdateExecution | undefined
    if (options.updateFactory && compiledFactoryContract) {
      console.log('🔨 Building factory app update execution...')
      factoryUpdateExecution = await dao.wallet.build.usePlugin({
        sender,
        signer,
        lease: `factory_app_upg_${shortTimestamp}`,
        windowSize: 2000n,
        global: true,
        calls: [
          updatePlugin.updateApp({
            sender,
            signer,
            appId: appIds.walletFactory,
            version: options.version,
            data: compiledFactoryContract.approvalProgram,
          }),
        ],
      })
      console.log(`   Factory update lease: ${factoryUpdateExecution.lease}`)
      console.log(`   First valid: ${factoryUpdateExecution.firstValid}`)
      console.log(`   Last valid: ${factoryUpdateExecution.lastValid}`)
      console.log(`   Transaction groups: ${factoryUpdateExecution.atcs.length}\n`)
    }

    if (options.dryRun) {
      console.log('🧪 DRY RUN MODE - Skipping proposal and execution\n')
      console.log('✅ Update prepared successfully!')
      console.log(`   New child contract version: ${options.version}`)
      console.log(`   Target factory app: ${appIds.walletFactory}`)
      console.log(`   Child update transaction groups prepared: ${childUpdateExecution.atcs.length}`)
      if (factoryUpdateExecution) {
        console.log(`   Factory update transaction groups prepared: ${factoryUpdateExecution.atcs.length}`)
      }
      console.log(`   Would create proposal with UpgradeApp action\n`)
      console.log('To execute the update for real, run without --dry-run flag.\n')
      process.exit(0)
    }

    // Create and execute the upgrade proposal for child contract
    console.log('📜 Creating and executing child contract upgrade proposal...')
    const childUpgradeAction: ProposalAction<SDKClient> = {
      type: ProposalActionEnum.UpgradeApp,
      app: appIds.walletFactory,
      executionKey: childUpdateExecution.lease,
      groups: childUpdateExecution.ids,
      firstValid: childUpdateExecution.firstValid,
      lastValid: childUpdateExecution.lastValid,
    }

    const childProposalId = await proposeAndExecute(algorand, dao, [childUpgradeAction])
    console.log(`   Proposal ${childProposalId} created and executed\n`)

    // Submit the actual child contract update transaction
    console.log('🚀 Submitting child contract update transaction...')
    await childUpdateExecution.atcs[0].submit(algorand.client.algod)
    console.log('   Child contract update transaction submitted\n')

    // Optionally update factory app
    if (factoryUpdateExecution) {
      console.log('📜 Creating and executing factory app upgrade proposal...')
      const factoryUpgradeAction: ProposalAction<SDKClient> = {
        type: ProposalActionEnum.UpgradeApp,
        app: appIds.walletFactory,
        executionKey: factoryUpdateExecution.lease,
        groups: factoryUpdateExecution.ids,
        firstValid: factoryUpdateExecution.firstValid,
        lastValid: factoryUpdateExecution.lastValid,
      }

      const factoryProposalId = await proposeAndExecute(algorand, dao, [factoryUpgradeAction])
      console.log(`   Proposal ${factoryProposalId} created and executed\n`)

      console.log('🚀 Submitting factory app update transaction...')
      await factoryUpdateExecution.atcs[0].submit(algorand.client.algod)
      console.log('   Factory app update transaction submitted\n')
    }

    // Verify the update
    console.log('✅ Verifying update...')
    const factoryClient = algorand.client.getTypedAppClientById(
      AbstractedAccountFactoryClient,
      {
        appId: appIds.walletFactory,
        defaultSender: sender,
        defaultSigner: signer,
      }
    )
    const newChildVersion = await factoryClient.state.global.childContractVersion()
    console.log(`   New child contract version: ${newChildVersion}\n`)

    // Display summary
    console.log('='.repeat(80))
    console.log('✅ ARC58 WALLET FACTORY UPDATE COMPLETE!')
    console.log('='.repeat(80))
    console.log(`
Summary:
  Network: ${options.network}
  Factory App ID: ${appIds.walletFactory}
  New Child Contract Version: ${options.version}
  Child Update Proposal ID: ${childProposalId}
  Update Account: ${sender}
  ${options.updateFactory ? `Factory App Also Updated: Yes` : ''}
`)

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Update failed:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message)
      if (error.stack) {
        console.error('Stack trace:', error.stack)
      }
    }
    process.exit(1)
  }
}

// Run the update
update()
