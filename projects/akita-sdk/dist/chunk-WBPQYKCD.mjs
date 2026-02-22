// src/networks.ts
var LOCALNET_APP_IDS = {
  // Core Contracts
  dao: 1006n,
  wallet: 1102n,
  escrowFactory: 1004n,
  walletFactory: 1012n,
  subscriptions: 1019n,
  stakingPoolFactory: 1020n,
  staking: 1027n,
  rewards: 1008n,
  // Social System
  social: 1032n,
  socialGraph: 1031n,
  socialImpact: 1030n,
  socialModeration: 1033n,
  // Factories
  auctionFactory: 1037n,
  marketplace: 1044n,
  raffleFactory: 1045n,
  pollFactory: 1046n,
  prizeBoxFactory: 1047n,
  // Plugins
  revenueManagerPlugin: 1109n,
  updatePlugin: 1123n,
  optinPlugin: 1167n,
  asaMintPlugin: 1173n,
  payPlugin: 1174n,
  hyperSwapPlugin: 1175n,
  subscriptionsPlugin: 1176n,
  auctionPlugin: 1177n,
  daoPlugin: 1178n,
  dualStakePlugin: 1179n,
  gatePlugin: 1180n,
  marketplacePlugin: 1181n,
  nfdPlugin: 1182n,
  paySiloPlugin: 1183n,
  paySiloFactoryPlugin: 1184n,
  pollPlugin: 1185n,
  rafflePlugin: 1186n,
  rewardsPlugin: 1187n,
  socialPlugin: 1188n,
  stakingPlugin: 1189n,
  stakingPoolPlugin: 1190n,
  // Gate & Other
  gate: 1063n,
  hyperSwap: 1064n,
  metaMerkles: 1048n,
  // Subgates
  akitaReferrerGate: 1067n,
  assetGate: 1068n,
  merkleAddressGate: 1065n,
  merkleAssetGate: 1069n,
  nfdGate: 1066n,
  nfdRootGate: 1070n,
  pollGate: 1071n,
  socialActivityGate: 1072n,
  socialFollowerCountGate: 1074n,
  socialFollowerIndexGate: 1073n,
  socialImpactGate: 1075n,
  socialModeratorGate: 1076n,
  stakingAmountGate: 1080n,
  stakingPowerGate: 1077n,
  subscriptionGate: 1078n,
  subscriptionStreakGate: 1079n,
  // Assets
  akta: 1002n,
  bones: 1599n,
  usdc: 1003n,
  // External Apps
  vrfBeacon: 0n,
  nfdRegistry: 0n,
  assetInbox: 0n,
  akitaNfd: 0n
};
var TESTNET_APP_IDS = {
  // Core Contracts
  dao: 751971739n,
  wallet: 751972058n,
  escrowFactory: 751967076n,
  walletFactory: 751971757n,
  subscriptions: 751971779n,
  stakingPoolFactory: 751971794n,
  staking: 751971819n,
  rewards: 751971741n,
  // Social System
  social: 751971872n,
  socialGraph: 754162173n,
  socialImpact: 751971843n,
  socialModeration: 751971873n,
  // Factories
  auctionFactory: 751971901n,
  marketplace: 751971922n,
  raffleFactory: 751971928n,
  pollFactory: 751971931n,
  prizeBoxFactory: 751971937n,
  // Plugins
  revenueManagerPlugin: 751972084n,
  updatePlugin: 755638741n,
  optinPlugin: 751968346n,
  asaMintPlugin: 751968373n,
  payPlugin: 751968379n,
  hyperSwapPlugin: 751972295n,
  subscriptionsPlugin: 752474150n,
  auctionPlugin: 751972301n,
  daoPlugin: 751972311n,
  dualStakePlugin: 751972317n,
  gatePlugin: 751972318n,
  marketplacePlugin: 751968424n,
  nfdPlugin: 751972324n,
  paySiloPlugin: 751972334n,
  paySiloFactoryPlugin: 751968441n,
  pollPlugin: 751972340n,
  rafflePlugin: 751972341n,
  rewardsPlugin: 751972347n,
  socialPlugin: 755645846n,
  stakingPlugin: 751972363n,
  stakingPoolPlugin: 751972365n,
  // Gate & Other
  gate: 751971953n,
  hyperSwap: 751971956n,
  metaMerkles: 751971947n,
  // Subgates
  akitaReferrerGate: 751971962n,
  assetGate: 751971964n,
  merkleAddressGate: 751971975n,
  merkleAssetGate: 751971967n,
  nfdGate: 751971977n,
  nfdRootGate: 751971966n,
  pollGate: 751971963n,
  socialActivityGate: 751971965n,
  socialFollowerCountGate: 751971970n,
  socialFollowerIndexGate: 754162353n,
  socialImpactGate: 751971971n,
  socialModeratorGate: 751971972n,
  stakingAmountGate: 751971968n,
  stakingPowerGate: 751971973n,
  subscriptionGate: 751971974n,
  subscriptionStreakGate: 751971976n,
  // Assets
  akta: 752884771n,
  bones: 751973254n,
  usdc: 10458941n,
  // Testnet USDC
  // External Apps
  vrfBeacon: 600011887n,
  nfdRegistry: 84366825n,
  assetInbox: 643020148n,
  akitaNfd: 0n
};
var MAINNET_APP_IDS = {
  // Core Contracts
  dao: 3368388956n,
  wallet: 3368395481n,
  escrowFactory: 3368388829n,
  walletFactory: 3368389117n,
  subscriptions: 3368389628n,
  stakingPoolFactory: 3368391029n,
  staking: 3368393172n,
  rewards: 3368388985n,
  // Social System
  social: 3368393551n,
  socialGraph: 3414941676n,
  socialImpact: 3368393419n,
  socialModeration: 3368393629n,
  // Factories
  auctionFactory: 3368393933n,
  marketplace: 3368394180n,
  raffleFactory: 3368394210n,
  pollFactory: 3368394268n,
  prizeBoxFactory: 3368394289n,
  // Plugins
  revenueManagerPlugin: 3368395771n,
  updatePlugin: 3453512910n,
  optinPlugin: 3368398585n,
  asaMintPlugin: 3368398964n,
  payPlugin: 3368399056n,
  hyperSwapPlugin: 3368399121n,
  subscriptionsPlugin: 3378296099n,
  auctionPlugin: 3368399217n,
  daoPlugin: 3368399317n,
  dualStakePlugin: 3368399386n,
  gatePlugin: 3368399411n,
  marketplacePlugin: 3368399474n,
  nfdPlugin: 3368399559n,
  paySiloPlugin: 3368399670n,
  paySiloFactoryPlugin: 3368399704n,
  pollPlugin: 3368399770n,
  rafflePlugin: 3368399868n,
  rewardsPlugin: 3368399956n,
  socialPlugin: 3453609510n,
  stakingPlugin: 3368400044n,
  stakingPoolPlugin: 3368400148n,
  // Gate & Other
  gate: 3368394436n,
  hyperSwap: 3368394471n,
  metaMerkles: 3368394372n,
  // Subgates
  akitaReferrerGate: 3368394596n,
  assetGate: 3368394608n,
  merkleAddressGate: 3368394591n,
  merkleAssetGate: 3368394598n,
  nfdGate: 3368394599n,
  nfdRootGate: 3368394594n,
  pollGate: 3368394595n,
  socialActivityGate: 3368394606n,
  socialFollowerCountGate: 3368394601n,
  socialFollowerIndexGate: 3414942860n,
  socialImpactGate: 3368394605n,
  socialModeratorGate: 3368394602n,
  stakingAmountGate: 3368394603n,
  stakingPowerGate: 3368394600n,
  subscriptionGate: 3368394593n,
  subscriptionStreakGate: 3368394607n,
  // Assets
  akta: 523683256n,
  // Mainnet AKTA
  bones: 3368406527n,
  usdc: 31566704n,
  // Mainnet USDC
  // External Apps
  vrfBeacon: 1615566206n,
  nfdRegistry: 760937186n,
  assetInbox: 2449590623n,
  akitaNfd: 765902356n
};
var NETWORK_APP_IDS = {
  localnet: LOCALNET_APP_IDS,
  testnet: TESTNET_APP_IDS,
  mainnet: MAINNET_APP_IDS
};
function getNetworkAppIds(network) {
  return NETWORK_APP_IDS[network];
}
var ENV_TO_NETWORK_KEY = {
  DAO_APP_ID: "dao",
  WALLET_APP_ID: "wallet",
  ESCROW_FACTORY_APP_ID: "escrowFactory",
  WALLET_FACTORY_APP_ID: "walletFactory",
  SUBSCRIPTIONS_APP_ID: "subscriptions",
  STAKING_POOL_FACTORY_APP_ID: "stakingPoolFactory",
  STAKING_APP_ID: "staking",
  REWARDS_APP_ID: "rewards",
  // Social System
  SOCIAL_APP_ID: "social",
  SOCIAL_GRAPH_APP_ID: "socialGraph",
  SOCIAL_IMPACT_APP_ID: "socialImpact",
  SOCIAL_MODERATION_APP_ID: "socialModeration",
  // Factories
  AUCTION_FACTORY_APP_ID: "auctionFactory",
  MARKETPLACE_APP_ID: "marketplace",
  RAFFLE_FACTORY_APP_ID: "raffleFactory",
  POLL_FACTORY_APP_ID: "pollFactory",
  PRIZE_BOX_FACTORY_APP_ID: "prizeBoxFactory",
  // Plugins
  REVENUE_MANAGER_PLUGIN_APP_ID: "revenueManagerPlugin",
  UPDATE_PLUGIN_APP_ID: "updatePlugin",
  OPTIN_PLUGIN_APP_ID: "optinPlugin",
  ASA_MINT_PLUGIN_APP_ID: "asaMintPlugin",
  PAY_PLUGIN_APP_ID: "payPlugin",
  HYPER_SWAP_PLUGIN_APP_ID: "hyperSwapPlugin",
  SUBSCRIPTIONS_PLUGIN_APP_ID: "subscriptionsPlugin",
  AUCTION_PLUGIN_APP_ID: "auctionPlugin",
  DAO_PLUGIN_APP_ID: "daoPlugin",
  DUAL_STAKE_PLUGIN_APP_ID: "dualStakePlugin",
  GATE_PLUGIN_APP_ID: "gatePlugin",
  MARKETPLACE_PLUGIN_APP_ID: "marketplacePlugin",
  NFD_PLUGIN_APP_ID: "nfdPlugin",
  PAY_SILO_PLUGIN_APP_ID: "paySiloPlugin",
  PAY_SILO_FACTORY_PLUGIN_APP_ID: "paySiloFactoryPlugin",
  POLL_PLUGIN_APP_ID: "pollPlugin",
  RAFFLE_PLUGIN_APP_ID: "rafflePlugin",
  REWARDS_PLUGIN_APP_ID: "rewardsPlugin",
  SOCIAL_PLUGIN_APP_ID: "socialPlugin",
  STAKING_PLUGIN_APP_ID: "stakingPlugin",
  STAKING_POOL_PLUGIN_APP_ID: "stakingPoolPlugin",
  // Gate & Other
  GATE_APP_ID: "gate",
  HYPER_SWAP_APP_ID: "hyperSwap",
  META_MERKLES_APP_ID: "metaMerkles",
  // Subgates
  AKITA_REFERRER_GATE_APP_ID: "akitaReferrerGate",
  ASSET_GATE_APP_ID: "assetGate",
  MERKLE_ADDRESS_GATE_APP_ID: "merkleAddressGate",
  MERKLE_ASSET_GATE_APP_ID: "merkleAssetGate",
  NFD_GATE_APP_ID: "nfdGate",
  NFD_ROOT_GATE_APP_ID: "nfdRootGate",
  POLL_GATE_APP_ID: "pollGate",
  SOCIAL_ACTIVITY_GATE_APP_ID: "socialActivityGate",
  SOCIAL_FOLLOWER_COUNT_GATE_APP_ID: "socialFollowerCountGate",
  SOCIAL_FOLLOWER_INDEX_GATE_APP_ID: "socialFollowerIndexGate",
  SOCIAL_IMPACT_GATE_APP_ID: "socialImpactGate",
  SOCIAL_MODERATOR_GATE_APP_ID: "socialModeratorGate",
  STAKING_AMOUNT_GATE_APP_ID: "stakingAmountGate",
  STAKING_POWER_GATE_APP_ID: "stakingPowerGate",
  SUBSCRIPTION_GATE_APP_ID: "subscriptionGate",
  SUBSCRIPTION_STREAK_GATE_APP_ID: "subscriptionStreakGate",
  // Assets
  AKTA_ASSET_ID: "akta",
  BONES_ASSET_ID: "bones"
};
function getAppIdFromNetwork(network, envVarName) {
  const networkAppIds = getNetworkAppIds(network);
  const key = ENV_TO_NETWORK_KEY[envVarName];
  if (!key) return void 0;
  const appId = networkAppIds[key];
  return appId > 0n ? appId : void 0;
}

