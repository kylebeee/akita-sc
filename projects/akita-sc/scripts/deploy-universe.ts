#!/usr/bin/env node

import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { AlgorandFixture } from '@algorandfoundation/algokit-utils/types/testing'
import algosdk, { makeBasicAccountTransactionSigner } from 'algosdk'
import { AkitaDaoApps } from '../smart_contracts/artifacts/arc58/dao/AkitaDAOClient'
import { AkitaUniverse, buildAkitaUniverse } from '../tests/fixtures/dao'

type Network = 'localnet' | 'testnet' | 'mainnet'

interface DeployOptions {
  network: Network
  mnemonic?: string
  apps?: Partial<AkitaDaoApps>
}

// Get network-specific defaults for OtherAppList
// Note: escrow and poll are always set internally from deployment
// Only vrfBeacon, nfdRegistry, assetInbox, and akitaNfd can be set externally
function getNetworkOtherAppListDefaults(network: Network): Partial<AkitaDaoApps> {
  // Network-specific app IDs
  // These are the official app IDs for each network
  // Update these with actual network values when available
  const defaults: Record<Network, Partial<AkitaDaoApps>> = {
    localnet: {
      // For localnet, typically use 0n (not needed for local testing)
      vrfBeacon: 0n,
      nfdRegistry: 0n,
      assetInbox: 0n,
      akitaNfd: 0n,
    },
    testnet: {
      // Testnet app IDs - update these with actual testnet values when available
      vrfBeacon: 600011887n, // Algorand VRF Beacon testnet app ID
      nfdRegistry: 84366825n, // NFD Registry testnet app ID
      assetInbox: 643020148n, // Asset Inbox testnet app ID
      akitaNfd: 0n, // Akita NFD testnet app ID
    },
    mainnet: {
      // Mainnet app IDs - update these with actual mainnet values when available
      vrfBeacon: 1615566206n, // Algorand VRF Beacon mainnet app ID
      nfdRegistry: 760937186n, // NFD Registry mainnet app ID
      assetInbox: 2449590623n, // Asset Inbox mainnet app ID
      akitaNfd: 765902356n, // Akita NFD mainnet app ID
    },
  }
  return defaults[network]
}

