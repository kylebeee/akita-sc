#!/usr/bin/env node

/**
 * Fix Pay Plugin Security Vulnerability
 *
 * The pay plugin was reinstalled with `useExecutionKey: false`, meaning anyone
 * can call the pay plugin and send funds from the DAO wallet to any address.
 *
 * This script removes the current pay plugin and re-adds it with the correct
 * settings: `useExecutionKey: true` + governance parameters, so that only
 * authorized execution keys can invoke it.
 *
 * Usage:
 *   ts-node scripts/fix-pay-plugin.ts --network testnet --mnemonic "your mnemonic"
 *   ts-node scripts/fix-pay-plugin.ts --network mainnet --mnemonic "your mnemonic"
 *   ts-node scripts/fix-pay-plugin.ts --dry-run --network testnet
 */

import { AlgorandClient, microAlgo } from '@algorandfoundation/algokit-utils'
import { getAppFundingNeeded, proposeAndExecute } from './utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { AlgorandFixture } from '@algorandfoundation/algokit-utils/types/testing'
import { getNetworkAppIds, setCurrentNetwork, type AkitaNetwork } from 'akita-sdk'
import { AkitaDaoSDK, ProposalActionEnum } from 'akita-sdk/dao'
import { PayPluginSDK } from 'akita-sdk/wallet'
import algosdk, { ALGORAND_ZERO_ADDRESS_STRING, makeBasicAccountTransactionSigner } from 'algosdk'
import {
  DEFAULT_CREATION,
  DEFAULT_ADD_PLUGIN_PROPOSAL_POWER,
  DEFAULT_ADD_PLUGIN_VOTING_DURATION,
  DEFAULT_ADD_PLUGIN_PARTICIPATION,
  DEFAULT_ADD_PLUGIN_APPROVAL,
} from '../smart_contracts/utils/defaults'

type Network = AkitaNetwork

interface FixOptions {
  network: Network
  mnemonic?: string
  dryRun?: boolean
}

