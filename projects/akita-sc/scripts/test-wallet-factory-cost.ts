#!/usr/bin/env npx ts-node
/**
 * Test script to call various cost methods on localnet
 * 
 * Run with: npx ts-node scripts/test-wallet-factory-cost.ts
 */

import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { AbstractedAccountFactoryClient } from '../smart_contracts/artifacts/arc58/account/AbstractedAccountFactoryClient'
import { AbstractedAccountClient } from '../smart_contracts/artifacts/arc58/account/AbstractedAccountClient'
import { EscrowFactoryClient } from '../smart_contracts/artifacts/escrow/EscrowFactoryClient'
import { LOCALNET_APP_IDS } from '../../akita-sdk/src/networks'

function formatMicroAlgos(microAlgos: bigint): string {
  return `${microAlgos} microAlgos (${Number(microAlgos) / 1_000_000} ALGO)`
}

async function main() {
  console.log('\n🚀 Testing cost methods on localnet\n')

  // Create Algorand client for localnet
  const algorand = AlgorandClient.fromEnvironment()
  
  // Get the localnet dispenser account (has funds)
  const dispenser = await algorand.account.localNetDispenser()
  
  // ============================================================================
  // WALLET FACTORY COST
  // ============================================================================
  console.log('=' .repeat(60))
  console.log('📦 WALLET FACTORY COST')
  console.log('=' .repeat(60))
  
  const walletFactoryAppId = LOCALNET_APP_IDS.walletFactory
  console.log(`   App ID: ${walletFactoryAppId}`)

  const walletFactoryClient = algorand.client.getTypedAppClientById(AbstractedAccountFactoryClient, {
    appId: walletFactoryAppId,
    defaultSender: dispenser.addr,
  })

  console.log(`   Address: ${walletFactoryClient.appAddress}`)
  
  const walletFactoryCost = await walletFactoryClient.cost()
  console.log(`   ✅ New Wallet Cost: ${formatMicroAlgos(walletFactoryCost)}`)

  // ============================================================================
  // ESCROW FACTORY COST
  // ============================================================================
  console.log('\n' + '=' .repeat(60))
  console.log('📦 ESCROW FACTORY COST')
  console.log('=' .repeat(60))
  
  const escrowFactoryAppId = LOCALNET_APP_IDS.escrowFactory
  console.log(`   App ID: ${escrowFactoryAppId}`)

  const escrowFactoryClient = algorand.client.getTypedAppClientById(EscrowFactoryClient, {
    appId: escrowFactoryAppId,
    defaultSender: dispenser.addr,
  })

  console.log(`   Address: ${escrowFactoryClient.appAddress}`)
  
  const escrowFactoryCost = await escrowFactoryClient.cost()
  console.log(`   ✅ New Escrow Cost: ${formatMicroAlgos(escrowFactoryCost)}`)

  // ============================================================================
  // WALLET MBR DATA (Plugin Add Costs, etc.)
  // ============================================================================
  console.log('\n' + '=' .repeat(60))
  console.log('📦 WALLET MBR DATA (Plugin/Escrow Costs)')
  console.log('=' .repeat(60))
  
  const walletAppId = LOCALNET_APP_IDS.wallet
  console.log(`   Wallet App ID: ${walletAppId}`)

  const walletClient = algorand.client.getTypedAppClientById(AbstractedAccountClient, {
    appId: walletAppId,
    defaultSender: dispenser.addr,
  })

  console.log(`   Wallet Address: ${walletClient.appAddress}`)
  
  // Call mbr with default params to get base costs
  const mbrData = await walletClient.mbr({
    args: {
      escrow: '',       // No specific escrow
      methodCount: 0n,  // No method restrictions
      plugin: '',       // No specific plugin
      groups: 0n,       // No execution groups
    }
  })

  console.log(`\n   MBR Breakdown:`)
  console.log(`   ├─ Plugin Add Cost:       ${formatMicroAlgos(mbrData.plugins)}`)
  console.log(`   ├─ Named Plugin Cost:     ${formatMicroAlgos(mbrData.namedPlugins)}`)
  console.log(`   ├─ Escrow Registration:   ${formatMicroAlgos(mbrData.escrows)}`)
  console.log(`   ├─ Allowances:            ${formatMicroAlgos(mbrData.allowances)}`)
  console.log(`   ├─ Executions:            ${formatMicroAlgos(mbrData.executions)}`)
  console.log(`   ├─ Domain Keys:           ${formatMicroAlgos(mbrData.domainKeys)}`)
  console.log(`   ├─ Escrow Exists:         ${mbrData.escrowExists}`)
  console.log(`   └─ New Escrow Mint Cost:  ${formatMicroAlgos(mbrData.newEscrowMintCost)}`)

  // ============================================================================
  // SUMMARY
  // ============================================================================
  console.log('\n' + '=' .repeat(60))
  console.log('📊 SUMMARY')
  console.log('=' .repeat(60))
  console.log(`   New Wallet:               ${formatMicroAlgos(walletFactoryCost)}`)
  console.log(`   New Escrow:               ${formatMicroAlgos(escrowFactoryCost)}`)
  console.log(`   Add Plugin (to wallet):   ${formatMicroAlgos(mbrData.plugins)}`)
  console.log(`   New Escrow (via wallet):  ${formatMicroAlgos(mbrData.newEscrowMintCost)}`)
  console.log('')
}

main().catch((error) => {
  console.error('\n❌ Error:', error)
  process.exit(1)
})