// Parse command line arguments
function parseArgs(): DeployOptions {
  const args = process.argv.slice(2)
  let network: Network = 'localnet'
  let mnemonic: string | undefined
  const apps: Partial<AkitaDaoApps> = {}

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
    } else if (args[i] === '--vrf-beacon') {
      const value = args[i + 1]
      if (value) {
        apps.vrfBeacon = BigInt(value)
        i++
      }
    } else if (args[i] === '--nfd-registry') {
      const value = args[i + 1]
      if (value) {
        apps.nfdRegistry = BigInt(value)
        i++
      }
    } else if (args[i] === '--asset-inbox') {
      const value = args[i + 1]
      if (value) {
        apps.assetInbox = BigInt(value)
        i++
      }
    } else if (args[i] === '--akita-nfd') {
      const value = args[i + 1]
      if (value) {
        apps.akitaNfd = BigInt(value)
        i++
      }
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
Usage: ts-node scripts/deploy-universe.ts [options]

Options:
  --network, -n <network>        Network to deploy to (localnet, testnet, mainnet). Default: localnet
  --mnemonic, -m <mnemonic>      Mnemonic phrase for the deployer account (required for testnet/mainnet, optional for localnet)
  --vrf-beacon <appId>          VRF Beacon app ID (optional, uses network defaults if not provided)
  --nfd-registry <appId>        NFD Registry app ID (optional, uses network defaults if not provided)
  --asset-inbox <appId>         Asset Inbox app ID (optional, uses network defaults if not provided)
  --akita-nfd <appId>           Akita NFD app ID (optional, uses network defaults if not provided)
  --help, -h                    Show this help message

Cost Information:
  Estimated actual cost: ~287-317 ALGO for testnet/mainnet
  Recommended account balance: 500-600 ALGO (includes safety buffer)
  See scripts/DEPLOYMENT_COSTS.md for detailed cost breakdown

Examples:
  ts-node scripts/deploy-universe.ts
  ts-node scripts/deploy-universe.ts --network testnet --mnemonic "your mnemonic phrase here"
  ts-node scripts/deploy-universe.ts -n mainnet -m "your mnemonic phrase here" --vrf-beacon 123456
`)
      process.exit(0)
    }
  }

  // Validate mnemonic requirement
  if (network !== 'localnet' && !mnemonic) {
    console.error('Error: --mnemonic is required for testnet and mainnet deployments')
    process.exit(1)
  }

  // Merge with network defaults (command-line args override defaults)
  const networkDefaults = getNetworkOtherAppListDefaults(network)
  const finalApps: Partial<AkitaDaoApps> = {
    ...networkDefaults,
    ...apps,
  }

  // Only include otherAppList if at least one value is non-zero
  const hasNonZeroValue = Object.values(finalApps).some(
    (value) => value !== undefined && value > 0n
  )

  return {
    network,
    mnemonic,
    apps: hasNonZeroValue ? finalApps : undefined
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
    // Use the actual fixture for localnet
    const fixture = algorandFixture()
    await fixture.newScope()
    const { testAccount } = fixture.context
    return {
      fixture,
      sender: testAccount.addr.toString(),
      signer: testAccount.signer,
    }
  } else {
    // For testnet/mainnet, create a minimal fixture-like structure
    const sender: string = account.addr.toString()
    const signer = makeBasicAccountTransactionSigner(account)

    // Create a minimal fixture structure that matches what buildAkitaUniverse expects
    // The fixture needs both fixture.algorand and fixture.context.algorand
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

// Generate environment variables for deployed apps
function generateEnvFile(
  universe: AkitaUniverse,
  network: Network,
  apps?: Partial<AkitaDaoApps>
): string {
  const lines: string[] = [
    `# Akita Universe Deployment - ${network}`,
    `# Generated at: ${new Date().toISOString()}`,
    ``,
    `# Network`,
    `ALGORAND_NETWORK=${network}`,
    ``,
    `# Core Contracts`,
    `DAO_APP_ID=${universe.dao.appId}`,
    `WALLET_APP_ID=${universe.dao.wallet.client.appId}`,
    `ESCROW_FACTORY_APP_ID=${universe.escrowFactory.appId}`,
    `WALLET_FACTORY_APP_ID=${universe.walletFactory.appId}`,
    `SUBSCRIPTIONS_APP_ID=${universe.subscriptions.appId}`,
    `STAKING_POOL_FACTORY_APP_ID=${universe.stakingPoolFactory.appId}`,
    `STAKING_APP_ID=${universe.staking.appId}`,
    ``,
    `# Social System`,
    `SOCIAL_APP_ID=${universe.social.socialAppId}`,
    `SOCIAL_GRAPH_APP_ID=${universe.social.graphAppId}`,
    `SOCIAL_IMPACT_APP_ID=${universe.social.impactAppId}`,
    `SOCIAL_MODERATION_APP_ID=${universe.social.moderationAppId}`,
    ``,
    `# Factories`,
    `AUCTION_FACTORY_APP_ID=${universe.auctionFactory.appId}`,
    `MARKETPLACE_APP_ID=${universe.marketplace.appId}`,
    `RAFFLE_FACTORY_APP_ID=${universe.raffleFactory.appId}`,
    `POLL_FACTORY_APP_ID=${universe.pollFactory.appId}`,
    `PRIZE_BOX_FACTORY_APP_ID=${universe.prizeBoxFactory.appId}`,
    ``,
    `# Plugins`,
    `REVENUE_MANAGER_PLUGIN_APP_ID=${universe.revenueManagerPlugin.appId}`,
    `UPDATE_PLUGIN_APP_ID=${universe.updatePlugin.appId}`,
    `OPTIN_PLUGIN_APP_ID=${universe.optInPlugin.appId}`,
    `ASA_MINT_PLUGIN_APP_ID=${universe.asaMintPlugin.appId}`,
    `PAY_PLUGIN_APP_ID=${universe.payPlugin.appId}`,
    `HYPER_SWAP_PLUGIN_APP_ID=${universe.hyperSwapPlugin.appId}`,
    `SUBSCRIPTIONS_PLUGIN_APP_ID=${universe.subscriptionsPlugin.appId}`,
    `AUCTION_PLUGIN_APP_ID=${universe.auctionPlugin.appId}`,
    `DAO_PLUGIN_APP_ID=${universe.daoPlugin.appId}`,
    `DUAL_STAKE_PLUGIN_APP_ID=${universe.dualStakePlugin.appId}`,
    `GATE_PLUGIN_APP_ID=${universe.gatePlugin.appId}`,
    `MARKETPLACE_PLUGIN_APP_ID=${universe.marketplacePlugin.appId}`,
    `NFD_PLUGIN_APP_ID=${universe.nfdPlugin.appId}`,
    `PAY_SILO_PLUGIN_APP_ID=${universe.paySiloPlugin.appId}`,
    `PAY_SILO_FACTORY_PLUGIN_APP_ID=${universe.paySiloFactoryPlugin.appId}`,
    `POLL_PLUGIN_APP_ID=${universe.pollPlugin.appId}`,
    `RAFFLE_PLUGIN_APP_ID=${universe.rafflePlugin.appId}`,
    `REWARDS_PLUGIN_APP_ID=${universe.rewardsPlugin.appId}`,
    `SOCIAL_PLUGIN_APP_ID=${universe.socialPlugin.appId}`,
    `STAKING_PLUGIN_APP_ID=${universe.stakingPlugin.appId}`,
    `STAKING_POOL_PLUGIN_APP_ID=${universe.stakingPoolPlugin.appId}`,
    ``,
    `# Gate & Other`,
    `GATE_APP_ID=${universe.gate.appId}`,
    `HYPER_SWAP_APP_ID=${universe.hyperSwap.appId}`,
    `META_MERKLES_APP_ID=${universe.metaMerkles.appId}`,
    ``,
    `# Subgates`,
    `AKITA_REFERRER_GATE_APP_ID=${universe.subgates.akitaReferrerGate.appId}`,
    `ASSET_GATE_APP_ID=${universe.subgates.assetGate.appId}`,
    `MERKLE_ADDRESS_GATE_APP_ID=${universe.subgates.merkleAddressGate.appId}`,
    `MERKLE_ASSET_GATE_APP_ID=${universe.subgates.merkleAssetGate.appId}`,
    `NFD_GATE_APP_ID=${universe.subgates.nfdGate.appId}`,
    `NFD_ROOT_GATE_APP_ID=${universe.subgates.nfdRootGate.appId}`,
    `POLL_GATE_APP_ID=${universe.subgates.pollGate.appId}`,
    `SOCIAL_ACTIVITY_GATE_APP_ID=${universe.subgates.socialActivityGate.appId}`,
    `SOCIAL_FOLLOWER_COUNT_GATE_APP_ID=${universe.subgates.socialFollowerCountGate.appId}`,
    `SOCIAL_FOLLOWER_INDEX_GATE_APP_ID=${universe.subgates.socialFollowerIndexGate.appId}`,
    `SOCIAL_IMPACT_GATE_APP_ID=${universe.subgates.socialImpactGate.appId}`,
    `SOCIAL_MODERATOR_GATE_APP_ID=${universe.subgates.socialModeratorGate.appId}`,
    `STAKING_AMOUNT_GATE_APP_ID=${universe.subgates.stakingAmountGate.appId}`,
    `STAKING_POWER_GATE_APP_ID=${universe.subgates.stakingPowerGate.appId}`,
    `SUBSCRIPTION_GATE_APP_ID=${universe.subgates.subscriptionGate.appId}`,
    `SUBSCRIPTION_STREAK_GATE_APP_ID=${universe.subgates.subscriptionStreakGate.appId}`,
    ``,
    `# Assets`,
    `AKTA_ASSET_ID=${universe.aktaAssetId}`,
    `BONES_ASSET_ID=${universe.bonesAssetId}`,
    `USDC_ASSET_ID=${universe.usdcAssetId}`,
  ]

  // Add OtherAppList configuration if provided
  if (apps) {
    const hasNonZeroValue = Object.values(apps).some(
      (value) => value !== undefined && value > 0n
    )
    if (hasNonZeroValue) {
      lines.push(``)
      lines.push(`# External Apps (OtherAppList)`)
      if (apps.vrfBeacon && apps.vrfBeacon > 0n) {
        lines.push(`VRF_BEACON_APP_ID=${apps.vrfBeacon}`)
      }
      if (apps.nfdRegistry && apps.nfdRegistry > 0n) {
        lines.push(`NFD_REGISTRY_APP_ID=${apps.nfdRegistry}`)
      }
      if (apps.assetInbox && apps.assetInbox > 0n) {
        lines.push(`ASSET_INBOX_APP_ID=${apps.assetInbox}`)
      }
      if (apps.akitaNfd && apps.akitaNfd > 0n) {
        lines.push(`AKITA_NFD_APP_ID=${apps.akitaNfd}`)
      }
    }
  }

  lines.push(``)
  return lines.join('\n')
}

