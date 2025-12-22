/**
 * Configuration module for Akita SDK
 * Handles network detection and environment-based app ID resolution
 */
import { getAppIdFromNetwork } from "./networks";
export { getNetworkAppIds, LOCALNET_APP_IDS, TESTNET_APP_IDS, MAINNET_APP_IDS, NETWORK_APP_IDS } from "./networks";
/**
 * Environment variable names for each SDK/contract
 */
export const ENV_VAR_NAMES = {
    // Network
    NETWORK: 'ALGORAND_NETWORK',
    // Core Contracts
    DAO_APP_ID: 'DAO_APP_ID',
    WALLET_APP_ID: 'WALLET_APP_ID',
    ESCROW_FACTORY_APP_ID: 'ESCROW_FACTORY_APP_ID',
    WALLET_FACTORY_APP_ID: 'WALLET_FACTORY_APP_ID',
    SUBSCRIPTIONS_APP_ID: 'SUBSCRIPTIONS_APP_ID',
    STAKING_POOL_FACTORY_APP_ID: 'STAKING_POOL_FACTORY_APP_ID',
    STAKING_APP_ID: 'STAKING_APP_ID',
    REWARDS_APP_ID: 'REWARDS_APP_ID',
    // Social System
    SOCIAL_APP_ID: 'SOCIAL_APP_ID',
    SOCIAL_GRAPH_APP_ID: 'SOCIAL_GRAPH_APP_ID',
    SOCIAL_IMPACT_APP_ID: 'SOCIAL_IMPACT_APP_ID',
    SOCIAL_MODERATION_APP_ID: 'SOCIAL_MODERATION_APP_ID',
    // Factories
    AUCTION_FACTORY_APP_ID: 'AUCTION_FACTORY_APP_ID',
    MARKETPLACE_APP_ID: 'MARKETPLACE_APP_ID',
    RAFFLE_FACTORY_APP_ID: 'RAFFLE_FACTORY_APP_ID',
    POLL_FACTORY_APP_ID: 'POLL_FACTORY_APP_ID',
    PRIZE_BOX_FACTORY_APP_ID: 'PRIZE_BOX_FACTORY_APP_ID',
    // Plugins
    REVENUE_MANAGER_PLUGIN_APP_ID: 'REVENUE_MANAGER_PLUGIN_APP_ID',
    UPDATE_PLUGIN_APP_ID: 'UPDATE_PLUGIN_APP_ID',
    OPTIN_PLUGIN_APP_ID: 'OPTIN_PLUGIN_APP_ID',
    ASA_MINT_PLUGIN_APP_ID: 'ASA_MINT_PLUGIN_APP_ID',
    PAY_PLUGIN_APP_ID: 'PAY_PLUGIN_APP_ID',
    HYPER_SWAP_PLUGIN_APP_ID: 'HYPER_SWAP_PLUGIN_APP_ID',
    SUBSCRIPTIONS_PLUGIN_APP_ID: 'SUBSCRIPTIONS_PLUGIN_APP_ID',
    AUCTION_PLUGIN_APP_ID: 'AUCTION_PLUGIN_APP_ID',
    DAO_PLUGIN_APP_ID: 'DAO_PLUGIN_APP_ID',
    DUAL_STAKE_PLUGIN_APP_ID: 'DUAL_STAKE_PLUGIN_APP_ID',
    GATE_PLUGIN_APP_ID: 'GATE_PLUGIN_APP_ID',
    MARKETPLACE_PLUGIN_APP_ID: 'MARKETPLACE_PLUGIN_APP_ID',
    NFD_PLUGIN_APP_ID: 'NFD_PLUGIN_APP_ID',
    PAY_SILO_PLUGIN_APP_ID: 'PAY_SILO_PLUGIN_APP_ID',
    PAY_SILO_FACTORY_PLUGIN_APP_ID: 'PAY_SILO_FACTORY_PLUGIN_APP_ID',
    POLL_PLUGIN_APP_ID: 'POLL_PLUGIN_APP_ID',
    RAFFLE_PLUGIN_APP_ID: 'RAFFLE_PLUGIN_APP_ID',
    REWARDS_PLUGIN_APP_ID: 'REWARDS_PLUGIN_APP_ID',
    SOCIAL_PLUGIN_APP_ID: 'SOCIAL_PLUGIN_APP_ID',
    STAKING_PLUGIN_APP_ID: 'STAKING_PLUGIN_APP_ID',
    STAKING_POOL_PLUGIN_APP_ID: 'STAKING_POOL_PLUGIN_APP_ID',
    // Gates & Other
    GATE_APP_ID: 'GATE_APP_ID',
    HYPER_SWAP_APP_ID: 'HYPER_SWAP_APP_ID',
    META_MERKLES_APP_ID: 'META_MERKLES_APP_ID',
    // Subgates
    AKITA_REFERRER_GATE_APP_ID: 'AKITA_REFERRER_GATE_APP_ID',
    ASSET_GATE_APP_ID: 'ASSET_GATE_APP_ID',
    MERKLE_ADDRESS_GATE_APP_ID: 'MERKLE_ADDRESS_GATE_APP_ID',
    MERKLE_ASSET_GATE_APP_ID: 'MERKLE_ASSET_GATE_APP_ID',
    NFD_GATE_APP_ID: 'NFD_GATE_APP_ID',
    NFD_ROOT_GATE_APP_ID: 'NFD_ROOT_GATE_APP_ID',
    POLL_GATE_APP_ID: 'POLL_GATE_APP_ID',
    SOCIAL_ACTIVITY_GATE_APP_ID: 'SOCIAL_ACTIVITY_GATE_APP_ID',
    SOCIAL_FOLLOWER_COUNT_GATE_APP_ID: 'SOCIAL_FOLLOWER_COUNT_GATE_APP_ID',
    SOCIAL_FOLLOWER_INDEX_GATE_APP_ID: 'SOCIAL_FOLLOWER_INDEX_GATE_APP_ID',
    SOCIAL_IMPACT_GATE_APP_ID: 'SOCIAL_IMPACT_GATE_APP_ID',
    SOCIAL_MODERATOR_GATE_APP_ID: 'SOCIAL_MODERATOR_GATE_APP_ID',
    STAKING_AMOUNT_GATE_APP_ID: 'STAKING_AMOUNT_GATE_APP_ID',
    STAKING_POWER_GATE_APP_ID: 'STAKING_POWER_GATE_APP_ID',
    SUBSCRIPTION_GATE_APP_ID: 'SUBSCRIPTION_GATE_APP_ID',
    SUBSCRIPTION_STREAK_GATE_APP_ID: 'SUBSCRIPTION_STREAK_GATE_APP_ID',
    // Assets
    AKTA_ASSET_ID: 'AKTA_ASSET_ID',
    BONES_ASSET_ID: 'BONES_ASSET_ID',
    // External Apps
    VRF_BEACON_APP_ID: 'VRF_BEACON_APP_ID',
    NFD_REGISTRY_APP_ID: 'NFD_REGISTRY_APP_ID',
    ASSET_INBOX_APP_ID: 'ASSET_INBOX_APP_ID',
    AKITA_NFD_APP_ID: 'AKITA_NFD_APP_ID',
};
// ============================================================================
// Environment Variable Helpers
// ============================================================================
/**
 * Gets the current network from environment variables
 * Throws an error if no valid network is configured
 *
 * Checks multiple env var names for compatibility:
 * - ALGORAND_NETWORK (SDK standard)
 * - ALGOD_NETWORK (common alternative)
 * - NEXT_PUBLIC_* variants (for Next.js client-side)
 */
