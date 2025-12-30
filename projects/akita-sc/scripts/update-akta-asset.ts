#!/usr/bin/env npx ts-node --transpile-only

/**
 * Update AKTA Asset Script
 * 
 * This script updates the DAO's akita_assets field with the AKTA token asset ID.
 * This is needed for testnet and mainnet deployments where AKTA already exists
 * as a separate token that wasn't created during the universe deployment.
 * 
 * The process:
 * 1. Connect to the DAO on the specified network
 * 2. (Optional) Mint a test AKTA token on localnet/testnet with --mint
 * 3. Create a proposal to update akita_assets with the AKTA asset ID
 * 4. Execute the proposal
 * 
 * Usage:
 *   ts-node scripts/update-akta-asset.ts --network mainnet --mnemonic "your mnemonic"
 *   ts-node scripts/update-akta-asset.ts --network testnet --mnemonic "your mnemonic" --mint
 *   ts-node scripts/update-akta-asset.ts --network testnet --mnemonic "your mnemonic" --akta-asset-id 12345
 */

import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { AlgorandFixture } from '@algorandfoundation/algokit-utils/types/testing'
import { getNetworkAppIds, SDKClient, type AkitaNetwork, setCurrentNetwork } from 'akita-sdk'
import { AkitaDaoSDK, ProposalAction, ProposalActionEnum } from 'akita-sdk/dao'
import algosdk, { makeBasicAccountTransactionSigner } from 'algosdk'

type Network = AkitaNetwork

// Known AKTA asset IDs per network
const AKTA_ASSET_IDS: Record<Network, bigint> = {
  localnet: 0n, // Created during deployment, use --akta-asset-id or --mint
  testnet: 0n,  // No official testnet AKTA, use --akta-asset-id or --mint
  mainnet: 523683256n, // Official mainnet AKTA asset ID
}

// Test AKTA configuration (matching mainnet decimals = 0)
const TEST_AKTA_CONFIG = {
  name: 'Akita (Test)',
  unitName: 'AKTA',
  decimals: 0,
  total: 1_000_000_000n, // 1 billion (AKTA has 0 decimals on mainnet)
}

interface UpdateOptions {
  network: Network
  mnemonic?: string
  aktaAssetId?: bigint
  mint?: boolean
  dryRun?: boolean
}

// Helper to create and execute a proposal in one step
async function proposeAndExecute<TClient extends SDKClient>(
  dao: AkitaDaoSDK,
  actions: ProposalAction<TClient>[]
): Promise<bigint> {
//   const info = await dao.proposalCost({ actions })
//   await dao.client.appClient.fundAppAccount({ amount: info.total.microAlgo() })

  const { return: proposalId } = await dao.newProposal({ actions })
  if (proposalId === undefined) {
    throw new Error('Failed to create proposal')
  }

  await dao.executeProposal({ proposalId })
  return proposalId
}

/**
 * Create a test AKTA asset
 */
async function createTestAktaAsset(
  algorand: AlgorandClient,
  sender: string,
  signer: algosdk.TransactionSigner
): Promise<bigint> {
  console.log('🪙 Creating test AKTA asset...')
  console.log(`   Name: ${TEST_AKTA_CONFIG.name}`)
  console.log(`   Unit: ${TEST_AKTA_CONFIG.unitName}`)
  console.log(`   Decimals: ${TEST_AKTA_CONFIG.decimals}`)
  console.log(`   Total Supply: ${TEST_AKTA_CONFIG.total.toLocaleString()}\n`)

  const suggestedParams = await algorand.client.algod.getTransactionParams().do()

  const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    sender,
    total: TEST_AKTA_CONFIG.total,
    decimals: TEST_AKTA_CONFIG.decimals,
    defaultFrozen: false,
    unitName: TEST_AKTA_CONFIG.unitName,
    assetName: TEST_AKTA_CONFIG.name,
    manager: sender,
    reserve: sender,
    freeze: sender,
    clawback: sender,
    suggestedParams,
  })

  const signedTxn = await signer([txn], [0])
  const { txid } = await algorand.client.algod.sendRawTransaction(signedTxn[0]).do()

  // Wait for confirmation
  const result = await algosdk.waitForConfirmation(algorand.client.algod, txid, 4)
  const assetId = BigInt(result.assetIndex!)

  console.log(`   ✅ Test AKTA created with asset ID: ${assetId}\n`)

  return assetId
}