// Generate the NetworkAppIds content for a network
function generateNetworkAppIds(
  universe: AkitaUniverse,
  network: Network,
  apps?: Partial<AkitaDaoApps>
): string {
  const timestamp = new Date().toISOString()
  const networkUpper = network.toUpperCase()

  return `/**
 * ${network.charAt(0).toUpperCase() + network.slice(1)} app IDs
 * 
 * ${network === 'localnet' ? 'These are auto-generated by deploy-universe.ts when deploying to localnet.\n * They will be overwritten each time you run a localnet deployment.\n * \n * ' : ''}Last updated: ${timestamp}
 */
export const ${networkUpper}_APP_IDS: NetworkAppIds = {
  // Core Contracts
  dao: ${universe.dao.appId}n,
  wallet: ${universe.dao.wallet.client.appId}n,
  escrowFactory: ${universe.escrowFactory.appId}n,
  walletFactory: ${universe.walletFactory.appId}n,
  subscriptions: ${universe.subscriptions.appId}n,
  stakingPoolFactory: ${universe.stakingPoolFactory.appId}n,
  staking: ${universe.staking.appId}n,
  
  // Social System
  social: ${universe.social.socialAppId}n,
  socialGraph: ${universe.social.graphAppId}n,
  socialImpact: ${universe.social.impactAppId}n,
  socialModeration: ${universe.social.moderationAppId}n,
  
  // Factories
  auctionFactory: ${universe.auctionFactory.appId}n,
  marketplace: ${universe.marketplace.appId}n,
  raffleFactory: ${universe.raffleFactory.appId}n,
  pollFactory: ${universe.pollFactory.appId}n,
  prizeBoxFactory: ${universe.prizeBoxFactory.appId}n,
  
  // Plugins
  revenueManagerPlugin: ${universe.revenueManagerPlugin.appId}n,
  updatePlugin: ${universe.updatePlugin.appId}n,
  optinPlugin: ${universe.optInPlugin.appId}n,
  asaMintPlugin: ${universe.asaMintPlugin.appId}n,
  payPlugin: ${universe.payPlugin.appId}n,
  hyperSwapPlugin: ${universe.hyperSwapPlugin.appId}n,
  subscriptionsPlugin: ${universe.subscriptionsPlugin.appId}n,
  auctionPlugin: ${universe.auctionPlugin.appId}n,
  daoPlugin: ${universe.daoPlugin.appId}n,
  dualStakePlugin: ${universe.dualStakePlugin.appId}n,
  gatePlugin: ${universe.gatePlugin.appId}n,
  marketplacePlugin: ${universe.marketplacePlugin.appId}n,
  nfdPlugin: ${universe.nfdPlugin.appId}n,
  paySiloPlugin: ${universe.paySiloPlugin.appId}n,
  paySiloFactoryPlugin: ${universe.paySiloFactoryPlugin.appId}n,
  pollPlugin: ${universe.pollPlugin.appId}n,
  rafflePlugin: ${universe.rafflePlugin.appId}n,
  rewardsPlugin: ${universe.rewardsPlugin.appId}n,
  socialPlugin: ${universe.socialPlugin.appId}n,
  stakingPlugin: ${universe.stakingPlugin.appId}n,
  stakingPoolPlugin: ${universe.stakingPoolPlugin.appId}n,
  
  // Gate & Other
  gate: ${universe.gate.appId}n,
  hyperSwap: ${universe.hyperSwap.appId}n,
  metaMerkles: ${universe.metaMerkles.appId}n,
  
  // Subgates
  akitaReferrerGate: ${universe.subgates.akitaReferrerGate.appId}n,
  assetGate: ${universe.subgates.assetGate.appId}n,
  merkleAddressGate: ${universe.subgates.merkleAddressGate.appId}n,
  merkleAssetGate: ${universe.subgates.merkleAssetGate.appId}n,
  nfdGate: ${universe.subgates.nfdGate.appId}n,
  nfdRootGate: ${universe.subgates.nfdRootGate.appId}n,
  pollGate: ${universe.subgates.pollGate.appId}n,
  socialActivityGate: ${universe.subgates.socialActivityGate.appId}n,
  socialFollowerCountGate: ${universe.subgates.socialFollowerCountGate.appId}n,
  socialFollowerIndexGate: ${universe.subgates.socialFollowerIndexGate.appId}n,
  socialImpactGate: ${universe.subgates.socialImpactGate.appId}n,
  socialModeratorGate: ${universe.subgates.socialModeratorGate.appId}n,
  stakingAmountGate: ${universe.subgates.stakingAmountGate.appId}n,
  stakingPowerGate: ${universe.subgates.stakingPowerGate.appId}n,
  subscriptionGate: ${universe.subgates.subscriptionGate.appId}n,
  subscriptionStreakGate: ${universe.subgates.subscriptionStreakGate.appId}n,
  
  // Assets
  akta: ${universe.aktaAssetId}n,
  bones: ${universe.bonesAssetId}n,
  usdc: ${universe.usdcAssetId}n,
  
  // External Apps
  vrfBeacon: ${apps?.vrfBeacon ?? 0n}n,
  nfdRegistry: ${apps?.nfdRegistry ?? 0n}n,
  assetInbox: ${apps?.assetInbox ?? 0n}n,
  akitaNfd: ${apps?.akitaNfd ?? 0n}n,
};`
}

