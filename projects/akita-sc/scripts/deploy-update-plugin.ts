#!/usr/bin/env node

/**
 * Deploy Update Plugin Script
 * 
 * This script deploys a new version of the UpdateAkitaDAO plugin and updates
 * the DAO configuration to use it. This is necessary when the plugin contract
 * itself needs to be updated (e.g., to fix bugs like the chunk size issue).
 * 
 * The process:
 * 1. Deploy the new UpdateAkitaDAO plugin contract
 * 2. Update the DAO's Plugin App List (PAL) with the new plugin app ID
 * 3. Remove the old plugin from the wallet
 * 4. Add the new plugin to the wallet
 * 
 * Usage:
 *   ts-node scripts/deploy-update-plugin.ts --network testnet --mnemonic "your mnemonic" --old-plugin-id 751972139
 */

import { AlgorandClient, microAlgo } from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { AlgorandFixture } from '@algorandfoundation/algokit-utils/types/testing'
import { getNetworkAppIds, SDKClient, type AkitaNetwork } from 'akita-sdk'
import { AkitaDaoSDK, ProposalAction, ProposalActionEnum } from 'akita-sdk/dao'
import { UpdateAkitaDAOPluginSDK } from 'akita-sdk/wallet'
import algosdk, { ALGORAND_ZERO_ADDRESS_STRING, makeBasicAccountTransactionSigner } from 'algosdk'
import { UpdateAkitaDaoPluginFactory } from '../smart_contracts/artifacts/arc58/plugins/update-akita-dao/UpdateAkitaDAOPluginClient'
import {
  DEFAULT_UPDATE_AKITA_DAO_APP_APPROVAL,
  DEFAULT_UPDATE_AKITA_DAO_DURATION,
  DEFAULT_UPDATE_AKITA_DAO_PARTICIPATION,
  DEFAULT_UPDATE_AKITA_DAO_PROPOSAL_CREATION,
  DEFAULT_UPDATE_AKITA_DAO_PROPOSAL_POWER,
} from '../smart_contracts/utils/defaults'

type Network = AkitaNetwork

interface DeployOptions {
  network: Network
  mnemonic?: string
  oldPluginId?: bigint
  dryRun?: boolean
}

// Helper to create and execute a proposal in one step
async function proposeAndExecute<TClient extends SDKClient>(
  dao: AkitaDaoSDK,
  actions: ProposalAction<TClient>[]
): Promise<bigint> {
  const info = await dao.proposalCost({ actions })
  await dao.client.appClient.fundAppAccount({ amount: info.total.microAlgo() })

  const { return: proposalId } = await dao.newProposal({ actions })
  if (proposalId === undefined) {
    throw new Error('Failed to create proposal')
  }

  await dao.executeProposal({ proposalId })
  return proposalId
}