// Parse command line arguments
function parseArgs(): UpdateOptions {
  const args = process.argv.slice(2)
  let network: Network = 'localnet'
  let mnemonic: string | undefined
  let aktaAssetId: bigint | undefined
  let mint = false
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
    } else if (args[i] === '--mint') {
      mint = true
    } else if (args[i] === '--akta-asset-id' || args[i] === '--akta') {
      aktaAssetId = BigInt(args[i + 1])
      i++
    } else if (args[i] === '--dry-run' || args[i] === '--dryrun') {
      dryRun = true
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
Usage: ts-node scripts/update-akta-asset.ts [options]

Options:
  --network, -n <network>       Network to update (localnet, testnet, mainnet). Default: localnet
  --mnemonic, -m <mnemonic>     Mnemonic phrase for the deployer account (required for testnet/mainnet)
  --akta-asset-id, --akta <id>  AKTA asset ID to set (optional, uses network default if not provided)
  --mint                        Create a new test AKTA token (localnet/testnet only)
  --dry-run                     Show what would happen without executing
  --help, -h                    Show this help message

Default AKTA Asset IDs:
  - Mainnet: 523683256 (official AKTA token)
  - Testnet: Not set (use --akta-asset-id or --mint)
  - Localnet: Not set (use --akta-asset-id or --mint)

Examples:
  # Mainnet - use the official AKTA token
  ts-node scripts/update-akta-asset.ts --network mainnet --mnemonic "your mnemonic"

  # Testnet - mint a new test token
  ts-node scripts/update-akta-asset.ts --network testnet --mnemonic "your mnemonic" --mint

  # Testnet - use an existing token
  ts-node scripts/update-akta-asset.ts -n testnet -m "your mnemonic" --akta-asset-id 12345678

  # Dry run
  ts-node scripts/update-akta-asset.ts --dry-run --network mainnet
`)
      process.exit(0)
    }
  }

  // Validate mnemonic requirement (not required for dry-run)
  if (network !== 'localnet' && !mnemonic && !dryRun) {
    console.error('Error: --mnemonic is required for testnet and mainnet (not required for --dry-run)')
    process.exit(1)
  }

  // Validate --mint is not used on mainnet
  if (mint && network === 'mainnet') {
    console.error('Error: --mint is not allowed on mainnet. Use the official AKTA token (523683256).')
    process.exit(1)
  }

  // Use provided asset ID or network default (unless minting)
  if (!aktaAssetId && !mint) {
    aktaAssetId = AKTA_ASSET_IDS[network]
  }

  // Validate AKTA asset ID (skip if minting)
  if (!mint && (!aktaAssetId || aktaAssetId === 0n)) {
    console.error(`Error: No AKTA asset ID available for ${network}.`)
    console.error(`       Use --akta-asset-id to specify the AKTA asset ID, or --mint to create a test token.`)
    process.exit(1)
  }

  return { network, mnemonic, aktaAssetId, mint, dryRun }
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
  console.log(`\n🐕 AKTA Asset Update Script\n`)
  console.log(`   Network: ${options.network}`)
  console.log(`   Mint Test Token: ${options.mint ? 'Yes' : 'No'}`)
  if (!options.mint) {
    console.log(`   AKTA Asset ID: ${options.aktaAssetId}`)
  }
  console.log()

  try {
    // Get network app IDs
    const appIds = getNetworkAppIds(options.network)

    console.log(`📋 DAO Configuration:`)
    console.log(`   DAO App ID: ${appIds.dao}`)
    console.log(`   Current AKTA in SDK: ${appIds.akta}\n`)

    if (options.dryRun) {
      console.log('🧪 DRY RUN MODE - Showing what would happen:\n')
      if (options.mint) {
        console.log(`   1. Create test AKTA token (${TEST_AKTA_CONFIG.total.toLocaleString()} ${TEST_AKTA_CONFIG.unitName})`)
        console.log(`   2. Connect to DAO at app ID ${appIds.dao}`)
        console.log(`   3. Create proposal to update akita_assets.akta = <new asset id>`)
        console.log(`   4. Execute proposal`)
      } else {
        console.log(`   1. Connect to DAO at app ID ${appIds.dao}`)
        console.log(`   2. Create proposal to update akita_assets.akta = ${options.aktaAssetId}`)
        console.log(`   3. Execute proposal`)
      }
      console.log('\n✅ Dry run complete! Run without --dry-run to execute.\n')
      process.exit(0)
    }

    // Create Algorand client
    const algorand = createAlgorandClient(options.network)

    // Create account and fixture
    let account: algosdk.Account
    let sender: string
    let signer: algosdk.TransactionSigner

    if (options.network === 'localnet') {
      const fixture = algorandFixture()
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
      sender = result.sender
      signer = result.signer
    } else {
      throw new Error('Mnemonic is required for non-localnet networks')
    }

    // Check account balance
    const accountInfo = await algorand.client.algod.accountInformation(sender).do()
    const balance = BigInt(accountInfo.amount)
    console.log(`💰 Account balance: ${balance / 1_000_000n} ALGO\n`)

    const minBalance = options.mint ? 15_000_000n : 10_000_000n // Extra for asset creation
    if (balance < minBalance) {
      console.error(`❌ Insufficient balance. Need at least ${minBalance / 1_000_000n} ALGO.`)
      process.exit(1)
    }

    // Mint test AKTA if requested
    let aktaAssetId = options.aktaAssetId
    if (options.mint) {
      aktaAssetId = await createTestAktaAsset(algorand, sender, signer)
    }

    // Set network for SDK
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

    // Get current akita_assets state
    try {
      const akitaAssets = await dao.client.state.global.akitaAssets()
      console.log(`   Current akita_assets:`)
      console.log(`     - akta: ${akitaAssets?.akta ?? 0n}`)
      console.log(`     - bones: ${akitaAssets?.bones ?? 0n}\n`)
    } catch (e) {
      console.log(`   Could not read current akita_assets state\n`)
    }

    // Create and execute proposal to update akita_assets
    console.log('📜 Creating proposal to update akita_assets...')
    const proposalId = await proposeAndExecute(dao, [
      {
        type: ProposalActionEnum.UpdateFields,
        field: 'akita_assets',
        value: { akta: aktaAssetId }
      }
    ])
    console.log(`   ✅ Proposal created and executed: ${proposalId}\n`)

    // Verify the update
    try {
      const akitaAssets = await dao.client.state.global.akitaAssets()
      console.log(`📋 Updated akita_assets:`)
      console.log(`   - akta: ${akitaAssets?.akta ?? 0n}`)
      console.log(`   - bones: ${akitaAssets?.bones ?? 0n}\n`)
    } catch (e) {
      console.log(`   Could not verify akita_assets state\n`)
    }

    // Display summary
    console.log('='.repeat(60))
    console.log('✅ AKTA ASSET UPDATE COMPLETE!')
    console.log('='.repeat(60))
    console.log(`
Summary:
  Network: ${options.network}${options.mint ? ' (minted new test token)' : ''}
  AKTA Asset ID: ${aktaAssetId}
  Proposal ID: ${proposalId}

⚠️  IMPORTANT: Make sure the SDK networks.ts file is updated:
  akta: ${aktaAssetId}n,
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

