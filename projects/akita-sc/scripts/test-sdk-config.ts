#!/usr/bin/env npx ts-node
/**
 * Simple test script for SDK config module - environment-based app ID resolution
 * 
 * Run with: npx ts-node scripts/test-sdk-config.ts
 */

import {
    ENV_VAR_NAMES,
    getAppIdFromEnv,
    getConfigFromEnv,
    getEnvVar,
    getNetworkFromEnv,
    resolveAppId,
} from 'akita-sdk';

// Store original env
const originalEnv = { ...process.env };

function assert(condition: boolean, message: string) {
    if (!condition) {
        throw new Error(`FAILED: ${message}`);
    }
    console.log(`  ✓ ${message}`);
}

function assertEqual(actual: any, expected: any, message: string) {
    if (actual !== expected) {
        throw new Error(`FAILED: ${message}\n  Expected: ${expected}\n  Actual: ${actual}`);
    }
    console.log(`  ✓ ${message}`);
}

function resetEnv() {
    // Clear relevant env vars
    Object.keys(ENV_VAR_NAMES).forEach(key => {
        delete process.env[(ENV_VAR_NAMES as any)[key]];
    });
}

function restoreEnv() {
    process.env = { ...originalEnv };
}

async function runTests() {
    console.log('\n🧪 Testing SDK Config Module\n');
    let passed = 0;
    let failed = 0;

    try {
        // Test 1: getNetworkFromEnv
        console.log('📋 Testing getNetworkFromEnv:');
        resetEnv();

        delete process.env.ALGORAND_NETWORK;
        assertEqual(getNetworkFromEnv(), 'localnet', 'returns "localnet" by default');
        passed++;

        process.env.ALGORAND_NETWORK = 'testnet';
        assertEqual(getNetworkFromEnv(), 'testnet', 'returns "testnet" when set');
        passed++;

        process.env.ALGORAND_NETWORK = 'mainnet';
        assertEqual(getNetworkFromEnv(), 'mainnet', 'returns "mainnet" when set');
        passed++;

        // Test 2: getEnvVar
        console.log('\n📋 Testing getEnvVar:');
        resetEnv();

        process.env.TEST_VAR = 'test_value';
        assertEqual(getEnvVar('TEST_VAR'), 'test_value', 'returns value when set');
        passed++;

        delete process.env.NON_EXISTENT;
        assertEqual(getEnvVar('NON_EXISTENT'), undefined, 'returns undefined when not set');
        passed++;

        // Test 3: getAppIdFromEnv
        console.log('\n📋 Testing getAppIdFromEnv:');
        resetEnv();

        process.env.DAO_APP_ID = '12345';
        assertEqual(getAppIdFromEnv('DAO_APP_ID'), 12345n, 'returns bigint for valid value');
        passed++;

        delete process.env.DAO_APP_ID;
        assertEqual(getAppIdFromEnv('DAO_APP_ID'), undefined, 'returns undefined when not set');
        passed++;

        process.env.DAO_APP_ID = '';
        assertEqual(getAppIdFromEnv('DAO_APP_ID'), undefined, 'returns undefined for empty string');
        passed++;

        process.env.DAO_APP_ID = '0';
        assertEqual(getAppIdFromEnv('DAO_APP_ID'), undefined, 'returns undefined for zero');
        passed++;

        process.env.DAO_APP_ID = 'not_a_number';
        assertEqual(getAppIdFromEnv('DAO_APP_ID'), undefined, 'returns undefined for invalid value');
        passed++;

        // Test 4: resolveAppId
        console.log('\n📋 Testing resolveAppId:');
        resetEnv();

        process.env.DAO_APP_ID = '99999';
        assertEqual(resolveAppId(12345n, 'DAO_APP_ID', 'TestSDK'), 12345n, 'prefers provided appId');
        passed++;

        assertEqual(resolveAppId(undefined, 'DAO_APP_ID', 'TestSDK'), 99999n, 'falls back to env when undefined');
        passed++;

        assertEqual(resolveAppId(0n, 'DAO_APP_ID', 'TestSDK'), 99999n, 'falls back to env when 0n');
        passed++;

        delete process.env.DAO_APP_ID;
        try {
            resolveAppId(undefined, 'DAO_APP_ID', 'TestSDK');
            throw new Error('Should have thrown');
        } catch (e: any) {
            assert(e.message.includes('No app ID provided'), 'throws when neither provided nor in env');
            passed++;
        }

        // Test 5: getConfigFromEnv
        console.log('\n📋 Testing getConfigFromEnv:');
        resetEnv();

        process.env.ALGORAND_NETWORK = 'testnet';
        process.env.DAO_APP_ID = '100';
        process.env.WALLET_APP_ID = '101';
        process.env.STAKING_APP_ID = '102';

        const config = getConfigFromEnv();
        assertEqual(config.network, 'testnet', 'reads network from env');
        passed++;
        assertEqual(config.daoAppId, 100n, 'reads daoAppId from env');
        passed++;
        assertEqual(config.walletAppId, 101n, 'reads walletAppId from env');
        passed++;
        assertEqual(config.stakingAppId, 102n, 'reads stakingAppId from env');
        passed++;

        // Test 6: ENV_VAR_NAMES constants
        console.log('\n📋 Testing ENV_VAR_NAMES:');
        assertEqual(ENV_VAR_NAMES.DAO_APP_ID, 'DAO_APP_ID', 'DAO_APP_ID is correct');
        passed++;
        assertEqual(ENV_VAR_NAMES.WALLET_APP_ID, 'WALLET_APP_ID', 'WALLET_APP_ID is correct');
        passed++;
        assertEqual(ENV_VAR_NAMES.SOCIAL_APP_ID, 'SOCIAL_APP_ID', 'SOCIAL_APP_ID is correct');
        passed++;
        assertEqual(ENV_VAR_NAMES.BONES_ASSET_ID, 'BONES_ASSET_ID', 'BONES_ASSET_ID is correct');
        passed++;

        console.log('\n' + '='.repeat(50));
        console.log(`✅ All tests passed! (${passed}/${passed})`);
        console.log('='.repeat(50) + '\n');

    } catch (e: any) {
        failed++;
        console.error('\n' + '='.repeat(50));
        console.error(`❌ Test failed: ${e.message}`);
        console.error('='.repeat(50) + '\n');
        process.exit(1);
    } finally {
        restoreEnv();
    }
}

runTests();