export function getNetworkFromEnv() {
    // Check multiple env var names for compatibility
    const envVarNames = [
        ENV_VAR_NAMES.NETWORK, // ALGORAND_NETWORK
        'ALGOD_NETWORK',
        'NEXT_PUBLIC_ALGORAND_NETWORK',
        'NEXT_PUBLIC_ALGOD_NETWORK',
    ];
    for (const name of envVarNames) {
        const network = getEnvVar(name);
        if (network === 'testnet' || network === 'mainnet' || network === 'localnet') {
            return network;
        }
    }
    throw new Error(`No valid network configured. Set one of these environment variables to 'localnet', 'testnet', or 'mainnet': ${envVarNames.join(', ')}`);
}
/**
 * Gets an environment variable value
 * Works in both Node.js and browser environments
 */
export function getEnvVar(name) {
    // Node.js environment
    if (typeof process !== 'undefined' && process.env) {
        return process.env[name];
    }
    // Browser environment - check for window.__AKITA_ENV__
    if (typeof window !== 'undefined' && window.__AKITA_ENV__) {
        return window.__AKITA_ENV__[name];
    }
    return undefined;
}
/**
 * Gets an app ID from environment variables
 * Returns undefined if the env var is not set or is not a valid bigint
 */
export function getAppIdFromEnv(envVarName) {
    const value = getEnvVar(envVarName);
    if (!value)
        return undefined;
    try {
        const parsed = BigInt(value);
        return parsed > 0n ? parsed : undefined;
    }
    catch {
        return undefined;
    }
}
/**
 * Gets the full configuration from environment variables
 */
