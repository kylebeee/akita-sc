#!/usr/bin/env node

/**
 * Update Social Contract Script
 * 
 * This script updates the AkitaSocial contract to a new version.
 * It follows the same patterns as update-subscriptions.ts and the DAO upgrade tests.
 * 
 * The update process uses the UpdateAkitaDAO plugin which allows the DAO wallet to:
 * 1. Upload new contract code via initBoxedContract/loadBoxedContract
 * 2. Apply the upgrade to the Social app via updateApp
 * 
 * NOTE: For updating the AkitaSocialGraph contract, use deploy-social-graph.ts instead.
 *       The graph contract on testnet/mainnet may not be directly updatable and requires
 *       deploying a new instance and updating the DAO's reference.
 * 
 * Usage:
 *   ts-node scripts/update-social.ts --network testnet --mnemonic "your mnemonic" --version "1.0.1"
 */

import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { AlgorandFixture } from '@algorandfoundation/algokit-utils/types/testing'
import { getNetworkAppIds, SDKClient, setCurrentNetwork, type AkitaNetwork } from 'akita-sdk'
import { AkitaDaoSDK, ProposalAction, ProposalActionEnum } from 'akita-sdk/dao'
import { UpdateAkitaDAOPluginSDK } from 'akita-sdk/wallet'
import algosdk, { ALGORAND_ZERO_ADDRESS_STRING, makeBasicAccountTransactionSigner } from 'algosdk'
import { AkitaSocialFactory } from '../smart_contracts/artifacts/social/AkitaSocialClient'

type Network = AkitaNetwork

interface UpdateOptions {
    network: Network
    mnemonic?: string
    version: string
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
function parseArgs(): UpdateOptions {
    const args = process.argv.slice(2)
    let network: Network = 'localnet'
    let mnemonic: string | undefined
    let version: string = '1.0.0'
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
        } else if (args[i] === '--dry-run') {
            dryRun = true
        } else if (args[i] === '--help' || args[i] === '-h') {
            console.log(`
Usage: ts-node scripts/update-social.ts [options]

Options:
  --network, -n <network>     Network to update on (localnet, testnet, mainnet). Default: localnet
  --mnemonic, -m <mnemonic>   Mnemonic phrase for the deployer account (required for testnet/mainnet)
  --version, -v <version>     New version string for the contract (e.g., "1.0.1"). Default: "1.0.0"
  --dry-run                   Compile and prepare update but don't execute (for testing)
  --help, -h                  Show this help message

NOTE: This script only updates the AkitaSocial contract. For updating the AkitaSocialGraph,
      use deploy-social-graph.ts which deploys a new instance and updates the DAO's reference.

Examples:
  ts-node scripts/update-social.ts
  ts-node scripts/update-social.ts --network testnet --mnemonic "your mnemonic phrase here" --version "1.0.1"
  ts-node scripts/update-social.ts -n mainnet -m "your mnemonic phrase here" -v "1.1.0"
  ts-node scripts/update-social.ts --dry-run --network testnet
`)
            process.exit(0)
        }
    }

    // Validate mnemonic requirement (not required for dry-run)
    if (network !== 'localnet' && !mnemonic && !dryRun) {
        console.error('Error: --mnemonic is required for testnet and mainnet updates (not required for --dry-run)')
        process.exit(1)
    }

    return { network, mnemonic, version, dryRun }
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

