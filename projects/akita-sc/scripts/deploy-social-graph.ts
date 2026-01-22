#!/usr/bin/env node

/**
 * Deploy Social Graph Contract
 * 
 * This script deploys a new AkitaSocialGraph contract with proper initialization.
 * Use this to fix deployments where the social graph wasn't properly initialized.
 * 
 * It also updates the DAO's akitaSocialAppList with the new social graph app ID.
 * 
 * Usage:
 *   npx ts-node scripts/deploy-social-graph.ts --network localnet
 *   npx ts-node scripts/deploy-social-graph.ts -n testnet -m "your mnemonic"
 *   npx ts-node scripts/deploy-social-graph.ts -n localnet --dao-app-id 1006  # override DAO app ID
 *   npx ts-node scripts/deploy-social-graph.ts -n localnet --skip-dao-update  # don't update DAO
 */

import { AlgorandClient, microAlgo } from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import algosdk, { makeBasicAccountTransactionSigner } from 'algosdk'
import { AkitaDaoSDK, NETWORK_APP_IDS, SDKClient, setCurrentNetwork } from 'akita-sdk'
import { ProposalAction, ProposalActionEnum } from 'akita-sdk/dao'
import { AkitaSocialGraphFactory } from '../smart_contracts/artifacts/social/AkitaSocialGraphClient'

type Network = 'localnet' | 'testnet' | 'mainnet'

interface DeployOptions {
  network: Network
  mnemonic?: string
  daoAppId?: bigint  // Now optional - will use SDK network config if not provided
  version: string
  skipDaoUpdate: boolean  // If true, skip updating the DAO with the new app ID
  forceDaoUpdate: boolean // If true, force DAO update even on localnet
}

// Get DAO app ID from SDK network config
function getDaoAppIdFromNetwork(network: Network): bigint {
  const networkAppIds = NETWORK_APP_IDS[network]
  if (!networkAppIds || !networkAppIds.dao) {
    throw new Error(`No DAO app ID configured for network: ${network}`)
  }
  return networkAppIds.dao
}

