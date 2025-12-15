#!/usr/bin/env npx ts-node
/**
 * Integration test for SDK with environment-based app ID resolution
 * 
 * This test:
 * 1. Deploys to localnet using buildAkitaUniverse
 * 2. Sets environment variables from the deployment
 * 3. Creates SDK instances WITHOUT providing appId
 * 4. Verifies SDKs resolved the correct appId from environment
 * 
 * Run with: npx ts-node scripts/test-sdk-env-integration.ts
 */

import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { buildAkitaUniverse } from '../tests/fixtures/dao';
import { 
  AkitaDaoSDK, 
  StakingSDK, 
  SubscriptionsSDK,
  MarketplaceSDK,
  ENV_VAR_NAMES,
} from 'akita-sdk';

async function runTest() {
  console.log('\n🧪 SDK Environment Integration Test\n');
  console.log('='.repeat(50));

  // Store original env
  const originalEnv = { ...process.env };

  try {
    // Step 1: Setup localnet and deploy
    console.log('\n📦 Setting up localnet fixture...');
    const localnet = algorandFixture();
    await localnet.newScope();
    const { algorand, testAccount } = localnet.context;
    
    console.log('🚀 Deploying Akita Universe to localnet...');
    console.log('   (This may take a moment)\n');
    
    const universe = await buildAkitaUniverse({
      fixture: localnet,
      sender: testAccount.addr.toString(),
      signer: testAccount.signer,
    });
    
    console.log('✅ Deployment complete!\n');

    // Step 2: Set environment variables from deployment
    console.log('📝 Setting environment variables from deployment:');
    
    process.env[ENV_VAR_NAMES.DAO_APP_ID] = universe.dao.appId.toString();
    console.log(`   ${ENV_VAR_NAMES.DAO_APP_ID}=${universe.dao.appId}`);
    
    process.env[ENV_VAR_NAMES.WALLET_APP_ID] = universe.dao.wallet.appId.toString();
    console.log(`   ${ENV_VAR_NAMES.WALLET_APP_ID}=${universe.dao.wallet.appId}`);
    
    process.env[ENV_VAR_NAMES.STAKING_APP_ID] = universe.staking.appId.toString();
    console.log(`   ${ENV_VAR_NAMES.STAKING_APP_ID}=${universe.staking.appId}`);
    
    process.env[ENV_VAR_NAMES.SUBSCRIPTIONS_APP_ID] = universe.subscriptions.appId.toString();
    console.log(`   ${ENV_VAR_NAMES.SUBSCRIPTIONS_APP_ID}=${universe.subscriptions.appId}`);
    
    process.env[ENV_VAR_NAMES.MARKETPLACE_APP_ID] = universe.marketplace.appId.toString();
    console.log(`   ${ENV_VAR_NAMES.MARKETPLACE_APP_ID}=${universe.marketplace.appId}`);

    // Step 3: Create SDK instances WITHOUT providing appId
    console.log('\n🔧 Creating SDK instances WITHOUT providing appId...\n');
    
    // Test AkitaDaoSDK
    const daoSDK = new AkitaDaoSDK({
      algorand,
      factoryParams: {
        defaultSender: testAccount.addr,
        defaultSigner: testAccount.signer,
      }, // Note: NO appId provided!
    });
    
    if (daoSDK.appId === universe.dao.appId) {
      console.log(`   ✓ AkitaDaoSDK resolved appId from env: ${daoSDK.appId}`);
    } else {
      throw new Error(`AkitaDaoSDK appId mismatch! Expected ${universe.dao.appId}, got ${daoSDK.appId}`);
    }

    // Test StakingSDK
    const stakingSDK = new StakingSDK({
      algorand,
      factoryParams: {},
    });
    
    if (stakingSDK.appId === universe.staking.appId) {
      console.log(`   ✓ StakingSDK resolved appId from env: ${stakingSDK.appId}`);
    } else {
      throw new Error(`StakingSDK appId mismatch! Expected ${universe.staking.appId}, got ${stakingSDK.appId}`);
    }

    // Test SubscriptionsSDK
    const subscriptionsSDK = new SubscriptionsSDK({
      algorand,
      factoryParams: {},
    });
    
    if (subscriptionsSDK.appId === universe.subscriptions.appId) {
      console.log(`   ✓ SubscriptionsSDK resolved appId from env: ${subscriptionsSDK.appId}`);
    } else {
      throw new Error(`SubscriptionsSDK appId mismatch! Expected ${universe.subscriptions.appId}, got ${subscriptionsSDK.appId}`);
    }

    // Test MarketplaceSDK
    const marketplaceSDK = new MarketplaceSDK({
      algorand,
      factoryParams: {},
    });
    
    if (marketplaceSDK.appId === universe.marketplace.appId) {
      console.log(`   ✓ MarketplaceSDK resolved appId from env: ${marketplaceSDK.appId}`);
    } else {
      throw new Error(`MarketplaceSDK appId mismatch! Expected ${universe.marketplace.appId}, got ${marketplaceSDK.appId}`);
    }

    // Step 4: Verify SDKs can actually make calls
    console.log('\n📡 Verifying SDKs can make actual contract calls...\n');
    
    // Test that the DAO SDK can read state
    const daoState = await daoSDK.client.state.global.version();
    console.log(`   ✓ AkitaDaoSDK read DAO version: "${daoState}"`);
    
    // Test that the Subscriptions SDK can read service cost
    const serviceCost = await subscriptionsSDK.newServiceCost({
      sender: testAccount.addr,
      signer: testAccount.signer,
    });
    console.log(`   ✓ SubscriptionsSDK read service cost: ${serviceCost}`);

    console.log('\n' + '='.repeat(50));
    console.log('✅ All SDK environment integration tests passed!');
    console.log('='.repeat(50) + '\n');
    
    console.log('📋 Summary:');
    console.log('   - Environment variables correctly resolved to app IDs');
    console.log('   - SDKs can be instantiated without explicit appId');
    console.log('   - SDKs correctly communicate with deployed contracts');
    console.log('');
    
  } catch (e: any) {
    console.error('\n' + '='.repeat(50));
    console.error(`❌ Test failed: ${e.message}`);
    console.error('='.repeat(50) + '\n');
    process.exit(1);
  } finally {
    // Restore original env
    process.env = { ...originalEnv };
  }
}

runTest();