export function getConfigFromEnv() {
    return {
        network: getNetworkFromEnv(),
        // Core Contracts
        daoAppId: getAppIdFromEnv(ENV_VAR_NAMES.DAO_APP_ID),
        walletAppId: getAppIdFromEnv(ENV_VAR_NAMES.WALLET_APP_ID),
        escrowFactoryAppId: getAppIdFromEnv(ENV_VAR_NAMES.ESCROW_FACTORY_APP_ID),
        walletFactoryAppId: getAppIdFromEnv(ENV_VAR_NAMES.WALLET_FACTORY_APP_ID),
        subscriptionsAppId: getAppIdFromEnv(ENV_VAR_NAMES.SUBSCRIPTIONS_APP_ID),
        stakingPoolFactoryAppId: getAppIdFromEnv(ENV_VAR_NAMES.STAKING_POOL_FACTORY_APP_ID),
        stakingAppId: getAppIdFromEnv(ENV_VAR_NAMES.STAKING_APP_ID),
        rewardsAppId: getAppIdFromEnv(ENV_VAR_NAMES.REWARDS_APP_ID),
        // Social System
        socialAppId: getAppIdFromEnv(ENV_VAR_NAMES.SOCIAL_APP_ID),
        socialGraphAppId: getAppIdFromEnv(ENV_VAR_NAMES.SOCIAL_GRAPH_APP_ID),
        socialImpactAppId: getAppIdFromEnv(ENV_VAR_NAMES.SOCIAL_IMPACT_APP_ID),
        socialModerationAppId: getAppIdFromEnv(ENV_VAR_NAMES.SOCIAL_MODERATION_APP_ID),
        // Factories
        auctionFactoryAppId: getAppIdFromEnv(ENV_VAR_NAMES.AUCTION_FACTORY_APP_ID),
        marketplaceAppId: getAppIdFromEnv(ENV_VAR_NAMES.MARKETPLACE_APP_ID),
        raffleFactoryAppId: getAppIdFromEnv(ENV_VAR_NAMES.RAFFLE_FACTORY_APP_ID),
        pollFactoryAppId: getAppIdFromEnv(ENV_VAR_NAMES.POLL_FACTORY_APP_ID),
        prizeBoxFactoryAppId: getAppIdFromEnv(ENV_VAR_NAMES.PRIZE_BOX_FACTORY_APP_ID),
        // Gates & Other
        gateAppId: getAppIdFromEnv(ENV_VAR_NAMES.GATE_APP_ID),
        hyperSwapAppId: getAppIdFromEnv(ENV_VAR_NAMES.HYPER_SWAP_APP_ID),
        metaMerklesAppId: getAppIdFromEnv(ENV_VAR_NAMES.META_MERKLES_APP_ID),
        // Assets
        aktaAssetId: getAppIdFromEnv(ENV_VAR_NAMES.AKTA_ASSET_ID),
        bonesAssetId: getAppIdFromEnv(ENV_VAR_NAMES.BONES_ASSET_ID),
    };
}
// ============================================================================
// Network Detection from AlgorandClient
// ============================================================================
/**
 * Known algod URLs for network detection
 */
