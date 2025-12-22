/**
 * Configuration module for Akita SDK
 * Handles network detection and environment-based app ID resolution
 */
import { AlgorandClient } from "@algorandfoundation/algokit-utils/types/algorand-client";
export { NetworkAppIds, getNetworkAppIds, LOCALNET_APP_IDS, TESTNET_APP_IDS, MAINNET_APP_IDS, NETWORK_APP_IDS } from "./networks";
export type AkitaNetwork = 'localnet' | 'testnet' | 'mainnet';
/**
 * Environment variable names for each SDK/contract
 */
export declare const ENV_VAR_NAMES: {
    readonly NETWORK: "ALGORAND_NETWORK";
    readonly DAO_APP_ID: "DAO_APP_ID";
    readonly WALLET_APP_ID: "WALLET_APP_ID";
    readonly ESCROW_FACTORY_APP_ID: "ESCROW_FACTORY_APP_ID";
    readonly WALLET_FACTORY_APP_ID: "WALLET_FACTORY_APP_ID";
    readonly SUBSCRIPTIONS_APP_ID: "SUBSCRIPTIONS_APP_ID";
    readonly STAKING_POOL_FACTORY_APP_ID: "STAKING_POOL_FACTORY_APP_ID";
    readonly STAKING_APP_ID: "STAKING_APP_ID";
    readonly REWARDS_APP_ID: "REWARDS_APP_ID";
    readonly SOCIAL_APP_ID: "SOCIAL_APP_ID";
    readonly SOCIAL_GRAPH_APP_ID: "SOCIAL_GRAPH_APP_ID";
    readonly SOCIAL_IMPACT_APP_ID: "SOCIAL_IMPACT_APP_ID";
    readonly SOCIAL_MODERATION_APP_ID: "SOCIAL_MODERATION_APP_ID";
    readonly AUCTION_FACTORY_APP_ID: "AUCTION_FACTORY_APP_ID";
    readonly MARKETPLACE_APP_ID: "MARKETPLACE_APP_ID";
    readonly RAFFLE_FACTORY_APP_ID: "RAFFLE_FACTORY_APP_ID";
    readonly POLL_FACTORY_APP_ID: "POLL_FACTORY_APP_ID";
    readonly PRIZE_BOX_FACTORY_APP_ID: "PRIZE_BOX_FACTORY_APP_ID";
    readonly REVENUE_MANAGER_PLUGIN_APP_ID: "REVENUE_MANAGER_PLUGIN_APP_ID";
    readonly UPDATE_PLUGIN_APP_ID: "UPDATE_PLUGIN_APP_ID";
    readonly OPTIN_PLUGIN_APP_ID: "OPTIN_PLUGIN_APP_ID";
    readonly ASA_MINT_PLUGIN_APP_ID: "ASA_MINT_PLUGIN_APP_ID";
    readonly PAY_PLUGIN_APP_ID: "PAY_PLUGIN_APP_ID";
    readonly HYPER_SWAP_PLUGIN_APP_ID: "HYPER_SWAP_PLUGIN_APP_ID";
    readonly SUBSCRIPTIONS_PLUGIN_APP_ID: "SUBSCRIPTIONS_PLUGIN_APP_ID";
    readonly AUCTION_PLUGIN_APP_ID: "AUCTION_PLUGIN_APP_ID";
    readonly DAO_PLUGIN_APP_ID: "DAO_PLUGIN_APP_ID";
    readonly DUAL_STAKE_PLUGIN_APP_ID: "DUAL_STAKE_PLUGIN_APP_ID";
    readonly GATE_PLUGIN_APP_ID: "GATE_PLUGIN_APP_ID";
    readonly MARKETPLACE_PLUGIN_APP_ID: "MARKETPLACE_PLUGIN_APP_ID";
    readonly NFD_PLUGIN_APP_ID: "NFD_PLUGIN_APP_ID";
    readonly PAY_SILO_PLUGIN_APP_ID: "PAY_SILO_PLUGIN_APP_ID";
    readonly PAY_SILO_FACTORY_PLUGIN_APP_ID: "PAY_SILO_FACTORY_PLUGIN_APP_ID";
    readonly POLL_PLUGIN_APP_ID: "POLL_PLUGIN_APP_ID";
    readonly RAFFLE_PLUGIN_APP_ID: "RAFFLE_PLUGIN_APP_ID";
    readonly REWARDS_PLUGIN_APP_ID: "REWARDS_PLUGIN_APP_ID";
    readonly SOCIAL_PLUGIN_APP_ID: "SOCIAL_PLUGIN_APP_ID";
    readonly STAKING_PLUGIN_APP_ID: "STAKING_PLUGIN_APP_ID";
    readonly STAKING_POOL_PLUGIN_APP_ID: "STAKING_POOL_PLUGIN_APP_ID";
    readonly GATE_APP_ID: "GATE_APP_ID";
    readonly HYPER_SWAP_APP_ID: "HYPER_SWAP_APP_ID";
    readonly META_MERKLES_APP_ID: "META_MERKLES_APP_ID";
    readonly AKITA_REFERRER_GATE_APP_ID: "AKITA_REFERRER_GATE_APP_ID";
    readonly ASSET_GATE_APP_ID: "ASSET_GATE_APP_ID";
    readonly MERKLE_ADDRESS_GATE_APP_ID: "MERKLE_ADDRESS_GATE_APP_ID";
    readonly MERKLE_ASSET_GATE_APP_ID: "MERKLE_ASSET_GATE_APP_ID";
    readonly NFD_GATE_APP_ID: "NFD_GATE_APP_ID";
    readonly NFD_ROOT_GATE_APP_ID: "NFD_ROOT_GATE_APP_ID";
    readonly POLL_GATE_APP_ID: "POLL_GATE_APP_ID";
    readonly SOCIAL_ACTIVITY_GATE_APP_ID: "SOCIAL_ACTIVITY_GATE_APP_ID";
    readonly SOCIAL_FOLLOWER_COUNT_GATE_APP_ID: "SOCIAL_FOLLOWER_COUNT_GATE_APP_ID";
    readonly SOCIAL_FOLLOWER_INDEX_GATE_APP_ID: "SOCIAL_FOLLOWER_INDEX_GATE_APP_ID";
    readonly SOCIAL_IMPACT_GATE_APP_ID: "SOCIAL_IMPACT_GATE_APP_ID";
    readonly SOCIAL_MODERATOR_GATE_APP_ID: "SOCIAL_MODERATOR_GATE_APP_ID";
    readonly STAKING_AMOUNT_GATE_APP_ID: "STAKING_AMOUNT_GATE_APP_ID";
    readonly STAKING_POWER_GATE_APP_ID: "STAKING_POWER_GATE_APP_ID";
    readonly SUBSCRIPTION_GATE_APP_ID: "SUBSCRIPTION_GATE_APP_ID";
    readonly SUBSCRIPTION_STREAK_GATE_APP_ID: "SUBSCRIPTION_STREAK_GATE_APP_ID";
    readonly AKTA_ASSET_ID: "AKTA_ASSET_ID";
    readonly BONES_ASSET_ID: "BONES_ASSET_ID";
    readonly VRF_BEACON_APP_ID: "VRF_BEACON_APP_ID";
    readonly NFD_REGISTRY_APP_ID: "NFD_REGISTRY_APP_ID";
    readonly ASSET_INBOX_APP_ID: "ASSET_INBOX_APP_ID";
    readonly AKITA_NFD_APP_ID: "AKITA_NFD_APP_ID";
};
export type EnvVarName = keyof typeof ENV_VAR_NAMES;
/**
 * Full configuration object containing all app IDs
 */
