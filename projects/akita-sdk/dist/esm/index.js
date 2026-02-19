"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletFactorySDK = exports.WalletSDK = exports.HighlightMessage = exports.ServiceStatus = exports.hexColorToBytes = exports.bytesToHexColor = exports.SubscriptionsSDK = exports.StakingPoolFactorySDK = exports.StakingPoolSDK = exports.StakingSDK = exports.SocialSDK = exports.RewardsSDK = exports.RaffleFactorySDK = exports.RaffleSDK = exports.PrizeBoxFactorySDK = exports.PrizeBoxSDK = exports.PollFactorySDK = exports.PollSDK = exports.MetaMerklesSDK = exports.ListingSDK = exports.MarketplaceSDK = exports.HyperSwapSDK = exports.GateSDK = exports.EscrowFactorySDK = exports.EscrowSDK = exports.AkitaDaoSDK = exports.AuctionFactorySDK = exports.AuctionSDK = exports.getNetworkAppIds = exports.NETWORK_APP_IDS = exports.MAINNET_APP_IDS = exports.TESTNET_APP_IDS = exports.setCurrentNetwork = exports.getCurrentNetwork = exports.resolveAppIdWithClient = exports.resolveAppId = exports.getAppIdForSDK = exports.detectNetworkFromClient = exports.getConfigFromEnv = exports.getAppIdFromEnv = exports.getEnvVar = exports.getNetworkFromEnv = exports.ENV_VAR_NAMES = void 0;
__exportStar(require("./types"), exports);
// Configuration utilities for environment and network-based app ID resolution
var config_1 = require("./config");
Object.defineProperty(exports, "ENV_VAR_NAMES", { enumerable: true, get: function () { return config_1.ENV_VAR_NAMES; } });
Object.defineProperty(exports, "getNetworkFromEnv", { enumerable: true, get: function () { return config_1.getNetworkFromEnv; } });
Object.defineProperty(exports, "getEnvVar", { enumerable: true, get: function () { return config_1.getEnvVar; } });
Object.defineProperty(exports, "getAppIdFromEnv", { enumerable: true, get: function () { return config_1.getAppIdFromEnv; } });
Object.defineProperty(exports, "getConfigFromEnv", { enumerable: true, get: function () { return config_1.getConfigFromEnv; } });
Object.defineProperty(exports, "detectNetworkFromClient", { enumerable: true, get: function () { return config_1.detectNetworkFromClient; } });
Object.defineProperty(exports, "getAppIdForSDK", { enumerable: true, get: function () { return config_1.getAppIdForSDK; } });
Object.defineProperty(exports, "resolveAppId", { enumerable: true, get: function () { return config_1.resolveAppId; } });
Object.defineProperty(exports, "resolveAppIdWithClient", { enumerable: true, get: function () { return config_1.resolveAppIdWithClient; } });
Object.defineProperty(exports, "getCurrentNetwork", { enumerable: true, get: function () { return config_1.getCurrentNetwork; } });
Object.defineProperty(exports, "setCurrentNetwork", { enumerable: true, get: function () { return config_1.setCurrentNetwork; } });
// Network-specific app IDs
Object.defineProperty(exports, "TESTNET_APP_IDS", { enumerable: true, get: function () { return config_1.TESTNET_APP_IDS; } });
Object.defineProperty(exports, "MAINNET_APP_IDS", { enumerable: true, get: function () { return config_1.MAINNET_APP_IDS; } });
Object.defineProperty(exports, "NETWORK_APP_IDS", { enumerable: true, get: function () { return config_1.NETWORK_APP_IDS; } });
Object.defineProperty(exports, "getNetworkAppIds", { enumerable: true, get: function () { return config_1.getNetworkAppIds; } });
var auction_1 = require("./auction");
Object.defineProperty(exports, "AuctionSDK", { enumerable: true, get: function () { return auction_1.AuctionSDK; } });
Object.defineProperty(exports, "AuctionFactorySDK", { enumerable: true, get: function () { return auction_1.AuctionFactorySDK; } });
var dao_1 = require("./dao");
Object.defineProperty(exports, "AkitaDaoSDK", { enumerable: true, get: function () { return dao_1.AkitaDaoSDK; } });
var escrow_1 = require("./escrow");
Object.defineProperty(exports, "EscrowSDK", { enumerable: true, get: function () { return escrow_1.EscrowSDK; } });
Object.defineProperty(exports, "EscrowFactorySDK", { enumerable: true, get: function () { return escrow_1.EscrowFactorySDK; } });
var gates_1 = require("./gates");
Object.defineProperty(exports, "GateSDK", { enumerable: true, get: function () { return gates_1.GateSDK; } });
var hyper_swap_1 = require("./hyper-swap");
Object.defineProperty(exports, "HyperSwapSDK", { enumerable: true, get: function () { return hyper_swap_1.HyperSwapSDK; } });
var marketplace_1 = require("./marketplace");
Object.defineProperty(exports, "MarketplaceSDK", { enumerable: true, get: function () { return marketplace_1.MarketplaceSDK; } });
Object.defineProperty(exports, "ListingSDK", { enumerable: true, get: function () { return marketplace_1.ListingSDK; } });
var meta_merkles_1 = require("./meta-merkles");
Object.defineProperty(exports, "MetaMerklesSDK", { enumerable: true, get: function () { return meta_merkles_1.MetaMerklesSDK; } });
var poll_1 = require("./poll");
Object.defineProperty(exports, "PollSDK", { enumerable: true, get: function () { return poll_1.PollSDK; } });
Object.defineProperty(exports, "PollFactorySDK", { enumerable: true, get: function () { return poll_1.PollFactorySDK; } });
var prize_box_1 = require("./prize-box");
Object.defineProperty(exports, "PrizeBoxSDK", { enumerable: true, get: function () { return prize_box_1.PrizeBoxSDK; } });
Object.defineProperty(exports, "PrizeBoxFactorySDK", { enumerable: true, get: function () { return prize_box_1.PrizeBoxFactorySDK; } });
var raffle_1 = require("./raffle");
Object.defineProperty(exports, "RaffleSDK", { enumerable: true, get: function () { return raffle_1.RaffleSDK; } });
Object.defineProperty(exports, "RaffleFactorySDK", { enumerable: true, get: function () { return raffle_1.RaffleFactorySDK; } });
var rewards_1 = require("./rewards");
Object.defineProperty(exports, "RewardsSDK", { enumerable: true, get: function () { return rewards_1.RewardsSDK; } });
var social_1 = require("./social");
Object.defineProperty(exports, "SocialSDK", { enumerable: true, get: function () { return social_1.SocialSDK; } });
var staking_1 = require("./staking");
Object.defineProperty(exports, "StakingSDK", { enumerable: true, get: function () { return staking_1.StakingSDK; } });
var staking_pool_1 = require("./staking-pool");
Object.defineProperty(exports, "StakingPoolSDK", { enumerable: true, get: function () { return staking_pool_1.StakingPoolSDK; } });
Object.defineProperty(exports, "StakingPoolFactorySDK", { enumerable: true, get: function () { return staking_pool_1.StakingPoolFactorySDK; } });
var subscriptions_1 = require("./subscriptions");
Object.defineProperty(exports, "SubscriptionsSDK", { enumerable: true, get: function () { return subscriptions_1.SubscriptionsSDK; } });
Object.defineProperty(exports, "bytesToHexColor", { enumerable: true, get: function () { return subscriptions_1.bytesToHexColor; } });
Object.defineProperty(exports, "hexColorToBytes", { enumerable: true, get: function () { return subscriptions_1.hexColorToBytes; } });
Object.defineProperty(exports, "ServiceStatus", { enumerable: true, get: function () { return subscriptions_1.ServiceStatus; } });
Object.defineProperty(exports, "HighlightMessage", { enumerable: true, get: function () { return subscriptions_1.HighlightMessage; } });
var wallet_1 = require("./wallet");
Object.defineProperty(exports, "WalletSDK", { enumerable: true, get: function () { return wallet_1.WalletSDK; } });
Object.defineProperty(exports, "WalletFactorySDK", { enumerable: true, get: function () { return wallet_1.WalletFactorySDK; } });
// Connect protocol types and URI helpers
__exportStar(require("./connect"), exports);
//# sourceMappingURL=index.js.map