const TESTNET_URL_PATTERNS = [
    'testnet',
    'testnet.algonode.cloud',
    'testnet-api.algonode.cloud',
    'testnet-algod.algonode.cloud',
];
const MAINNET_URL_PATTERNS = [
    'mainnet',
    'mainnet.algonode.cloud',
    'mainnet-api.algonode.cloud',
    'mainnet-algod.algonode.cloud',
    'algonode.io', // mainnet uses .io
];
const LOCALNET_URL_PATTERNS = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    ':4001', // Default algod port
];
/**
 * Attempts to detect the network from an AlgorandClient instance
 * Priority: environment variable > URL detection
 * Throws if network cannot be determined
 */
export function detectNetworkFromClient(algorand) {
    // First check environment variable (explicit override)
    try {
        return getNetworkFromEnv();
    }
    catch {
        // No env var set, try URL detection
    }
    // Try to detect from client URL
    try {
        // Try multiple ways to access the URL
        let url = '';
        // accessing internal property
        const algodClient = algorand.client?.algod;
        if (algodClient) {
            // @ts-ignore - accessing internal properties
            url = algodClient.c?.baseURL || algodClient.bc?.baseURL || '';
        }
        if (typeof url === 'string' && url.length > 0) {
            const lowerUrl = url.toLowerCase();
            // Check for mainnet first (more specific)
            for (const pattern of MAINNET_URL_PATTERNS) {
                if (lowerUrl.includes(pattern)) {
                    return 'mainnet';
                }
            }
            // Check for testnet
            for (const pattern of TESTNET_URL_PATTERNS) {
                if (lowerUrl.includes(pattern)) {
                    return 'testnet';
                }
            }
            // Check for localnet
            for (const pattern of LOCALNET_URL_PATTERNS) {
                if (lowerUrl.includes(pattern)) {
                    return 'localnet';
                }
            }
        }
    }
    catch {
        // Ignore URL detection errors
    }
    // Neither env var nor URL detection worked
    throw new Error('Could not detect network. Set ALGORAND_NETWORK, ALGOD_NETWORK, or NEXT_PUBLIC_ALGOD_NETWORK ' +
        'environment variable, or use an AlgorandClient configured with a recognizable network URL.');
}
// Store the current network context (set when SDK is initialized with an AlgorandClient)
let _currentNetwork = 'localnet';
/**
 * Sets the current network context
 * Called internally when SDKs are initialized
 */
export function setCurrentNetwork(network) {
    _currentNetwork = network;
}
/**
 * Gets the current network context
 */
export function getCurrentNetwork() {
    return _currentNetwork;
}
// ============================================================================
// SDK Type to Env Var Mapping
// ============================================================================
/**
 * Mapping of SDK class names to their corresponding environment variable names
 */