// Parse command line arguments
function parseArgs(): DeployOptions {
  const args = process.argv.slice(2)
  let network: Network = 'localnet'
  let mnemonic: string | undefined
  let daoAppId: bigint | undefined
  let version = '0.0.1'
  let skipDaoUpdate = false
  let forceDaoUpdate = false

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
    } else if (args[i] === '--dao-app-id' || args[i] === '-d') {
      const value = args[i + 1]
      if (value) {
        daoAppId = BigInt(value)
        i++
      }
    } else if (args[i] === '--version' || args[i] === '-v') {
      version = args[i + 1]
      i++
    } else if (args[i] === '--skip-dao-update') {
      skipDaoUpdate = true
    } else if (args[i] === '--force-dao-update') {
      forceDaoUpdate = true
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
Usage: ts-node scripts/deploy-social-graph.ts [options]

Options:
  --network, -n <network>        Network to deploy to (localnet, testnet, mainnet). Default: localnet
  --mnemonic, -m <mnemonic>      Mnemonic phrase for the deployer account (required for testnet/mainnet)
  --dao-app-id, -d <appId>       The DAO app ID to link the social graph to (optional, uses SDK network config if not provided)
  --version, -v <version>        Version string for the contract. Default: 0.0.1
  --skip-dao-update              Skip updating the DAO with the new social graph app ID
  --force-dao-update             Force DAO update even on localnet (requires deployer account)
  --help, -h                     Show this help message

Note: On localnet, DAO updates are skipped by default because the DAO requires the original
      deployer account to create proposals. Use --force-dao-update with a mnemonic if needed.

Examples:
  ts-node scripts/deploy-social-graph.ts -n localnet
  ts-node scripts/deploy-social-graph.ts -n testnet -m "your mnemonic"
  ts-node scripts/deploy-social-graph.ts -n localnet --dao-app-id 1006  # override DAO app ID
  ts-node scripts/deploy-social-graph.ts -n localnet --skip-dao-update  # don't update DAO
  ts-node scripts/deploy-social-graph.ts -n localnet --force-dao-update -m "deployer mnemonic"  # force update with deployer
`)
      process.exit(0)
    }
  }

  // Get DAO app ID from SDK if not provided
  if (!daoAppId) {
    try {
      daoAppId = getDaoAppIdFromNetwork(network)
      console.log(`📋 Using DAO app ID from SDK network config: ${daoAppId}`)
    } catch (error) {
      console.error(`Error: Could not get DAO app ID from SDK for network '${network}'.`)
      console.error('       Please provide --dao-app-id explicitly.')
      process.exit(1)
    }
  }

  // Validate mnemonic requirement for non-localnet
  if (network !== 'localnet' && !mnemonic) {
    console.error('Error: --mnemonic is required for testnet and mainnet deployments')
    process.exit(1)
  }

  return {
    network,
    mnemonic,
    daoAppId,
    version,
    skipDaoUpdate,
    forceDaoUpdate,
  }
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

// Main deployment function
async function deploy() {
  const options = parseArgs()
  
  // daoAppId is guaranteed to be set after parseArgs
  const daoAppId = options.daoAppId!
  
  console.log(`\n🚀 Deploying AkitaSocialGraph to ${options.network}...\n`)
  console.log(`   DAO App ID: ${daoAppId}`)
  console.log(`   Version: ${options.version}\n`)

  try {
    let algorand: AlgorandClient
    let sender: string
    let signer: algosdk.TransactionSigner

    if (options.network === 'localnet') {
      // Use fixture for localnet - this properly sets up the algorand client and dispenser
      const fixture = algorandFixture()
      await fixture.newScope()
      algorand = fixture.algorand
      
      // If mnemonic is provided (e.g., for --force-dao-update), use that account
      // Otherwise use the fixture's test account
      if (options.mnemonic) {
        const account = algosdk.mnemonicToSecretKey(options.mnemonic)
        sender = account.addr.toString()
        signer = makeBasicAccountTransactionSigner(account)
        console.log(`📝 Using provided account on localnet: ${sender}`)
        
        // Fund the account from dispenser if needed
        try {
          const dispenser = await algorand.account.kmd.getLocalNetDispenserAccount()
          await algorand.send.payment({
            sender: dispenser.addr.toString(),
            signer: dispenser.signer,
            receiver: sender,
            amount: microAlgo(100_000_000),
          })
          console.log('   Account funded with 100 ALGO from dispenser')
        } catch (e) {
          console.log(`   Warning: Could not fund account from dispenser: ${e instanceof Error ? e.message : e}`)
        }
      } else {
        const { testAccount } = fixture.context
        sender = testAccount.addr.toString()
        signer = testAccount.signer
        console.log(`📝 Using localnet test account: ${sender}`)
        
        // Ensure the test account has enough funds for deployment
        try {
          const dispenser = await algorand.account.kmd.getLocalNetDispenserAccount()
          await algorand.send.payment({
            sender: dispenser.addr.toString(),
            signer: dispenser.signer,
            receiver: testAccount.addr.toString(),
            amount: microAlgo(100_000_000),
          })
          console.log('   Account funded with 100 ALGO from dispenser')
        } catch (e) {
          console.log(`   Warning: Could not fund account from dispenser: ${e instanceof Error ? e.message : e}`)
        }
      }
      console.log('')
    } else {
      algorand = createAlgorandClient(options.network)
      if (!options.mnemonic) {
        throw new Error('Mnemonic is required for non-localnet networks')
      }
      const account = algosdk.mnemonicToSecretKey(options.mnemonic)
      sender = account.addr.toString()
      signer = makeBasicAccountTransactionSigner(account)
      console.log(`📝 Using account: ${sender}\n`)

      // Check balance
      const accountInfo = await algorand.client.algod.accountInformation(sender).do()
      const balance = BigInt(accountInfo.amount)
      console.log(`💰 Account balance: ${balance / 1_000_000n} ALGO\n`)

      if (balance < 10_000_000n) {
        console.error('Error: Insufficient balance. Need at least 10 ALGO.')
        process.exit(1)
      }
    }

    // Deploy the Social Graph contract
    console.log('📦 Deploying AkitaSocialGraph contract...\n')

    const factory = algorand.client.getTypedAppFactory(
      AkitaSocialGraphFactory,
      {
        defaultSender: sender,
        defaultSigner: signer,
      }
    )

    const result = await factory.send.create.create({
      args: {
        akitaDao: daoAppId,
        version: options.version,
      }
    })

    const appClient = result.appClient

    console.log('='.repeat(60))
    console.log('✅ DEPLOYMENT COMPLETE!')
    console.log('='.repeat(60))
    console.log('')
    console.log(`   App ID:      ${appClient.appId}`)
    console.log(`   App Address: ${appClient.appAddress}`)
    console.log(`   DAO App ID:  ${daoAppId}`)
    console.log(`   Version:     ${options.version}`)
    console.log('')
    console.log('📋 Next Steps:')
    console.log('')
    console.log('   1. Update your SDK networks.ts with the new socialGraph app ID')
    console.log('   2. Or update your .env file with:')
    console.log(`      SOCIAL_GRAPH_APP_ID=${appClient.appId}`)
    console.log('')

    // Verify global state
    console.log('🔍 Verifying global state...\n')
    const globalState = await appClient.state.global.getAll()
    console.log('   Global State:')
    console.log(`     akitaDao: ${globalState.akitaDao ?? 'NOT SET'}`)
    console.log(`     version:  ${globalState.version ?? 'NOT SET'}`)
    console.log('')

    if (!globalState.akitaDao) {
      console.error('⚠️  Warning: akitaDao was not set properly!')
    } else {
      console.log('✅ Contract initialized successfully with DAO reference!')
    }

    // Determine if we should update the DAO
    // On localnet, skip by default unless --force-dao-update is set
    // On other networks, update unless --skip-dao-update is set
    const shouldUpdateDao = options.network === 'localnet' 
      ? options.forceDaoUpdate && !options.skipDaoUpdate
      : !options.skipDaoUpdate

    // Update DAO with new social graph app ID
    if (shouldUpdateDao) {
      console.log('\n📝 Updating DAO with new social graph app ID...\n')
      
      try {
        // Set the network context for the SDK
        setCurrentNetwork(options.network)
        
        // Create DAO SDK instance
        const daoSdk = new AkitaDaoSDK({
          algorand,
          factoryParams: {
            appId: daoAppId,
            defaultSender: sender,
            defaultSigner: signer,
          },
        })

        // Get current social app list from DAO
        const currentSalState = await daoSdk.client.state.global.akitaSocialAppList()
        
        if (!currentSalState) {
          console.log('   ⚠️  No existing akitaSocialAppList found in DAO')
          console.log('   Creating new akitaSocialAppList with only graph set')
        }

        console.log('   Current akitaSocialAppList:')
        console.log(`     social:     ${currentSalState?.social ?? 'NOT SET'}`)
        console.log(`     graph:      ${currentSalState?.graph ?? 'NOT SET'}`)
        console.log(`     impact:     ${currentSalState?.impact ?? 'NOT SET'}`)
        console.log(`     moderation: ${currentSalState?.moderation ?? 'NOT SET'}`)
        console.log('')
        console.log('   New akitaSocialAppList:')
        console.log(`     social:     ${currentSalState?.social ?? 'NOT SET'}`)
        console.log(`     graph:      ${appClient.appId} (updated)`)
        console.log(`     impact:     ${currentSalState?.impact ?? 'NOT SET'}`)
        console.log(`     moderation: ${currentSalState?.moderation ?? 'NOT SET'}`)
        console.log('')

        // Get proposal cost
        const proposalActions: ProposalAction<SDKClient>[] = [{
          type: ProposalActionEnum.UpdateFields,
          field: 'sal',
          value: { graph: appClient.appId } 
        }]

        // const proposalCost = await daoSdk.proposalCost({ actions: proposalActions })
        // console.log(`   Proposal cost: ${Number(proposalCost.total) / 1_000_000} ALGO`)

        // Fund the DAO for the proposal
        // await daoSdk.client.appClient.fundAppAccount({ amount: microAlgo(proposalCost.total) })

        // Create and execute proposal
        console.log('   Creating proposal...')
        const { return: proposalId } = await daoSdk.newProposal({ actions: proposalActions })

        if (proposalId === undefined) {
          throw new Error('Failed to create proposal - no proposal ID returned')
        }

        console.log(`   Proposal created: ${proposalId}`)
        console.log('   Executing proposal...')
        
        await daoSdk.executeProposal({ proposalId })
        
        console.log('')
        console.log('✅ DAO updated with new social graph app ID!')
      } catch (daoError) {
        console.error('')
        console.error('⚠️  Failed to update DAO:', daoError instanceof Error ? daoError.message : daoError)
        console.error('   The social graph contract was deployed successfully, but the DAO was not updated.')
        console.error('   You may need to manually update the DAO or run with --skip-dao-update and update separately.')
      }
    } else {
      if (options.network === 'localnet' && !options.forceDaoUpdate) {
        console.log('\n⏭️  Skipping DAO update on localnet (default behavior)')
        console.log('   On localnet, the DAO requires the original deployer account to create proposals.')
        console.log('   The social graph was deployed successfully - you have two options:')
        console.log('')
        console.log('   Option 1: Update the SDK network config manually:')
        console.log(`             Set socialGraph: ${appClient.appId}n in LOCALNET_APP_IDS`)
        console.log('')
        console.log('   Option 2: Re-run deploy-universe.ts to redeploy all contracts in sync')
        console.log('')
        console.log('   Option 3: Use --force-dao-update with the deployer mnemonic:')
        console.log('             npm run deploy:social-graph -- -n localnet --force-dao-update -m "your mnemonic"')
      } else {
        console.log('\n⏭️  Skipping DAO update (--skip-dao-update flag set)')
      }
    }

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

