export * from './types'

// Configuration utilities for environment and network-based app ID resolution
export {
  type AkitaNetwork,
  type AkitaConfig,
  type EnvVarName,
  type NetworkAppIds,
  ENV_VAR_NAMES,
  getNetworkFromEnv,
  getEnvVar,
  getAppIdFromEnv,
  getConfigFromEnv,
  detectNetworkFromClient,
  getAppIdForSDK,
  resolveAppId,
  resolveAppIdWithClient,
  getCurrentNetwork,
  setCurrentNetwork,
  // Network-specific app IDs
  TESTNET_APP_IDS,
  MAINNET_APP_IDS,
  NETWORK_APP_IDS,
  getNetworkAppIds,
} from './config'

export { AuctionSDK, AuctionFactorySDK } from './auction'
export { AkitaDaoSDK } from './dao'
export { EscrowSDK, EscrowFactorySDK } from './escrow'
export { GateSDK } from './gates'
export { HyperSwapSDK } from './hyper-swap'
export { MarketplaceSDK, ListingSDK } from './marketplace'
export { MetaMerklesSDK } from './meta-merkles'
export { PollSDK, PollFactorySDK } from './poll'
export { PrizeBoxSDK, PrizeBoxFactorySDK } from './prize-box'
export { RaffleSDK, RaffleFactorySDK } from './raffle'
export { RewardsSDK } from './rewards'
export { SocialSDK } from './social'
export { StakingSDK } from './staking'
export { StakingPoolSDK, StakingPoolFactorySDK } from './staking-pool'
export { 
  SubscriptionsSDK, 
  bytesToHexColor, 
  hexColorToBytes, 
  ServicesKey,
  type Service,
  type NewServiceArgs,
  type SubscribeArgs,
  type SubscriptionInfoWithDetails,
  ServiceStatus,
  HighlightMessage,
} from './subscriptions'
export { WalletSDK, WalletFactorySDK } from './wallet'

// Connect protocol types and URI helpers
export * from './connect'

// Simulate types for transaction cost estimation
export type { 
  ExpectedCost, 
  AssetPayment, 
  AccountDelta,
  SimulatePayload 
} from './simulate/types'