// src/config.ts
var ENV_VAR_NAMES = {
  // Network
  NETWORK: "ALGORAND_NETWORK",
  // Core Contracts
  DAO_APP_ID: "DAO_APP_ID",
  WALLET_APP_ID: "WALLET_APP_ID",
  ESCROW_FACTORY_APP_ID: "ESCROW_FACTORY_APP_ID",
  WALLET_FACTORY_APP_ID: "WALLET_FACTORY_APP_ID",
  SUBSCRIPTIONS_APP_ID: "SUBSCRIPTIONS_APP_ID",
  STAKING_POOL_FACTORY_APP_ID: "STAKING_POOL_FACTORY_APP_ID",
  STAKING_APP_ID: "STAKING_APP_ID",
  REWARDS_APP_ID: "REWARDS_APP_ID",
  // Social System
  SOCIAL_APP_ID: "SOCIAL_APP_ID",
  SOCIAL_GRAPH_APP_ID: "SOCIAL_GRAPH_APP_ID",
  SOCIAL_IMPACT_APP_ID: "SOCIAL_IMPACT_APP_ID",
  SOCIAL_MODERATION_APP_ID: "SOCIAL_MODERATION_APP_ID",
  // Factories
  AUCTION_FACTORY_APP_ID: "AUCTION_FACTORY_APP_ID",
  MARKETPLACE_APP_ID: "MARKETPLACE_APP_ID",
  RAFFLE_FACTORY_APP_ID: "RAFFLE_FACTORY_APP_ID",
  POLL_FACTORY_APP_ID: "POLL_FACTORY_APP_ID",
  PRIZE_BOX_FACTORY_APP_ID: "PRIZE_BOX_FACTORY_APP_ID",
  // Plugins
  REVENUE_MANAGER_PLUGIN_APP_ID: "REVENUE_MANAGER_PLUGIN_APP_ID",
  UPDATE_PLUGIN_APP_ID: "UPDATE_PLUGIN_APP_ID",
  OPTIN_PLUGIN_APP_ID: "OPTIN_PLUGIN_APP_ID",
  ASA_MINT_PLUGIN_APP_ID: "ASA_MINT_PLUGIN_APP_ID",
  PAY_PLUGIN_APP_ID: "PAY_PLUGIN_APP_ID",
  HYPER_SWAP_PLUGIN_APP_ID: "HYPER_SWAP_PLUGIN_APP_ID",
  SUBSCRIPTIONS_PLUGIN_APP_ID: "SUBSCRIPTIONS_PLUGIN_APP_ID",
  AUCTION_PLUGIN_APP_ID: "AUCTION_PLUGIN_APP_ID",
  DAO_PLUGIN_APP_ID: "DAO_PLUGIN_APP_ID",
  DUAL_STAKE_PLUGIN_APP_ID: "DUAL_STAKE_PLUGIN_APP_ID",
  GATE_PLUGIN_APP_ID: "GATE_PLUGIN_APP_ID",
  MARKETPLACE_PLUGIN_APP_ID: "MARKETPLACE_PLUGIN_APP_ID",
  NFD_PLUGIN_APP_ID: "NFD_PLUGIN_APP_ID",
  PAY_SILO_PLUGIN_APP_ID: "PAY_SILO_PLUGIN_APP_ID",
  PAY_SILO_FACTORY_PLUGIN_APP_ID: "PAY_SILO_FACTORY_PLUGIN_APP_ID",
  POLL_PLUGIN_APP_ID: "POLL_PLUGIN_APP_ID",
  RAFFLE_PLUGIN_APP_ID: "RAFFLE_PLUGIN_APP_ID",
  REWARDS_PLUGIN_APP_ID: "REWARDS_PLUGIN_APP_ID",
  SOCIAL_PLUGIN_APP_ID: "SOCIAL_PLUGIN_APP_ID",
  STAKING_PLUGIN_APP_ID: "STAKING_PLUGIN_APP_ID",
  STAKING_POOL_PLUGIN_APP_ID: "STAKING_POOL_PLUGIN_APP_ID",
  // Gates & Other
  GATE_APP_ID: "GATE_APP_ID",
  HYPER_SWAP_APP_ID: "HYPER_SWAP_APP_ID",
  META_MERKLES_APP_ID: "META_MERKLES_APP_ID",
  // Subgates
  AKITA_REFERRER_GATE_APP_ID: "AKITA_REFERRER_GATE_APP_ID",
  ASSET_GATE_APP_ID: "ASSET_GATE_APP_ID",
  MERKLE_ADDRESS_GATE_APP_ID: "MERKLE_ADDRESS_GATE_APP_ID",
  MERKLE_ASSET_GATE_APP_ID: "MERKLE_ASSET_GATE_APP_ID",
  NFD_GATE_APP_ID: "NFD_GATE_APP_ID",
  NFD_ROOT_GATE_APP_ID: "NFD_ROOT_GATE_APP_ID",
  POLL_GATE_APP_ID: "POLL_GATE_APP_ID",
  SOCIAL_ACTIVITY_GATE_APP_ID: "SOCIAL_ACTIVITY_GATE_APP_ID",
  SOCIAL_FOLLOWER_COUNT_GATE_APP_ID: "SOCIAL_FOLLOWER_COUNT_GATE_APP_ID",
  SOCIAL_FOLLOWER_INDEX_GATE_APP_ID: "SOCIAL_FOLLOWER_INDEX_GATE_APP_ID",
  SOCIAL_IMPACT_GATE_APP_ID: "SOCIAL_IMPACT_GATE_APP_ID",
  SOCIAL_MODERATOR_GATE_APP_ID: "SOCIAL_MODERATOR_GATE_APP_ID",
  STAKING_AMOUNT_GATE_APP_ID: "STAKING_AMOUNT_GATE_APP_ID",
  STAKING_POWER_GATE_APP_ID: "STAKING_POWER_GATE_APP_ID",
  SUBSCRIPTION_GATE_APP_ID: "SUBSCRIPTION_GATE_APP_ID",
  SUBSCRIPTION_STREAK_GATE_APP_ID: "SUBSCRIPTION_STREAK_GATE_APP_ID",
  // Assets
  AKTA_ASSET_ID: "AKTA_ASSET_ID",
  BONES_ASSET_ID: "BONES_ASSET_ID",
  // External Apps
  VRF_BEACON_APP_ID: "VRF_BEACON_APP_ID",
  NFD_REGISTRY_APP_ID: "NFD_REGISTRY_APP_ID",
  ASSET_INBOX_APP_ID: "ASSET_INBOX_APP_ID",
  AKITA_NFD_APP_ID: "AKITA_NFD_APP_ID"
};
function getNetworkFromEnv() {
  const envVarNames = [
    ENV_VAR_NAMES.NETWORK,
    // ALGORAND_NETWORK
    "ALGOD_NETWORK",
    "NEXT_PUBLIC_ALGORAND_NETWORK",
    "NEXT_PUBLIC_ALGOD_NETWORK"
  ];
  for (const name of envVarNames) {
    const network = getEnvVar(name);
    if (network === "testnet" || network === "mainnet" || network === "localnet") {
      return network;
    }
  }
  throw new Error(
    `No valid network configured. Set one of these environment variables to 'localnet', 'testnet', or 'mainnet': ${envVarNames.join(", ")}`
  );
}
function getEnvVar(name) {
  if (typeof process !== "undefined" && process.env) {
    return process.env[name];
  }
  if (typeof window !== "undefined" && window.__AKITA_ENV__) {
    return window.__AKITA_ENV__[name];
  }
  return void 0;
}
function getAppIdFromEnv(envVarName) {
  const value = getEnvVar(envVarName);
  if (!value) return void 0;
  try {
    const parsed = BigInt(value);
    return parsed > 0n ? parsed : void 0;
  } catch {
    return void 0;
  }
}
function getConfigFromEnv() {
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
    bonesAssetId: getAppIdFromEnv(ENV_VAR_NAMES.BONES_ASSET_ID)
  };
}
var TESTNET_URL_PATTERNS = [
  "testnet",
  "testnet.algonode.cloud",
  "testnet-api.algonode.cloud",
  "testnet-algod.algonode.cloud"
];
var MAINNET_URL_PATTERNS = [
  "mainnet",
  "mainnet.algonode.cloud",
  "mainnet-api.algonode.cloud",
  "mainnet-algod.algonode.cloud",
  "algonode.io"
  // mainnet uses .io
];
var LOCALNET_URL_PATTERNS = [
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  ":4001"
  // Default algod port
];
function detectNetworkFromClient(algorand) {
  var _a, _b, _c;
  const explicitNetwork = getCurrentNetwork();
  if (explicitNetwork !== void 0) {
    return explicitNetwork;
  }
  try {
    return getNetworkFromEnv();
  } catch {
  }
  try {
    let url = "";
    const algodClient = (_a = algorand.client) == null ? void 0 : _a.algod;
    if (algodClient) {
      url = ((_b = algodClient.c) == null ? void 0 : _b.baseURL) || ((_c = algodClient.bc) == null ? void 0 : _c.baseURL) || "";
    }
    if (typeof url === "string" && url.length > 0) {
      const lowerUrl = url.toLowerCase();
      for (const pattern of MAINNET_URL_PATTERNS) {
        if (lowerUrl.includes(pattern)) {
          return "mainnet";
        }
      }
      for (const pattern of TESTNET_URL_PATTERNS) {
        if (lowerUrl.includes(pattern)) {
          return "testnet";
        }
      }
      for (const pattern of LOCALNET_URL_PATTERNS) {
        if (lowerUrl.includes(pattern)) {
          return "localnet";
        }
      }
    }
  } catch {
  }
  throw new Error(
    "Could not detect network. Set ALGORAND_NETWORK, ALGOD_NETWORK, or NEXT_PUBLIC_ALGOD_NETWORK environment variable, or use an AlgorandClient configured with a recognizable network URL."
  );
}
var _currentNetwork = void 0;
function setCurrentNetwork(network) {
  _currentNetwork = network;
}
function getCurrentNetwork() {
  return _currentNetwork;
}
var SDK_TO_ENV_VAR = {
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
  MetaMerklesSDK: ENV_VAR_NAMES.META_MERKLES_APP_ID
};
function getAppIdForSDK(sdkName) {
  const envVarName = SDK_TO_ENV_VAR[sdkName];
  if (!envVarName) return void 0;
  return getAppIdFromEnv(envVarName);
}
function resolveAppId(providedAppId, envVarName, sdkName = "SDK", network) {
  if (providedAppId !== void 0 && providedAppId > 0n) {
    return providedAppId;
  }
  const envAppId = getAppIdFromEnv(envVarName);
  if (envAppId !== void 0) {
    return envAppId;
  }
  const targetNetwork = network ?? getCurrentNetwork();
  if (targetNetwork !== void 0) {
    const networkAppId = getAppIdFromNetwork(targetNetwork, envVarName);
    if (networkAppId !== void 0) {
      return networkAppId;
    }
  }
  let networkHint = "";
  if (targetNetwork === void 0) {
    networkHint = " Network could not be determined - call setCurrentNetwork() first.";
  } else if (targetNetwork === "localnet") {
    networkHint = " For localnet, you must provide app IDs explicitly or set environment variables.";
  } else {
    networkHint = ` The baked-in ${targetNetwork} app IDs may not be configured yet.`;
  }
  throw new Error(
    `No app ID provided for ${sdkName}. Either pass appId in constructor params, set ${envVarName} environment variable, or ensure network-specific app IDs are configured.${networkHint}`
  );
}
function resolveAppIdWithClient(algorand, providedAppId, envVarName, sdkName = "SDK") {
  const network = detectNetworkFromClient(algorand);
  setCurrentNetwork(network);
  return resolveAppId(providedAppId, envVarName, sdkName, network);
}