// Update the SDK's networks.ts file with deployed app IDs
async function updateNetworksFile(
  universe: AkitaUniverse,
  network: Network,
  apps?: Partial<AkitaDaoApps>
): Promise<void> {
  const fs = await import('fs/promises')
  const path = await import('path')

  // Path to the SDK's networks.ts file (relative to this script)
  const networksFilePath = path.join(__dirname, '../../akita-sdk/src/networks.ts')

  try {
    // Read the current file
    let content = await fs.readFile(networksFilePath, 'utf-8')

    // Generate the new app IDs block
    const newAppIds = generateNetworkAppIds(universe, network, apps)

    // Create regex to match the existing network's app IDs block
    const networkUpper = network.toUpperCase()
    const regex = new RegExp(
      `\\/\\*\\*\\s*\\n\\s*\\*\\s*${network.charAt(0).toUpperCase() + network.slice(1)}\\s+app\\s+IDs[\\s\\S]*?export\\s+const\\s+${networkUpper}_APP_IDS:\\s*NetworkAppIds\\s*=\\s*\\{[\\s\\S]*?\\};`,
      'g'
    )

    if (regex.test(content)) {
      // Replace existing block
      content = content.replace(regex, newAppIds)
    } else {
      console.warn(`⚠️  Could not find ${networkUpper}_APP_IDS block in networks.ts`)
      console.warn(`   You may need to add it manually.`)
      return
    }

    // Write the updated file
    await fs.writeFile(networksFilePath, content, 'utf-8')
    console.log(`📄 SDK networks.ts updated with ${network} app IDs: ${networksFilePath}`)
  } catch (error) {
    console.warn(`⚠️  Could not update networks.ts:`, error)
    console.warn(`   You may need to update it manually.`)
  }
}