// Parse command line arguments
function parseArgs(): FixOptions {
  const args = process.argv.slice(2)
  let network: Network = 'localnet'
  let mnemonic: string | undefined
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
    } else if (args[i] === '--dry-run') {
      dryRun = true
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
Usage: ts-node scripts/fix-pay-plugin.ts [options]

Options:
  --network, -n <network>     Network to deploy on (localnet, testnet, mainnet). Default: localnet
  --mnemonic, -m <mnemonic>   Mnemonic phrase for the deployer account (required for testnet/mainnet)
  --dry-run                   Show what would happen without executing
  --help, -h                  Show this help message

Examples:
  ts-node scripts/fix-pay-plugin.ts --network testnet --mnemonic "your mnemonic phrase here"
  ts-node scripts/fix-pay-plugin.ts --dry-run --network mainnet
`)
      process.exit(0)
    }
  }

  // Validate mnemonic requirement (not required for dry-run)
  if (network !== 'localnet' && !mnemonic && !dryRun) {
    console.error('Error: --mnemonic is required for testnet and mainnet (not required for --dry-run)')
    process.exit(1)
  }

  return { network, mnemonic, dryRun }
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

// Main fix function
async function fix() {
  const options = parseArgs()
  console.log(`\nStarting pay plugin fix on ${options.network}...\n`)

  try {
    // Get network app IDs
    const appIds = getNetworkAppIds(options.network)

    console.log(`Using network app IDs:`)
    console.log(`   DAO: ${appIds.dao}`)
    console.log(`   Pay Plugin: ${appIds.payPlugin}\n`)

    // Set the network so the SDK can resolve app IDs
    setCurrentNetwork(options.network)

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
      console.log(`Using account: ${account.addr.toString()}\n`)

      const result = await createFixtureForNetwork(
        options.network,
        algorand,
        account
      )
      fixture = result.fixture
      sender = result.sender
      signer = result.signer
    } else if (options.dryRun) {
      console.log('Running in dry-run mode without account - skipping execution\n')
      console.log('DRY RUN - Steps that would be performed:\n')
      console.log(`   1. Remove pay plugin (app ${appIds.payPlugin}) from wallet`)
      console.log(`      plugin: ${appIds.payPlugin}, caller: ${ALGORAND_ZERO_ADDRESS_STRING}, escrow: ""`)
      console.log('   2. Fund wallet for new plugin installation MBR')
      console.log('   3. Re-add pay plugin with useExecutionKey: true + governance parameters')
      console.log(`      global: true, useExecutionKey: true`)
      console.log(`      fee: ${DEFAULT_CREATION}, power: ${DEFAULT_ADD_PLUGIN_PROPOSAL_POWER}`)
      console.log(`      duration: ${DEFAULT_ADD_PLUGIN_VOTING_DURATION}, participation: ${DEFAULT_ADD_PLUGIN_PARTICIPATION}`)
      console.log(`      approval: ${DEFAULT_ADD_PLUGIN_APPROVAL}`)
      console.log('\nDry run complete! Run without --dry-run to execute.\n')
      process.exit(0)
    } else {
      throw new Error('Mnemonic is required for non-localnet networks')
    }

    // Check account balance
    const accountInfo = await algorand.client.algod.accountInformation(sender).do()
    const balance = BigInt(accountInfo.amount)
    console.log(`Account balance: ${balance / 1_000_000n} ALGO\n`)

    const minBalance = 10_000_000n // 10 ALGO minimum for proposals
    if (balance < minBalance) {
      console.error(`Insufficient balance. Need at least 10 ALGO for proposal operations.`)
      process.exit(1)
    }

    // Initialize DAO SDK
    console.log('Connecting to DAO...')
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

    // Initialize PayPluginSDK from existing app ID (no new deployment needed)
    const payPluginSDK = new PayPluginSDK({
      algorand,
      factoryParams: {
        appId: appIds.payPlugin,
        defaultSender: sender,
        defaultSigner: signer,
      }
    })

    // Step 1: Remove the current pay plugin
    console.log('Step 1: Removing current pay plugin (useExecutionKey: false)...')
    const removeProposalId = await proposeAndExecute(algorand, dao, [
      {
        type: ProposalActionEnum.RemovePlugin,
        plugin: appIds.payPlugin,
        caller: ALGORAND_ZERO_ADDRESS_STRING,
        escrow: '',
      }
    ])
    console.log(`   Pay plugin removed (Proposal ${removeProposalId})\n`)

    // Step 2: Fund wallet for new plugin installation
    console.log('Step 2: Funding wallet for plugin re-installation...')
    const mbr = await wallet.getMbr({
      escrow: '',
      methodCount: 0n,
      plugin: '',
      groups: 2n,
    })
    const walletFunding = await getAppFundingNeeded(algorand, wallet.client.appAddress.toString(), mbr.plugins + mbr.executions)
    if (walletFunding > 0n) {
      await wallet.client.appClient.fundAppAccount({
        amount: microAlgo(walletFunding),
      })
      console.log(`   Funded wallet with ${walletFunding} microAlgo\n`)
    } else {
      console.log(`   Wallet already has sufficient balance\n`)
    }

    // Step 3: Re-add pay plugin with correct settings
    console.log('Step 3: Re-adding pay plugin with useExecutionKey: true...')
    const addProposalId = await proposeAndExecute(algorand, dao, [
      {
        type: ProposalActionEnum.AddPlugin,
        client: payPluginSDK,
        global: true,
        escrow: '',
        sourceLink: 'https://github.com/kylebee/akita-sc',
        useExecutionKey: true,
        fee: DEFAULT_CREATION,
        power: DEFAULT_ADD_PLUGIN_PROPOSAL_POWER,
        duration: DEFAULT_ADD_PLUGIN_VOTING_DURATION,
        participation: DEFAULT_ADD_PLUGIN_PARTICIPATION,
        approval: DEFAULT_ADD_PLUGIN_APPROVAL,
      }
    ])
    console.log(`   Pay plugin re-added with useExecutionKey: true (Proposal ${addProposalId})\n`)

    // Display summary
    console.log('='.repeat(80))
    console.log('PAY PLUGIN FIX COMPLETE!')
    console.log('='.repeat(80))
    console.log(`
Summary:
  Network: ${options.network}
  Pay Plugin App ID: ${appIds.payPlugin}

Proposals Created:
  - Remove Plugin: ${removeProposalId}
  - Re-add Plugin (useExecutionKey: true): ${addProposalId}

The pay plugin now requires an authorized execution key to invoke.
Verify by attempting an unauthorized call - it should fail.
`)

    process.exit(0)
  } catch (error) {
    console.error('\nFix failed:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message)
      if (error.stack) {
        console.error('Stack trace:', error.stack)
      }
    }
    process.exit(1)
  }
}

// Run the fix
fix()