export interface AkitaConfig {
    network: AkitaNetwork;
    daoAppId?: bigint;
    walletAppId?: bigint;
    escrowFactoryAppId?: bigint;
    walletFactoryAppId?: bigint;
    subscriptionsAppId?: bigint;
    stakingPoolFactoryAppId?: bigint;
    stakingAppId?: bigint;
    rewardsAppId?: bigint;
    socialAppId?: bigint;
    socialGraphAppId?: bigint;
    socialImpactAppId?: bigint;
    socialModerationAppId?: bigint;
    auctionFactoryAppId?: bigint;
    marketplaceAppId?: bigint;
    raffleFactoryAppId?: bigint;
    pollFactoryAppId?: bigint;
    prizeBoxFactoryAppId?: bigint;
    gateAppId?: bigint;
    hyperSwapAppId?: bigint;
    metaMerklesAppId?: bigint;
    aktaAssetId?: bigint;
    bonesAssetId?: bigint;
}
/**
 * Gets the current network from environment variables
 * Throws an error if no valid network is configured
 *
 * Checks multiple env var names for compatibility:
 * - ALGORAND_NETWORK (SDK standard)
 * - ALGOD_NETWORK (common alternative)
 * - NEXT_PUBLIC_* variants (for Next.js client-side)
 */
export declare function getNetworkFromEnv(): AkitaNetwork;
/**
 * Gets an environment variable value
 * Works in both Node.js and browser environments
 */
export declare function getEnvVar(name: string): string | undefined;
/**
 * Gets an app ID from environment variables
 * Returns undefined if the env var is not set or is not a valid bigint
 */
export declare function getAppIdFromEnv(envVarName: string): bigint | undefined;
/**
 * Gets the full configuration from environment variables
 */
export declare function getConfigFromEnv(): AkitaConfig;
/**
 * Attempts to detect the network from an AlgorandClient instance
 * Priority: environment variable > URL detection
 * Throws if network cannot be determined
 */
export declare function detectNetworkFromClient(algorand: AlgorandClient): AkitaNetwork;
/**
 * Sets the current network context
 * Called internally when SDKs are initialized
 */
export declare function setCurrentNetwork(network: AkitaNetwork): void;
/**
 * Gets the current network context
 */
export declare function getCurrentNetwork(): AkitaNetwork;
/**
 * Mapping of SDK class names to their corresponding environment variable names
 */
export declare const SDK_TO_ENV_VAR: Record<string, string>;
/**
 * Gets the app ID for an SDK from environment variables
 * @param sdkName - The name of the SDK class (e.g., 'AkitaDaoSDK')
 * @returns The app ID from environment, or undefined if not found
 */
export declare function getAppIdForSDK(sdkName: string): bigint | undefined;
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
export declare function resolveAppId(providedAppId: bigint | undefined, envVarName: string, sdkName?: string, network?: AkitaNetwork): bigint;
/**
 * Resolves app ID with network detection from AlgorandClient
 * This is the preferred method when you have an AlgorandClient instance
 */
export declare function resolveAppIdWithClient(algorand: AlgorandClient, providedAppId: bigint | undefined, envVarName: string, sdkName?: string): bigint;