// Format deployment summary
async function formatSummary(
  universe: AkitaUniverse,
  network: Network,
  apps?: Partial<AkitaDaoApps>
): Promise<string> {
  // Get rewards app ID from DAO's akitaAppList
  let rewardsAppId = 'N/A'
  let rewardsAddress = 'N/A'
  try {
    const aal = await universe.dao.client.state.global.akitaAppList()
    if (aal && aal.rewards > 0n) {
      rewardsAppId = aal.rewards.toString()
      rewardsAddress = algosdk.getApplicationAddress(aal.rewards).toString()
    }
  } catch (error) {
    // Fall back to note if can't read
    rewardsAppId = 'See DAO akitaAppList'
  }

  // Social system IDs - available directly from the social SDK
  const socialAppId = universe.social.socialAppId.toString()
  const socialAddress = universe.social.socialClient.appAddress.toString()
  const graphAppId = universe.social.graphAppId.toString()
  const graphAddress = universe.social.graphClient.appAddress.toString()
  const impactAppId = universe.social.impactAppId.toString()
  const impactAddress = universe.social.impactClient.appAddress.toString()
  const moderationAppId = universe.social.moderationAppId.toString()
  const moderationAddress = universe.social.moderationClient.appAddress.toString()

  const summary: any = {
    network,
    timestamp: new Date().toISOString(),
    contracts: {
      dao: {
        appId: universe.dao.appId.toString(),
        address: universe.dao.client.appAddress.toString(),
      },
      wallet: {
        appId: universe.dao.wallet.client.appId.toString(),
        address: universe.dao.wallet.client.appAddress.toString(),
      },
      escrowFactory: {
        appId: universe.escrowFactory.appId.toString(),
        address: universe.escrowFactory.appAddress.toString(),
      },
      walletFactory: {
        appId: universe.walletFactory.appId.toString(),
        address: universe.walletFactory.client.appAddress.toString(),
      },
      rewards: {
        appId: rewardsAppId,
        ...(rewardsAddress !== 'N/A' && rewardsAddress !== 'See DAO akitaAppList' ? { address: rewardsAddress } : {}),
      },
      subscriptions: {
        appId: universe.subscriptions.appId.toString(),
        address: universe.subscriptions.client.appAddress.toString(),
      },
      stakingPoolFactory: {
        appId: universe.stakingPoolFactory.appId.toString(),
        address: universe.stakingPoolFactory.client.appAddress.toString(),
      },
      staking: {
        appId: universe.staking.appId.toString(),
        address: universe.staking.client.appAddress.toString(),
      },
      social: {
        appId: socialAppId,
        address: socialAddress,
      },
      socialGraph: {
        appId: graphAppId,
        address: graphAddress,
      },
      socialImpact: {
        appId: impactAppId,
        address: impactAddress,
      },
      socialModeration: {
        appId: moderationAppId,
        address: moderationAddress,
      },
      auctionFactory: {
        appId: universe.auctionFactory.appId.toString(),
        address: universe.auctionFactory.client.appAddress.toString(),
      },
      marketplace: {
        appId: universe.marketplace.appId.toString(),
        address: universe.marketplace.client.appAddress.toString(),
      },
      raffleFactory: {
        appId: universe.raffleFactory.appId.toString(),
        address: universe.raffleFactory.client.appAddress.toString(),
      },
      pollFactory: {
        appId: universe.pollFactory.appId.toString(),
        address: universe.pollFactory.client.appAddress.toString(),
      },
      prizeBoxFactory: {
        appId: universe.prizeBoxFactory.appId.toString(),
        address: universe.prizeBoxFactory.client.appAddress.toString(),
      },
      revenueManagerPlugin: {
        appId: universe.revenueManagerPlugin.appId.toString(),
        address: universe.revenueManagerPlugin.client.appAddress.toString(),
      },
      updatePlugin: {
        appId: universe.updatePlugin.appId.toString(),
        address: universe.updatePlugin.client.appAddress.toString(),
      },
      optInPlugin: {
        appId: universe.optInPlugin.appId.toString(),
        address: universe.optInPlugin.client.appAddress.toString(),
      },
      asaMintPlugin: {
        appId: universe.asaMintPlugin.appId.toString(),
        address: universe.asaMintPlugin.client.appAddress.toString(),
      },
      payPlugin: {
        appId: universe.payPlugin.appId.toString(),
        address: universe.payPlugin.client.appAddress.toString(),
      },
      hyperSwapPlugin: {
        appId: universe.hyperSwapPlugin.appId.toString(),
        address: universe.hyperSwapPlugin.client.appAddress.toString(),
      },
      subscriptionsPlugin: {
        appId: universe.subscriptionsPlugin.appId.toString(),
        address: universe.subscriptionsPlugin.client.appAddress.toString(),
      },
      auctionPlugin: {
        appId: universe.auctionPlugin.appId.toString(),
        address: universe.auctionPlugin.client.appAddress.toString(),
      },
      daoPlugin: {
        appId: universe.daoPlugin.appId.toString(),
        address: universe.daoPlugin.client.appAddress.toString(),
      },
      dualStakePlugin: {
        appId: universe.dualStakePlugin.appId.toString(),
        address: universe.dualStakePlugin.client.appAddress.toString(),
      },
      gatePlugin: {
        appId: universe.gatePlugin.appId.toString(),
        address: universe.gatePlugin.client.appAddress.toString(),
      },
      marketplacePlugin: {
        appId: universe.marketplacePlugin.appId.toString(),
        address: universe.marketplacePlugin.client.appAddress.toString(),
      },
      nfdPlugin: {
        appId: universe.nfdPlugin.appId.toString(),
        address: universe.nfdPlugin.client.appAddress.toString(),
      },
      paySiloPlugin: {
        appId: universe.paySiloPlugin.appId.toString(),
        address: universe.paySiloPlugin.client.appAddress.toString(),
      },
      paySiloFactoryPlugin: {
        appId: universe.paySiloFactoryPlugin.appId.toString(),
        address: universe.paySiloFactoryPlugin.client.appAddress.toString(),
      },
      pollPlugin: {
        appId: universe.pollPlugin.appId.toString(),
        address: universe.pollPlugin.client.appAddress.toString(),
      },
      rafflePlugin: {
        appId: universe.rafflePlugin.appId.toString(),
        address: universe.rafflePlugin.client.appAddress.toString(),
      },
      rewardsPlugin: {
        appId: universe.rewardsPlugin.appId.toString(),
        address: universe.rewardsPlugin.client.appAddress.toString(),
      },
      socialPlugin: {
        appId: universe.socialPlugin.appId.toString(),
        address: universe.socialPlugin.client.appAddress.toString(),
      },
      stakingPlugin: {
        appId: universe.stakingPlugin.appId.toString(),
        address: universe.stakingPlugin.client.appAddress.toString(),
      },
      stakingPoolPlugin: {
        appId: universe.stakingPoolPlugin.appId.toString(),
        address: universe.stakingPoolPlugin.client.appAddress.toString(),
      },
      gate: {
        appId: universe.gate.appId.toString(),
        address: universe.gate.client.appAddress.toString(),
      },
      hyperSwap: {
        appId: universe.hyperSwap.appId.toString(),
        address: universe.hyperSwap.client.appAddress.toString(),
      },
      metaMerkles: {
        appId: universe.metaMerkles.appId.toString(),
        address: universe.metaMerkles.client.appAddress.toString(),
      },
      subgates: {
        akitaReferrerGate: {
          appId: universe.subgates.akitaReferrerGate.appId.toString(),
          address: universe.subgates.akitaReferrerGate.client.appAddress.toString(),
        },
        assetGate: {
          appId: universe.subgates.assetGate.appId.toString(),
          address: universe.subgates.assetGate.client.appAddress.toString(),
        },
        merkleAddressGate: {
          appId: universe.subgates.merkleAddressGate.appId.toString(),
          address: universe.subgates.merkleAddressGate.client.appAddress.toString(),
        },
        merkleAssetGate: {
          appId: universe.subgates.merkleAssetGate.appId.toString(),
          address: universe.subgates.merkleAssetGate.client.appAddress.toString(),
        },
        nfdGate: {
          appId: universe.subgates.nfdGate.appId.toString(),
          address: universe.subgates.nfdGate.client.appAddress.toString(),
        },
        nfdRootGate: {
          appId: universe.subgates.nfdRootGate.appId.toString(),
          address: universe.subgates.nfdRootGate.client.appAddress.toString(),
        },
        pollGate: {
          appId: universe.subgates.pollGate.appId.toString(),
          address: universe.subgates.pollGate.client.appAddress.toString(),
        },
        socialActivityGate: {
          appId: universe.subgates.socialActivityGate.appId.toString(),
          address: universe.subgates.socialActivityGate.client.appAddress.toString(),
        },
        socialFollowerCountGate: {
          appId: universe.subgates.socialFollowerCountGate.appId.toString(),
          address: universe.subgates.socialFollowerCountGate.client.appAddress.toString(),
        },
        socialFollowerIndexGate: {
          appId: universe.subgates.socialFollowerIndexGate.appId.toString(),
          address: universe.subgates.socialFollowerIndexGate.client.appAddress.toString(),
        },
        socialImpactGate: {
          appId: universe.subgates.socialImpactGate.appId.toString(),
          address: universe.subgates.socialImpactGate.client.appAddress.toString(),
        },
        socialModeratorGate: {
          appId: universe.subgates.socialModeratorGate.appId.toString(),
          address: universe.subgates.socialModeratorGate.client.appAddress.toString(),
        },
        stakingAmountGate: {
          appId: universe.subgates.stakingAmountGate.appId.toString(),
          address: universe.subgates.stakingAmountGate.client.appAddress.toString(),
        },
        stakingPowerGate: {
          appId: universe.subgates.stakingPowerGate.appId.toString(),
          address: universe.subgates.stakingPowerGate.client.appAddress.toString(),
        },
        subscriptionGate: {
          appId: universe.subgates.subscriptionGate.appId.toString(),
          address: universe.subgates.subscriptionGate.client.appAddress.toString(),
        },
        subscriptionStreakGate: {
          appId: universe.subgates.subscriptionStreakGate.appId.toString(),
          address: universe.subgates.subscriptionStreakGate.client.appAddress.toString(),
        },
      },
      // Test/Token Assets
      aktaAssetId: universe.aktaAssetId.toString(),
      bonesAssetId: universe.bonesAssetId.toString(),
      usdcAssetId: universe.usdcAssetId.toString(),
    },
  }

  // Add OtherAppList configuration if provided
  if (apps) {
    const hasNonZeroValue = Object.values(apps).some(
      (value) => value !== undefined && value > 0n
    )
    if (hasNonZeroValue) {
      (summary as any).otherAppList = {
        vrfBeacon: apps.vrfBeacon?.toString() || '0',
        nfdRegistry: apps.nfdRegistry?.toString() || '0',
        assetInbox: apps.assetInbox?.toString() || '0',
        akitaNfd: apps.akitaNfd?.toString() || '0',
        note: 'escrow and poll are set automatically from deployment',
      }
    }
  }

  // Add cost information if available
  if (typeof (summary as any).actualCost !== 'undefined') {
    (summary as any).costs = {
      actual: (summary as any).actualCost,
      estimated: '287-317 ALGO',
    }
    delete (summary as any).actualCost
  }

  return JSON.stringify(summary, null, 2)
}