// Parse command line arguments
function parseArgs(): DeployOptions {
  const args = process.argv.slice(2)
  let network: Network = 'localnet'
  let mnemonic: string | undefined
  let oldPluginId: bigint | undefined
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
    } else if (args[i] === '--old-plugin-id') {
      oldPluginId = BigInt(args[i + 1])
      i++
    } else if (args[i] === '--dry-run') {
      dryRun = true
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
Usage: ts-node scripts/deploy-update-plugin.ts [options]

Options:
  --network, -n <network>     Network to deploy on (localnet, testnet, mainnet). Default: localnet
  --mnemonic, -m <mnemonic>   Mnemonic phrase for the deployer account (required for testnet/mainnet)
  --old-plugin-id <appId>     App ID of the currently installed update plugin to remove (optional, uses network default)
  --dry-run                   Compile and prepare deployment but don't execute
  --help, -h                  Show this help message

Examples:
  ts-node scripts/deploy-update-plugin.ts
  ts-node scripts/deploy-update-plugin.ts --network testnet --mnemonic "your mnemonic phrase here"
  ts-node scripts/deploy-update-plugin.ts -n testnet -m "your mnemonic" --old-plugin-id 751972139
  ts-node scripts/deploy-update-plugin.ts --dry-run --network testnet
`)
      process.exit(0)
    }
  }

  // Validate mnemonic requirement (not required for dry-run)
  if (network !== 'localnet' && !mnemonic && !dryRun) {
    console.error('Error: --mnemonic is required for testnet and mainnet deployments (not required for --dry-run)')
    process.exit(1)
  }

  return { network, mnemonic, oldPluginId, dryRun }
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
        testAccount: account as any,
      },
      newScope: async () => { },
      beforeEach: async () => { },
    } as unknown as AlgorandFixture

    return { fixture, sender, signer }
  }
}

// Deploy the UpdateAkitaDAO plugin
async function deployUpdatePlugin(
  algorand: AlgorandClient,
  sender: string,
  signer: algosdk.TransactionSigner,
  daoAppId: bigint
): Promise<UpdateAkitaDAOPluginSDK> {
  const factory = algorand.client.getTypedAppFactory(
    UpdateAkitaDaoPluginFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  // Minimal clear program - version 11
  const clearProgram = new Uint8Array([0x0b])

  const { appClient: client } = await factory.send.create.create({
    args: {
      akitaDao: daoAppId,
      clearProgram,
    }
  })

  return new UpdateAkitaDAOPluginSDK({
    algorand,
    factoryParams: {
      appId: client.appId,
      defaultSender: sender,
      defaultSigner: signer,
    }
  })
}

// Main deployment function
async function deploy() {
  const options = parseArgs()
  console.log(`\n🚀 Starting UpdateAkitaDAO plugin deployment on ${options.network}...\n`)

  try {
    // Get network app IDs
    const appIds = getNetworkAppIds(options.network)
    const oldPluginId = options.oldPluginId ?? appIds.updatePlugin

    console.log(`📋 Using network app IDs:`)
    console.log(`   DAO: ${appIds.dao}`)
    console.log(`   Old Update Plugin: ${oldPluginId}\n`)

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
      signer = (account as any).signer
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
      console.log('⚠️  Running in dry-run mode without account - skipping deployment\n')
      console.log('✅ Dry run complete!')
      console.log('   To deploy, provide a mnemonic or use localnet.\n')
      process.exit(0)
    } else {
      throw new Error('Mnemonic is required for non-localnet networks')
    }

    // Check account balance
    const accountInfo = await algorand.client.algod.accountInformation(sender).do()
    const balance = BigInt(accountInfo.amount)
    console.log(`💰 Account balance: ${balance / 1_000_000n} ALGO\n`)

    const minBalance = 50_000_000n // 50 ALGO minimum for deployment and proposals
    if (balance < minBalance) {
      console.error(`❌ Insufficient balance. Need at least 50 ALGO for deployment operations.`)
      process.exit(1)
    }

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

    // Get the wallet
    const wallet = await dao.getWallet()
    console.log(`   Wallet App ID: ${wallet.appId}\n`)

    if (options.dryRun) {
      console.log('🧪 DRY RUN MODE - Showing what would happen:\n')
      console.log('   1. Deploy new UpdateAkitaDAO plugin contract')
      console.log('   2. Create proposal to update DAO PAL with new plugin app ID')
      console.log('   3. Create proposal to remove old plugin from wallet')
      console.log(`      Old plugin: ${oldPluginId}, caller: ${ALGORAND_ZERO_ADDRESS_STRING}, escrow: ""`)
      console.log('   4. Create proposal to add new plugin to wallet (global, useExecutionKey: true)')
      console.log('\n✅ Dry run complete! Run without --dry-run to execute.\n')
      process.exit(0)
    }

    // Step 1: Deploy new update plugin
    console.log('📦 Step 1: Deploying new UpdateAkitaDAO plugin...')
    const newUpdatePlugin = await deployUpdatePlugin(algorand, sender, signer, appIds.dao)
    console.log(`   ✅ New plugin deployed: ${newUpdatePlugin.appId}\n`)

    // Step 2: Update DAO's Plugin App List (PAL)
    console.log('📜 Step 2: Updating DAO Plugin App List...')
    const updatePalProposalId = await proposeAndExecute(dao, [
      {
        type: ProposalActionEnum.UpdateFields,
        field: 'pal',
        value: { update: newUpdatePlugin.appId }
      }
    ])
    console.log(`   ✅ PAL updated (Proposal ${updatePalProposalId})\n`)

    // Step 3: Remove old plugin from wallet
    console.log('🗑️  Step 3: Removing old plugin from wallet...')
    const removePluginProposalId = await proposeAndExecute(dao, [
      {
        type: ProposalActionEnum.RemovePlugin,
        plugin: oldPluginId,
        caller: ALGORAND_ZERO_ADDRESS_STRING,
        escrow: '',
      }
    ])
    console.log(`   ✅ Old plugin removed (Proposal ${removePluginProposalId})\n`)

    // Step 4: Fund wallet for new plugin installation
    console.log('💳 Step 4: Funding wallet for plugin installation...')
    const mbr = await wallet.getMbr({
      escrow: '',
      methodCount: 0n,
      plugin: '',
      groups: 2n,
    })
    await wallet.client.appClient.fundAppAccount({
      amount: microAlgo(mbr.plugins + mbr.executions + 1_000_000n),
    })
    console.log(`   ✅ Wallet funded\n`)

    // Step 5: Add new plugin to wallet
    console.log('➕ Step 5: Installing new plugin on wallet...')
    const installPluginProposalId = await proposeAndExecute(dao, [
      {
        type: ProposalActionEnum.AddPlugin,
        fee: DEFAULT_UPDATE_AKITA_DAO_PROPOSAL_CREATION,
        power: DEFAULT_UPDATE_AKITA_DAO_PROPOSAL_POWER,
        duration: DEFAULT_UPDATE_AKITA_DAO_DURATION,
        participation: DEFAULT_UPDATE_AKITA_DAO_PARTICIPATION,
        approval: DEFAULT_UPDATE_AKITA_DAO_APP_APPROVAL,
        sourceLink: 'https://github.com/kylebee/akita-sc',
        client: newUpdatePlugin,
        global: true,
        useExecutionKey: true,
      }
    ])
    console.log(`   ✅ New plugin installed (Proposal ${installPluginProposalId})\n`)

    // Display summary
    console.log('='.repeat(80))
    console.log('✅ UPDATE PLUGIN DEPLOYMENT COMPLETE!')
    console.log('='.repeat(80))
    console.log(`
Summary:
  Network: ${options.network}
  Old Plugin App ID: ${oldPluginId}
  New Plugin App ID: ${newUpdatePlugin.appId}
  
Proposals Created:
  - Update PAL: ${updatePalProposalId}
  - Remove Old Plugin: ${removePluginProposalId}
  - Install New Plugin: ${installPluginProposalId}

⚠️  IMPORTANT: Update the SDK networks.ts file with the new plugin app ID:
  updatePlugin: ${newUpdatePlugin.appId}n,
`)

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Deployment failed:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message)
      if (error.stack) {
        console.error('Stack trace:', error.stack)
      }
    }
    process.exit(1)
  }
}

// Run the deployment
deploy()