// Main update function
async function update() {
    const options = parseArgs()
    
    console.log(`\n🔄 Starting AkitaSocial contract update on ${options.network}...\n`)

    try {
        // Get network app IDs
        const appIds = getNetworkAppIds(options.network)
        console.log(`📋 Using network app IDs:`)
        console.log(`   DAO: ${appIds.dao}`)
        console.log(`   Social: ${appIds.social}`)
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
            // For dry-run without mnemonic, use a dummy account
            console.log('⚠️  Running in dry-run mode without account - skipping balance check\n')
            sender = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ'
            signer = makeBasicAccountTransactionSigner({ addr: sender, sk: new Uint8Array(64) } as any)
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

        // Compile the contract
        console.log('📦 Compiling new AkitaSocial contract...')
        const socialFactory = new AkitaSocialFactory({
            algorand,
            defaultSender: sender,
            defaultSigner: signer,
        })
        const compiled = await socialFactory.appFactory.compile()
        console.log(`   Approval program size: ${compiled.approvalProgram.length} bytes`)
        console.log(`   Clear program size: ${compiled.clearStateProgram.length} bytes\n`)

        // For dry-run without mnemonic, just verify compilation
        if (options.dryRun && !options.mnemonic && options.network !== 'localnet') {
            console.log('🧪 DRY RUN MODE (compile-only) - No account provided\n')
            console.log('✅ Contract compilation successful!')
            console.log(`   New version would be: ${options.version}`)
            console.log(`   Target Social app: ${appIds.social}`)
            console.log('\nTo fully test the update flow, provide a mnemonic or use localnet.\n')
            process.exit(0)
        }

        // Check wallet's installed plugins
        console.log('🔍 Checking wallet installed plugins...')
        await dao.getWallet()
        await dao.wallet.getPlugins()
        try {
            const updatePluginInfo = dao.wallet.plugins.get({ plugin: appIds.updatePlugin, caller: ALGORAND_ZERO_ADDRESS_STRING, escrow: '' })

            if (updatePluginInfo) {
                console.log(`   ✅ Update plugin (${appIds.updatePlugin}) is installed globally`)
                console.log(`      Methods: ${updatePluginInfo.methods.length}`)
            } else {
                console.warn(`   ⚠️  Could not find update plugin with expected key`)
            }
            console.log()
        } catch (e) {
            console.error('   Failed to read wallet plugins:', e)
            console.error('   This may indicate the wallet is not properly set up.\n')
        }

        // Build the update execution
        console.log('🔨 Building Social update execution...')
        const shortTimestamp = Date.now() % 1_000_000
        const execution = await dao.wallet.build.usePlugin({
            sender,
            signer,
            lease: `social_upg_${shortTimestamp}`,
            windowSize: 2000n,
            global: true,
            calls: [
                updatePlugin.updateApp({
                    sender,
                    signer,
                    appId: appIds.social,
                    version: options.version,
                    data: compiled.approvalProgram,
                }),
            ],
        })
        console.log(`   Execution lease: ${execution.lease}`)
        console.log(`   First valid: ${execution.firstValid}`)
        console.log(`   Last valid: ${execution.lastValid}`)
        console.log(`   Transaction groups: ${execution.atcs.length}\n`)

        if (options.dryRun) {
            console.log('🧪 DRY RUN MODE - Skipping proposal and execution\n')
            console.log('✅ Update prepared successfully!')
            console.log(`   New version: ${options.version}`)
            console.log(`   Target app: ${appIds.social}`)
            console.log(`   Transaction groups prepared: ${execution.atcs.length}`)
            console.log(`   Would create proposal with UpgradeApp action\n`)
            console.log('To execute the update for real, run without --dry-run flag.\n')
            process.exit(0)
        }

        // Create and execute the upgrade proposal
        console.log('📜 Creating and executing upgrade proposal...')
        const upgradeAction: ProposalAction<SDKClient> = {
            type: ProposalActionEnum.UpgradeApp,
            app: appIds.social,
            executionKey: execution.lease,
            groups: execution.ids,
            firstValid: execution.firstValid,
            lastValid: execution.lastValid,
        }

        const proposalId = await proposeAndExecute(dao, [upgradeAction])
        console.log(`   Proposal ${proposalId} created and executed\n`)

        // Submit the actual update transaction
        console.log('🚀 Submitting update transaction...')
        await execution.atcs[0].submit(algorand.client.algod)
        console.log('   Update transaction submitted\n')

        // Verify the update
        console.log('✅ Verifying update...')
        const socialClient = socialFactory.getAppClientById({
            appId: appIds.social,
        })
        const newVersion = await socialClient.state.global.version()
        console.log(`   New contract version: ${newVersion}\n`)

        // Display summary
        console.log('='.repeat(80))
        console.log('✅ AKITA SOCIAL UPDATE COMPLETE!')
        console.log('='.repeat(80))
        console.log(`
Summary:
  Network: ${options.network}
  Contract: AkitaSocial
  App ID: ${appIds.social}
  Previous Version: (check contract state)
  New Version: ${options.version}
  Proposal ID: ${proposalId}
  Update Account: ${sender}
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