// Main deployment function
async function deploy() {
  const options = parseArgs()
  console.log(`\n🚀 Starting Akita Universe deployment to ${options.network}...\n`)

  try {
    // Create Algorand client
    const algorand = createAlgorandClient(options.network)

    // Create account and fixture
    let account: algosdk.Account
    let fixture: AlgorandFixture
    let sender: string
    let signer: algosdk.TransactionSigner

    if (options.network === 'localnet') {
      // For localnet, use the fixture's test account
      fixture = algorandFixture()
      await fixture.newScope()
      account = fixture.context.testAccount as algosdk.Account
      sender = account.addr.toString()
      signer = (account as any).signer
    } else {
      if (!options.mnemonic) {
        throw new Error('Mnemonic is required for non-localnet networks')
      }
      account = createAccountFromMnemonic(options.mnemonic)
      console.log(`📝 Using account: ${account.addr.toString()}\n`)

      // For non-localnet, we need to set up the network environment
      // Set ALGORAND_NETWORK environment variable before running
      if (process.env.ALGORAND_NETWORK !== options.network) {
        console.log(`⚠️  Warning: ALGORAND_NETWORK env var is set to '${process.env.ALGORAND_NETWORK || 'not set'}'`)
        console.log(`   Expected: '${options.network}'`)
        console.log(`   The client will use environment configuration.\n`)
      }

      // Create fixture for non-localnet
      const result = await createFixtureForNetwork(
        options.network,
        algorand,
        account
      )
      fixture = result.fixture
      sender = result.sender
      signer = result.signer
    }

    // Track initial balance for cost calculation
    let initialBalance = 0n
    if (options.network !== 'localnet') {
      const accountInfo = await algorand.client.algod.accountInformation(account.addr.toString()).do()
      initialBalance = BigInt(accountInfo.amount)
      // Estimated actual costs: ~287-317 ALGO (see DEPLOYMENT_COSTS.md for breakdown)
      // We recommend 500-600 ALGO minimum for safety buffer
      const minBalance = 500_000_000n // 500 ALGO recommended minimum
      const absoluteMinimum = 350_000_000n // 350 ALGO absolute minimum

      if (initialBalance < absoluteMinimum) {
        console.log(`❌ Error: Account balance is ${initialBalance / 1_000_000n} ALGO.`)
        console.log(`   Minimum required: 350 ALGO`)
        console.log(`   Recommended: 500 ALGO`)
        console.log(`   Please fund your account before continuing.\n`)
        console.log(`   See scripts/DEPLOYMENT_COSTS.md for detailed cost breakdown.\n`)
        process.exit(1)
      } else if (initialBalance < minBalance) {
        console.log(`⚠️  Warning: Account balance is ${initialBalance / 1_000_000n} ALGO.`)
        console.log(`   Recommended: 500 ALGO for safe deployment`)
        console.log(`   Estimated actual cost: ~287-317 ALGO`)
        console.log(`   Proceeding with available balance...\n`)
        console.log(`   Note: For testnet/mainnet, ensureFunded calls will skip if no dispenser is available.`)
        console.log(`   Make sure your account has sufficient funds for all transactions.\n`)
        console.log(`   See scripts/DEPLOYMENT_COSTS.md for detailed cost breakdown.\n`)
      } else {
        console.log(`✅ Account balance: ${initialBalance / 1_000_000n} ALGO`)
        console.log(`   Estimated actual cost: ~287-317 ALGO`)
        console.log(`   See scripts/DEPLOYMENT_COSTS.md for detailed breakdown\n`)
      }
    } else {
      // For localnet, get initial balance for tracking
      const accountInfo = await algorand.client.algod.accountInformation(account.addr.toString()).do()
      initialBalance = BigInt(accountInfo.amount)
      console.log(`📊 Starting balance: ${initialBalance / 1_000_000n} ALGO\n`)
    }

    // Deploy the universe
    console.log('📦 Deploying contracts...\n')

    // Log external apps configuration
    const networkDefaults = getNetworkOtherAppListDefaults(options.network)
    const hasExternalApps = options.apps && Object.values(options.apps).some(
      (value) => value !== undefined && value > 0n
    )

    if (hasExternalApps) {
      console.log('📋 External Apps Configuration:')
      if (options.apps?.vrfBeacon && options.apps.vrfBeacon > 0n) {
        console.log(`   VRF Beacon: ${options.apps.vrfBeacon}`)
      }
      if (options.apps?.nfdRegistry && options.apps.nfdRegistry > 0n) {
        console.log(`   NFD Registry: ${options.apps.nfdRegistry}`)
      }
      if (options.apps?.assetInbox && options.apps.assetInbox > 0n) {
        console.log(`   Asset Inbox: ${options.apps.assetInbox}`)
      }
      if (options.apps?.akitaNfd && options.apps.akitaNfd > 0n) {
        console.log(`   Akita NFD: ${options.apps.akitaNfd}`)
      }
      console.log('   (escrow and poll will be set automatically from deployment)\n')
    } else {
      console.log('📋 External Apps: Using network defaults (all external apps set to 0)\n')
    }

    const universe = await buildAkitaUniverse({
      fixture,
      sender,
      signer,
      apps: options.apps,
      network: options.network,
    })

    // For localnet, transfer AKTA to the KMD dispenser so mock-init scripts can fund test wallets
    if (options.network === 'localnet' && universe.aktaAssetId > 0n) {
      console.log('\n💰 Transferring AKTA to KMD dispenser for testing...')
      try {
        // Get the KMD dispenser account
        const dispenser = await algorand.account.kmd.getLocalNetDispenserAccount()
        const dispenserAddr = dispenser.addr.toString()
        
        // First, opt the dispenser into AKTA
        await algorand.send.assetOptIn({
          sender: dispenserAddr,
          signer: dispenser.signer,
          assetId: universe.aktaAssetId,
        })
        console.log(`   Dispenser opted into AKTA ✓`)
        
        // Transfer 500M AKTA to dispenser for testing (AKTA has 6 decimals)
        const transferAmount = 500_000_000_000_000n // 500M AKTA with 6 decimals
        await algorand.send.assetTransfer({
          sender,
          signer,
          receiver: dispenserAddr,
          assetId: universe.aktaAssetId,
          amount: transferAmount,
        })
        console.log(`   Transferred ${transferAmount} AKTA to dispenser ✓`)
        console.log(`   Dispenser: ${dispenserAddr}`)
      } catch (e) {
        console.log(`   ⚠️  Failed to transfer AKTA to dispenser: ${e instanceof Error ? e.message : e}`)
        console.log(`   (This is okay if you don't need AKTA for testing)`)
      }
    }

    // Calculate actual costs (for testnet/mainnet)
    let actualCost = 0n
    if (options.network !== 'localnet') {
      const finalAccountInfo = await algorand.client.algod.accountInformation(account.addr.toString()).do()
      const finalBalance = BigInt(finalAccountInfo.amount)
      actualCost = initialBalance - finalBalance
      console.log(`\n💰 Cost Summary:`)
      console.log(`   Initial balance: ${initialBalance / 1_000_000n} ALGO`)
      console.log(`   Final balance: ${finalBalance / 1_000_000n} ALGO`)
      console.log(`   Actual cost: ${actualCost / 1_000_000n} ALGO`)
      console.log(`   Estimated cost: ~287-317 ALGO`)
      if (actualCost > 0n) {
        const diff = actualCost - 300_000_000n // Compare to ~300 ALGO midpoint
        if (diff > 50_000_000n) {
          console.log(`   ⚠️  Cost is ${diff / 1_000_000n} ALGO higher than estimated`)
        } else if (diff < -50_000_000n) {
          console.log(`   ✅ Cost is ${(-diff) / 1_000_000n} ALGO lower than estimated`)
        } else {
          console.log(`   ✅ Cost is within estimated range`)
        }
      }
      console.log()
    }

    // Update SDK networks.ts with deployed app IDs
    await updateNetworksFile(universe, options.network, options.apps)

    // Generate and display summary
    console.log('\n' + '='.repeat(80))
    console.log('✅ DEPLOYMENT COMPLETE!')
    console.log('='.repeat(80) + '\n')

    const summaryObj = JSON.parse(await formatSummary(universe, options.network, options.apps))

    // Add cost information to summary
    if (actualCost > 0n) {
      summaryObj.costs = {
        actual: `${actualCost / 1_000_000n} ALGO`,
        estimated: '287-317 ALGO',
        initialBalance: `${initialBalance / 1_000_000n} ALGO`,
      }
    }

    const summary = JSON.stringify(summaryObj, null, 2)
    console.log(summary)

    // Also save to file
    const summaryPath = `deployment-summary-${options.network}-${Date.now()}.json`
    const fs = await import('fs/promises')
    await fs.writeFile(summaryPath, summary, 'utf-8')
    console.log(`\n📄 Summary saved to: ${summaryPath}`)

    // Generate and save environment file
    const envContent = generateEnvFile(universe, options.network, options.apps)
    const envPath = `.env.${options.network}`
    await fs.writeFile(envPath, envContent, 'utf-8')
    console.log(`📄 Environment file saved to: ${envPath}\n`)

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