// src/constants.ts
import { makeEmptyTransactionSigner } from "algosdk";
import { microAlgo } from "@algorandfoundation/algokit-utils";
var DEFAULT_READER = "Y76M3MSY6DKBRHBL7C3NNDXGS5IIMQVQVUAB6MP4XEMMGVF2QWNPL226CA";
var emptySigner = makeEmptyTransactionSigner();
var DEFAULT_SEND_PARAMS = {
  /** Whether to use simulate to automatically populate app call resources in the txn objects. Defaults to `Config.populateAppCallResources`. */
  populateAppCallResources: true,
  /** Whether to use simulate to automatically calculate required app call inner transaction fees and cover them in the parent app call transaction fee */
  coverAppCallInnerTransactionFees: true,
  /** the maximum fee to pay */
  maxFee: microAlgo(257000n)
};
var MAX_UINT64 = BigInt("18446744073709551615");

export {
  TESTNET_APP_IDS,
  MAINNET_APP_IDS,
  NETWORK_APP_IDS,
  getNetworkAppIds,
  ENV_VAR_NAMES,
  getNetworkFromEnv,
  getEnvVar,
  getAppIdFromEnv,
  getConfigFromEnv,
  detectNetworkFromClient,
  setCurrentNetwork,
  getCurrentNetwork,
  getAppIdForSDK,
  resolveAppId,
  resolveAppIdWithClient,
  DEFAULT_READER,
  emptySigner,
  DEFAULT_SEND_PARAMS,
  MAX_UINT64
};
//# sourceMappingURL=chunk-WBPQYKCD.mjs.map