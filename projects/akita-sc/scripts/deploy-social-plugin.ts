#!/usr/bin/env node

/**
 * Deploy Social Plugin Script
 * 
 * This script deploys a new version of the AkitaSocialPlugin contract.
 * 
 * The AkitaSocialPlugin is an ARC-58 plugin that enables social interactions
 * (posts, replies, votes, reactions, follows, etc.) through the Akita wallet system.
 * 
 * Usage:
 *   ts-node scripts/deploy-social-plugin.ts --network testnet --mnemonic "your mnemonic"
 */

import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { AlgorandFixture } from '@algorandfoundation/algokit-utils/types/testing'
import { getNetworkAppIds, setCurrentNetwork, type AkitaNetwork } from 'akita-sdk'
import { SocialPluginSDK } from 'akita-sdk/wallet'
import algosdk, { makeBasicAccountTransactionSigner } from 'algosdk'
import { AkitaSocialPluginFactory } from '../smart_contracts/artifacts/arc58/plugins/social/AkitaSocialPluginClient'

type Network = AkitaNetwork

interface DeployOptions {
    network: Network
    mnemonic?: string
    version: string
    escrow: bigint
    dryRun?: boolean
}

// Parse command line arguments
function parseArgs(): DeployOptions {
    const args = process.argv.slice(2)
    let network: Network = 'localnet'
    let mnemonic: string | undefined
    let version = '0.0.1'
    let escrow = 0n
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
        } else if (args[i] === '--escrow' || args[i] === '-e') {
            escrow = BigInt(args[i + 1])
            i++
        } else if (args[i] === '--dry-run') {
            dryRun = true
        } else if (args[i] === '--help' || args[i] === '-h') {
            console.log(`
Usage: ts-node scripts/deploy-social-plugin.ts [options]

Options:
  --network, -n <network>     Network to deploy on (localnet, testnet, mainnet). Default: localnet
  --mnemonic, -m <mnemonic>   Mnemonic phrase for the deployer account (required for testnet/mainnet)
  --version, -v <version>     Version string for the plugin (default: "0.0.1")
  --escrow, -e <escrow>       Escrow app ID (default: 0)
  --dry-run                   Show what would be deployed but don't execute
  --help, -h                  Show this help message

Examples:
  ts-node scripts/deploy-social-plugin.ts
  ts-node scripts/deploy-social-plugin.ts --network testnet --mnemonic "your mnemonic phrase here"
  ts-node scripts/deploy-social-plugin.ts -n testnet -m "your mnemonic" --version "0.0.2"
  ts-node scripts/deploy-social-plugin.ts --dry-run --network testnet
`)
            process.exit(0)
        }
    }

    // Validate mnemonic requirement (not required for dry-run)
    if (network !== 'localnet' && !mnemonic && !dryRun) {
        console.error('Error: --mnemonic is required for testnet and mainnet deployments (not required for --dry-run)')
        process.exit(1)
    }

    return { network, mnemonic, version, escrow, dryRun }
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

// Deploy the AkitaSocialPlugin
async function deploySocialPlugin(
    algorand: AlgorandClient,
    sender: string,
    signer: algosdk.TransactionSigner,
    daoAppId: bigint,
    version: string,
    escrow: bigint
): Promise<SocialPluginSDK> {
    const factory = algorand.client.getTypedAppFactory(
        AkitaSocialPluginFactory,
        {
            defaultSender: sender,
            defaultSigner: signer,
        }
    )

    const { appClient: client } = await factory.send.create.create({
        args: {
            version,
            akitaDao: daoAppId,
            escrow,
        }
    })

    return new SocialPluginSDK({
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
    console.log(`\n🚀 Starting AkitaSocialPlugin deployment on ${options.network}...\n`)

    try {
        // Set the network context for the SDK
        setCurrentNetwork(options.network)

        // Get network app IDs
        const appIds = getNetworkAppIds(options.network)

        console.log(`📋 Using network app IDs:`)
        console.log(`   DAO: ${appIds.dao}`)
        console.log(`   Version: ${options.version}`)
        console.log(`   Escrow: ${options.escrow}\n`)

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

        const minBalance = 10_000_000n // 10 ALGO minimum for deployment
        if (balance < minBalance) {
            console.error(`❌ Insufficient balance. Need at least 10 ALGO for deployment.`)
            process.exit(1)
        }

        if (options.dryRun) {
            console.log('🧪 DRY RUN MODE - Showing what would happen:\n')
            console.log(`   1. Deploy new AkitaSocialPlugin contract (version: ${options.version})`)
            console.log('\n✅ Dry run complete! Run without --dry-run to execute.\n')
            process.exit(0)
        }

        // Deploy new social plugin
        console.log('📦 Deploying new AkitaSocialPlugin...')
        const newSocialPlugin = await deploySocialPlugin(
            algorand,
            sender,
            signer,
            appIds.dao,
            options.version,
            options.escrow
        )
        console.log(`   ✅ New plugin deployed: ${newSocialPlugin.appId}\n`)

        // Display summary
        console.log('='.repeat(80))
        console.log('✅ SOCIAL PLUGIN DEPLOYMENT COMPLETE!')
        console.log('='.repeat(80))
        console.log(`
Summary:
  Network: ${options.network}
  New Plugin App ID: ${newSocialPlugin.appId}
  Version: ${options.version}
  Escrow: ${options.escrow}

⚠️  IMPORTANT: Update the SDK networks.ts file with the new plugin app ID:
  socialPlugin: ${newSocialPlugin.appId}n,
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