export const SDK_TO_ENV_VAR = {
    // Core SDKs
    AkitaDaoSDK: ENV_VAR_NAMES.DAO_APP_ID,
    WalletSDK: ENV_VAR_NAMES.WALLET_APP_ID,
    EscrowFactorySDK: ENV_VAR_NAMES.ESCROW_FACTORY_APP_ID,
    WalletFactorySDK: ENV_VAR_NAMES.WALLET_FACTORY_APP_ID,
    SubscriptionsSDK: ENV_VAR_NAMES.SUBSCRIPTIONS_APP_ID,
    StakingPoolFactorySDK: ENV_VAR_NAMES.STAKING_POOL_FACTORY_APP_ID,
    StakingSDK: ENV_VAR_NAMES.STAKING_APP_ID,
    RewardsSDK: ENV_VAR_NAMES.REWARDS_APP_ID,
    // Factories
    AuctionFactorySDK: ENV_VAR_NAMES.AUCTION_FACTORY_APP_ID,
    MarketplaceSDK: ENV_VAR_NAMES.MARKETPLACE_APP_ID,
    RaffleFactorySDK: ENV_VAR_NAMES.RAFFLE_FACTORY_APP_ID,
    PollFactorySDK: ENV_VAR_NAMES.POLL_FACTORY_APP_ID,
    PrizeBoxFactorySDK: ENV_VAR_NAMES.PRIZE_BOX_FACTORY_APP_ID,
    // Gates & Other
    GateSDK: ENV_VAR_NAMES.GATE_APP_ID,
    HyperSwapSDK: ENV_VAR_NAMES.HYPER_SWAP_APP_ID,
    MetaMerklesSDK: ENV_VAR_NAMES.META_MERKLES_APP_ID,
};
/**
 * Gets the app ID for an SDK from environment variables
 * @param sdkName - The name of the SDK class (e.g., 'AkitaDaoSDK')
 * @returns The app ID from environment, or undefined if not found
 */
export function getAppIdForSDK(sdkName) {
    const envVarName = SDK_TO_ENV_VAR[sdkName];
    if (!envVarName)
        return undefined;
    return getAppIdFromEnv(envVarName);
}
// ============================================================================
// Configuration Helper for SDKs
// ============================================================================
/**
 * Resolves the app ID for an SDK using the following priority:
 * 1. Explicitly provided app ID
 * 2. Environment variable
 * 3. Baked-in network-specific app ID (for testnet/mainnet)
 *
 * @param providedAppId - The app ID provided directly to the constructor
 * @param envVarName - The environment variable name to check
 * @param sdkName - Name of the SDK (for error messages)
 * @param network - Optional network override (defaults to current network)
 * @returns The resolved app ID
 * @throws Error if no app ID can be resolved
 */
export function resolveAppId(providedAppId, envVarName, sdkName = 'SDK', network) {
    // 1. Use provided app ID if available
    if (providedAppId !== undefined && providedAppId > 0n) {
        return providedAppId;
    }
    // 2. Try to get from environment variable
    const envAppId = getAppIdFromEnv(envVarName);
    if (envAppId !== undefined) {
        return envAppId;
    }
    // 3. Try to get from baked-in network config
    const targetNetwork = network ?? getCurrentNetwork();
    const networkAppId = getAppIdFromNetwork(targetNetwork, envVarName);
    if (networkAppId !== undefined) {
        return networkAppId;
    }
    // No app ID found - provide helpful error
    const networkHint = targetNetwork === 'localnet'
        ? ' For localnet, you must provide app IDs explicitly or set environment variables.'
        : ` The baked-in ${targetNetwork} app IDs may not be configured yet.`;
    throw new Error(`No app ID provided for ${sdkName}. ` +
        `Either pass appId in constructor params, set ${envVarName} environment variable, ` +
        `or ensure network-specific app IDs are configured.${networkHint}`);
}
/**
 * Resolves app ID with network detection from AlgorandClient
 * This is the preferred method when you have an AlgorandClient instance
 */
export function resolveAppIdWithClient(algorand, providedAppId, envVarName, sdkName = 'SDK') {
    const network = detectNetworkFromClient(algorand);
    setCurrentNetwork(network);
    return resolveAppId(providedAppId, envVarName, sdkName, network);
}
//# sourceMappingURL=config.js.map